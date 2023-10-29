using MediatR;

namespace DolosTranscriptParser.Commands.ParseTranscript;

public class ParseTranscriptRequest : IRequest<ParseTranscriptResponse>
{
    public string? TranscriptUrl { get; set; }
}