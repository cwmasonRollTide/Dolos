FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

COPY ./DolosIngestion/*.csproj ./DolosIngestion/
RUN dotnet restore ./DolosIngestion/DolosIngestion.csproj

COPY ./DolosIngestion/ ./DolosIngestion/
WORKDIR /app/DolosIngestion
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/DolosIngestion/out .

EXPOSE port 80

ENTRYPOINT ["dotnet", "DolosIngestion.dll"]
