using DolosTranscriptParser.Models;

namespace DolosTranscriptParser.Commands.ParseTranscript;

public class ParseTranscriptResponse
{
    public string? Guest { get; set; }
    public List<PromptCompletionPair>? Prompts { get; set; }
}

