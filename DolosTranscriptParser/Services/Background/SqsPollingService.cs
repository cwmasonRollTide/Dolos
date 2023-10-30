using Amazon;
using MediatR;
using Amazon.SQS;
using Amazon.SQS.Model;
using DolosTranscriptParser.Commands.ParseTranscript;
using DolosTranscriptParser.Commands.SavePrompts;

namespace DolosTranscriptParser.Services.Background;

public class SqsPollingService : BackgroundService
{
    private ISender _mediator;

    public SqsPollingService(ISender mediator)
    {
        _mediator = mediator;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var client = new AmazonSQSClient(RegionEndpoint.USEast2);

        while (!stoppingToken.IsCancellationRequested)
        {
            var request = new ReceiveMessageRequest
            {
                QueueUrl = Environment.GetEnvironmentVariable("SQS_QUEUE_URL"),
                MaxNumberOfMessages = 5
            };
            ReceiveMessageResponse? response = await client.ReceiveMessageAsync(request, stoppingToken);
            
            await Task.WhenAll(response.Messages.Select(async message => 
            {
                Console.WriteLine("New message received, url:");
                Console.WriteLine(message.Body);
                
                ParseTranscriptResponse promptTokens = await _mediator.Send(new ParseTranscriptRequest
                {
                    TranscriptUrl = message.Body
                }, stoppingToken);
                
                Console.WriteLine($"Transcript processed successfully for url: {message.Body}");
                
                SavePromptsResponse saveToStorage = await _mediator.Send(new SavePromptsRequest
                {
                    Guest = promptTokens.Guest,
                    Prompts = promptTokens.Prompts
                }, stoppingToken);
                
                if (saveToStorage.Success) Console.WriteLine($"Successfully saved interview prompt and completions");
                
                await client.DeleteMessageAsync(new DeleteMessageRequest
                {
                    QueueUrl = Environment.GetEnvironmentVariable("SQS_QUEUE_URL"),
                    ReceiptHandle = message.ReceiptHandle
                }, stoppingToken);
            }));
        }
    }
}