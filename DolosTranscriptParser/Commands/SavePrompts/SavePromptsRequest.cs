using DolosTranscriptParser.Models;
using MediatR;

namespace DolosTranscriptParser.Commands.SavePrompts;

public class SavePromptsRequest : IRequest<SavePromptsResponse>
{
    public string? Guest { get; set; }
    public List<PromptCompletionPair>? Prompts { get; set; }
}