using MediatR;
using DolosTranscriptParser.Repos;

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
            await _dynamoRepo.UpdateOrInsertGuestDataAsync(request.Guest!, request.Prompts!);
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