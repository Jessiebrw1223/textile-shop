FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY TextileOasis.API/TextileOasis.API.csproj TextileOasis.API/
COPY TextileOasis.Application/TextileOasis.Application.csproj TextileOasis.Application/
COPY TextileOasis.Domain/TextileOasis.Domain.csproj TextileOasis.Domain/
COPY TextileOasis.Infrastructure/TextileOasis.Infrastructure.csproj TextileOasis.Infrastructure/

RUN dotnet restore TextileOasis.API/TextileOasis.API.csproj

COPY . .
WORKDIR /src/TextileOasis.API
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TextileOasis.API.dll"]