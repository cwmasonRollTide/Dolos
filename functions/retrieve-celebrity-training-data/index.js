const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new DynamoDBClient({ region: "us-east-2" });
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

exports.handler = async (event) => {
	const guest = event.queryStringParameters?.guest;
	if (!guest) {
		return { statusCode: 400, body: "Guest name is required" };
	}

	const params = {
		TableName: process.env.TABLE_NAME,
		KeyConditionExpression: "#guest = :guestValue",
		ExpressionAttributeNames: {
			"#guest": "guest"
		},
		ExpressionAttributeValues: {
			":guestValue": { S: guest }
		}
	};

	try {
		const result = await dynamoDBClient.send(new QueryCommand(params));
		if (!result.Items || result.Items.length === 0) {
			return { statusCode: 404, body: "No records found for the provided guest name" };
		}

		const item = result.Items[0]; // Assuming only one item per guest
		const signedUrl = await getSignedUrl(
			S3Client,
			new GetObjectCommand({
				Bucket: process.env.S3_BUCKET_NAME,
				Key: item.image
			})
		);
		// Format data into the required structure
		const formattedData = {
			image: signedUrl,
			guest: item.guest.S, // Assuming 'guest' is stored as a string
			prompts: item.prompts.L.map(promptItem => ({
				prompt: promptItem.M.prompt.S,
				completion: promptItem.M.completion.S
			}))
		};

		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Content-Type,Authorization",
				"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
			},
			body: JSON.stringify(formattedData)
		};
	} catch (error) {
		console.error("Error querying DynamoDB:", error.message);
		return { statusCode: 500, body: "Internal Server Error" };
	}
};
