const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dynamoDBClient = new DynamoDBClient({ region: "us-east-2" });
const s3Client = new S3Client({ region: "us-east-2" });

exports.handler = async (event) => {

	try {
		const guest = event.JSON.parse(event.body).guest;
		const updatedPrompts = JSON.parse(event.body).prompts;

		let imageKey;

		if (event.body.image) {
			const {Key} = await uploadToS3(event.body.image);
			imageKey = Key;
		}

		const params = {
			TableName: process.env.TABLE_NAME,
			Item: {
				"guest": guest,
				"prompts": updatedPrompts,
				"image": imageKey // Save S3 key 
			}
		};

		await dynamoDBClient.send(new PutItemCommand(params));

		return {
			"statusCode": 200,
			"headers": {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Content-Type,Authorization",
				"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
			},
			body: 'Prompts updated successfully'
		};
	} catch (error) {
		console.error("Error putting into DynamoDB:", error.message);
		return { statusCode: 500, body: "Internal Server Error" };
	}
};

async function uploadToS3(image) {

	const buffer = Buffer.from(image, 'base64');

	const params = {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: `${guest}/profile.jpg`,
		Body: buffer
	};

	const command = new PutObjectCommand(params);

	return await s3Client.send(command);
}
