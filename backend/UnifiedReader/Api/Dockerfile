FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# SDK
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["backend/UnifiedReader/Api/Api.csproj", "backend/UnifiedReader/Api/"]
COPY ["backend/UnifiedReader/Logic/Logic.csproj", "backend/UnifiedReader/Logic/"]
COPY ["backend/UnifiedReader/Dal/Dal.csproj", "backend/UnifiedReader/Dal/"]
COPY ["backend/Libs/InfraLib/InfraLib.csproj", "backend/Libs/InfraLib/"]

RUN dotnet restore "backend/UnifiedReader/Api/Api.csproj"

COPY . .

WORKDIR "/src/backend/UnifiedReader/Api"
RUN dotnet publish "Api.csproj" -c Release -o /app/publish --no-restore

# Финальный образ
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Api.dll"]