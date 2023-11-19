const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const dynamoDBClient = new DynamoDBClient({ region: "us-east-2" });
const s3Client = new S3Client({ region: "us-east-2" });

function simplifyDynamoItem(item) {
	let simplified = {};
	for (let key in item) {
		if (item[key].S !== undefined) {
			simplified[key] = item[key].S;
		} else if (item[key].N !== undefined) {
			simplified[key] = parseFloat(item[key].N);
		} else if (item[key] !== undefined) {
			simplified[key] = item[key];
		}
	}
	return simplified;
}

exports.handler = async (event) => {
	const guest = event.queryStringParameters?.guest;
	if (!guest) {
		return { statusCode: 400, body: "Email is required" };
	}

	const params = {
		TableName: process.env.TABLE_NAME,
		IndexName: 'Guest',
		ExpressionAttributeNames: {
			"#guest": "guest"
		},
		ExpressionAttributeValues: {
			":guestValue": { S: guest }
		},
		KeyConditionExpression: "#email = :guestValue",
	};

	try {
		console.log("Params for DynamoDB Query:", JSON.stringify(params, null, 2));
		const result = await dynamoDBClient.send(new QueryCommand(params));
		console.log(JSON.stringify(result));
		if (!result.Items || result.Items.length === 0) {
			return { statusCode: 404, body: "No events found for the provided email" };
		}
		
		const eventsWithPresignedUrls = await Promise.all(
			result.Items.map(async (item) => {
				console.log("Processing item: ", JSON.stringify(item));
				// Check if profileImage exists and has an 'S' property
				if (item.imageKey && item.imageKey.S) {
					const getObjectParams = {
						Bucket: process.env.S3_BUCKET_NAME,
						Key: item.imageKey.S,
					};
					const presignedUrl = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 36000 });
					console.log("Generated pre-signed URL: ", presignedUrl);

					return {
						...item,
						image: presignedUrl
					};
				} else {
					// If imageKey doesn't exist or doesn't have an 'S' property, return the item as-is
					return item;
				}
			})
		);

		const flatItems = eventsWithPresignedUrls.map(simplifyDynamoItem);

		return {
			"statusCode": 200,
			"headers": {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Content-Type,Authorization",
				"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
			},
			"body": JSON.stringify(flatItems)
		};
	} catch (error) {
		console.error("Error querying DynamoDB:", error.message);
		return { statusCode: 500, body: "Internal Server Error" };
	}
};
