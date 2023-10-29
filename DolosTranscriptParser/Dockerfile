FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

COPY ./*.csproj ./DolosTranscriptParser/
RUN dotnet restore ./DolosTranscriptParser/DolosTranscriptParser.csproj

COPY ./ ./DolosTranscriptParser/
WORKDIR /app/DolosTranscriptParser
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/DolosTranscriptParser/out .

ENTRYPOINT ["dotnet", "DolosTranscriptParser.dll"]