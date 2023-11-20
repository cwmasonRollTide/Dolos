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

	let guests = [];
	let items;
	do {
		items = await dynamoDBClient.send(new ScanCommand(params));
		items.Items.forEach((item) => guests.push(item.guest.S));

		params.ExclusiveStartKey = items.LastEvaluatedKey;
	} while (typeof items.LastEvaluatedKey !== 'undefined');

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Content-Type,Authorization",
			"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
		},
		body: JSON.stringify(guests)
	};
};
