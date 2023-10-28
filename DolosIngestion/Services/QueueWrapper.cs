using Amazon;
using Amazon.SQS;
using Amazon.SQS.Model;

namespace DolosIngestion.Services;

public interface IQueueWrapper
{
    Task<bool> SendMessageAsync(string messageBody);
}

public class QueueWrapper : IQueueWrapper
{
    private readonly string _queueUrl;
    private readonly AmazonSQSClient _sqsClient;

    public QueueWrapper(string queueUrl)
    {
        _queueUrl = queueUrl;
        _sqsClient = new AmazonSQSClient(new AmazonSQSConfig
        {
            RegionEndpoint = RegionEndpoint.USEast2
        });
    }

    public async Task<bool> SendMessageAsync(string messageBody)
    {
        try
        {
            var sendMessageRequest = new SendMessageRequest
            {
                QueueUrl = _queueUrl,
                MessageBody = messageBody
            };

            await _sqsClient.SendMessageAsync(sendMessageRequest);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
    }
}

