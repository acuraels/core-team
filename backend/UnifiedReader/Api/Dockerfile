FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /src

COPY ["backend/UnifiedReader/Api/Api.csproj", "backend/UnifiedReader/Api/"]
COPY ["backend/UnifiedReader/Logic/Logic.csproj", "backend/UnifiedReader/Logic/"]
COPY ["backend/UnifiedReader/Dal/Dal.csproj", "backend/UnifiedReader/Dal/"]
COPY ["backend/Libs/InfraLib/InfraLib.csproj", "backend/Libs/InfraLib/"]

RUN dotnet restore "backend/UnifiedReader/Api/Api.csproj"
COPY . .

WORKDIR "/src/backend/UnifiedReader/Api"
RUN dotnet publish "Api.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore \
    --self-contained false

FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS final
WORKDIR /app

RUN apk add --no-cache icu-libs icu-data-full

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    ASPNETCORE_URLS=http://+:8080

EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]