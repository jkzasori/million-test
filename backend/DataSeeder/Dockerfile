# DataSeeder Dockerfile for Million Test
FROM mcr.microsoft.com/dotnet/runtime:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files
COPY ["DataSeeder.csproj", "."]

# Restore dependencies
RUN dotnet restore "DataSeeder.csproj"

# Copy source code
COPY . .

# Build the application
RUN dotnet build "DataSeeder.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DataSeeder.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

# Copy published application
COPY --from=publish /app/publish .

# Create a non-root user for security
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

ENTRYPOINT ["dotnet", "DataSeeder.dll"]