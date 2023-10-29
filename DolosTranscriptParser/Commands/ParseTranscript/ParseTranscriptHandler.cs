using MediatR;
using DolosTranscriptParser.Models;
using DolosTranscriptParser.Services.Parsing;

namespace DolosTranscriptParser.Commands.ParseTranscript;

public class ParseTranscriptHandler : IRequestHandler<ParseTranscriptRequest, ParseTranscriptResponse>
{
    private readonly HttpClient _httpClient;

    public ParseTranscriptHandler(IHttpClientFactory clientFactory)
    {
        _httpClient = clientFactory.CreateClient();
    }
    
    public async Task<ParseTranscriptResponse> Handle(ParseTranscriptRequest request, CancellationToken cancellationToken)
    {
        string rawTranscriptResponse = await _httpClient.GetStringAsync(request.TranscriptUrl, cancellationToken);
        string guestName = TranscriptParser.ExtractGuestName(rawTranscriptResponse);
        
        if (string.IsNullOrEmpty(guestName))
            throw new Exception("Unable to parse guest name");

        List<PromptCompletionPair> prompts = TranscriptParser.ExtractPromptCompletionPairs(rawTranscriptResponse, guestName);
        return new ParseTranscriptResponse
        {
            Guest = guestName,
            Prompts = prompts
        };
    }
}