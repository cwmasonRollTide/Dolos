FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

COPY ./*.csproj ./DolosIngestion/
RUN dotnet restore ./DolosIngestion/DolosIngestion.csproj

COPY ./ ./DolosIngestion/
WORKDIR /app/DolosIngestion
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/DolosIngestion/out .

ENTRYPOINT ["dotnet", "DolosIngestion.dll"]