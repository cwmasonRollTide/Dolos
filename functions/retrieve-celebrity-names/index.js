const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new DynamoDBClient({ region: "us-east-2" });

exports.handler = async (event) => {
	const params = {
		TableName: process.env.TABLE_NAME,
		ProjectionExpression: "#guest",
		ExpressionAttributeNames: {
			"#guest": "guest"
		}
	};

	try {
		const result = await dynamoDBClient.send(new ScanCommand(params));
		const guests = result.Items.map(item => item.guest.S);
		return {
			"statusCode": 200,
			"headers": {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Content-Type,Authorization",
				"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
			},
			"body": JSON.stringify(guests)
		};
	} catch (error) {
		console.error("Error scanning DynamoDB:", error.message);
		return { statusCode: 500, body: "Internal Server Error" };
	}
};
