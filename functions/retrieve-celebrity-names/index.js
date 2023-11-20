const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new DynamoDBClient({ region: "us-east-2" });

exports.handler = async (event) => {
	const guest = event.queryStringParameters?.guest;
	if (!guest) {
		return { statusCode: 400, body: "Email is required" };
	}

	const params = {
		TableName: process.env.TABLE_NAME,
		IndexName: 'Guest',
		ProjectionExpression: "#guest",
		ExpressionAttributeNames: {
			"#guest": "guest"
		}
	};

	try {
		console.log("Params for DynamoDB Query:", JSON.stringify(params, null, 2));
		const result = await dynamoDBClient.send(new QueryCommand(params));
		console.log(JSON.stringify(result));
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
		console.error("Error querying DynamoDB:", error.message);
		return { statusCode: 500, body: "Internal Server Error" };
	}
};
