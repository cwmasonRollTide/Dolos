using MediatR;
using Microsoft.AspNetCore.Mvc;
using DolosTranscriptParser.Commands.ParseTranscript;

namespace DolosTranscriptParser.Controllers;

public class ParseTranscriptController : ControllerBase
{
    private readonly ISender _mediator;
    
    public ParseTranscriptController(ISender mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet(nameof(ParseTranscript))]
    public async Task<ParseTranscriptResponse> ParseTranscript(string url)
    {
        return await _mediator.Send(new ParseTranscriptRequest
        {
            TranscriptUrl = url
        });
    }
}