using DolosIngestion.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();
builder.Services.AddHttpClient();

builder.Services.AddSingleton<IIngestMainPage, IngestMainPageService>();

WebApplication app = builder.Build();

app.MapHealthChecks("/health");

app.MapGet("/ingest", async (string url, IIngestMainPage ingestMain) => await ingestMain.Run(url));

app.Run();
