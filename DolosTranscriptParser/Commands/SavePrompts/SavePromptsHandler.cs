using Amazon.DynamoDBv2.Model;
using DolosTranscriptParser.Repos;
using MediatR;

namespace DolosTranscriptParser.Commands.SavePrompts;

public class SavePromptsHandler : IRequestHandler<SavePromptsRequest, SavePromptsResponse>
{
    private readonly IDynamoDbRepository _dynamoRepo;

    public SavePromptsHandler(IDynamoDbRepository dynamoDbRepository)
    {
        _dynamoRepo = dynamoDbRepository;
    }
    
    public async Task<SavePromptsResponse> Handle(SavePromptsRequest request, CancellationToken cancellationToken)
    {
        var isSuccessful = false;
        try
        {
            List<AttributeValue> newPrompts = request.Prompts!.Select(p => new AttributeValue
            {
                M = new Dictionary<string, AttributeValue>
                {
                    {"prompt", new AttributeValue { S = p.Prompt }},
                    {"completion", new AttributeValue { S = p.Completion }}
                }
            }).ToList();

            await _dynamoRepo.UpdateOrInsertGuestDataAsync(request.Guest!, newPrompts);

            isSuccessful = true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }

        return new SavePromptsResponse
        {
            Success = isSuccessful
        };
    }
}