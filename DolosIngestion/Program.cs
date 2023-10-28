using DolosIngestion.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();
builder.Services.AddHttpClient();

builder.Services.AddSingleton<IIngestMainPage, IngestMainPageService>();
builder.Services.AddSingleton<IQueueWrapper, QueueWrapper>(sp => 
    new QueueWrapper(Environment.GetEnvironmentVariable("SQS_QUEUE_URL") ?? string.Empty));

WebApplication app = builder.Build();

app.MapHealthChecks("/health");

app.MapGet("/ingest", async (string url, IIngestMainPage ingestMain) => await ingestMain.Run(url));

app.Run();
