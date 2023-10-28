using DolosIngestion.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();
builder.Services.AddHttpClient();

builder.Services.AddSingleton<IIngestMainPage, IngestMainPageService>();

WebApplication app = builder.Build();

app.MapHealthChecks("/health");

app.MapGet("/ingest", async (string url, IHttpClientFactory clientFactory, IIngestMainPage ingestMain) => 
{
    HttpClient? client = clientFactory.CreateClient();
    string response = await client.GetStringAsync(url);
    return await ingestMain.Run(response);
});

app.Run();
