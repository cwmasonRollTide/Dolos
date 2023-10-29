using FluentValidation;

namespace DolosTranscriptParser.Commands.SavePrompts;

public class SavePromptsValidator : AbstractValidator<SavePromptsRequest>
{
    public SavePromptsValidator()
    {
        RuleFor(x => x.Guest).NotEmpty().WithMessage("Guest cannot be null, empty, or whitespace.");
        RuleFor(x => x.Prompts).NotEmpty().WithMessage("Prompts list cannot be null or empty.");
    }
}