using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using DolosTranscriptParser.Models;

namespace DolosTranscriptParser.Repos;

public interface IDynamoDbRepository
{
    Task UpdateOrInsertGuestDataAsync(string guest, IEnumerable<PromptCompletionPair> prompts);
}

public class DynamoDbRepository : IDynamoDbRepository
{
    private readonly AmazonDynamoDBClient _client;
    private readonly string? _tableName = Environment.GetEnvironmentVariable("DYNAMO_DB_TABLE");

    public DynamoDbRepository()
    {
        _client = new AmazonDynamoDBClient();
    }

    public async Task UpdateOrInsertGuestDataAsync(string guest, IEnumerable<PromptCompletionPair> prompts)
    {
        List<AttributeValue> newPrompts = prompts.Select(p => new AttributeValue
        {
            M = new Dictionary<string, AttributeValue>
            {
                {"prompt", new AttributeValue { S = p.Prompt }},
                {"completion", new AttributeValue { S = p.Completion }}
            }
        }).ToList();
        
        var queryRequest = new QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "guest = :guestValue",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                {":guestValue", new AttributeValue { S = guest }}
            }
        };

        QueryResponse? response = await _client.QueryAsync(queryRequest);

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