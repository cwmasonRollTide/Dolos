using MediatR;
using FluentValidation;
using System.Reflection;
using Microsoft.OpenApi.Models;
using DolosTranscriptParser.Repos;
using DolosTranscriptParser.Services.Background;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddHttpClient();
builder.Services.AddHealthChecks();
builder.Services.AddControllers();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
foreach (Type validator in Assembly.GetExecutingAssembly().ExportedTypes
             .Where(t => t.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IValidator<>)))
             .ToArray())
{
    builder.Services.AddScoped(validator);
}
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
builder.Services.AddSingleton<IDynamoDbRepository, DynamoDbRepository>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        bldr => 
        {
            bldr.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Parse Transcript", Version = "v1" });
});

WebApplication app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
    });
}

// app.UseHttpsRedirection();
app.UseStaticFiles();
app.MapHealthChecks("/health");

app.UseRouting();

// app.UseAuthorization();
app.UseCors();
app.MapControllers();

app.Run();