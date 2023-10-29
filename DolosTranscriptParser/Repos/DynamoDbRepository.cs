using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

namespace DolosTranscriptParser.Repos;

public interface IDynamoDbRepository
{
    Task UpdateOrInsertGuestDataAsync(string guest, List<AttributeValue> newPrompts);
}

public class DynamoDbRepository : IDynamoDbRepository
{
    private readonly AmazonDynamoDBClient _client;
    private readonly string? _tableName = Environment.GetEnvironmentVariable("DYNAMO_DB_TABLE");

    public DynamoDbRepository()
    {
        _client = new AmazonDynamoDBClient();
    }

    public async Task UpdateOrInsertGuestDataAsync(string guest, List<AttributeValue> newPrompts)
    {
        var queryRequest = new QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "guest = :guestValue",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                {":guestValue", new AttributeValue { S = guest }}
            }
        };

        var response = await _client.QueryAsync(queryRequest);

        if (response.Items.Count > 0)
        {
            // Item exists. Update it.
            var updateRequest = new UpdateItemRequest
            {
                TableName = _tableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    {"guest", new AttributeValue { S = guest }}
                },
                UpdateExpression = "SET Prompts = list_append(Prompts, :newPrompts)",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    {":newPrompts", new AttributeValue { L = newPrompts }}
                }
            };

            await _client.UpdateItemAsync(updateRequest);
        }
        else
        {
            // Item doesn't exist. Insert a new item.
            var putRequest = new PutItemRequest
            {
                TableName = _tableName,
                Item = new Dictionary<string, AttributeValue>
                {
                    {"guest", new AttributeValue { S = guest }},
                    {"prompts", new AttributeValue { L = newPrompts }}
                }
            };

            await _client.PutItemAsync(putRequest);
        }
    }
}