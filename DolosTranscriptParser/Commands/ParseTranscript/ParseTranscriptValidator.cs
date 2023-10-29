using FluentValidation;

namespace DolosTranscriptParser.Commands.ParseTranscript;

public class ParseTranscriptValidator : AbstractValidator<ParseTranscriptRequest>
{
    public ParseTranscriptValidator()
    {
        RuleFor(x => x.TranscriptUrl).NotEmpty().WithMessage("Url must be valid. Cannot be null, empty, or whitespace.");
    }
}