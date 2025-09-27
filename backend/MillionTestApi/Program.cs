using MillionTestApi.Models;
using MillionTestApi.Application.Services;
using MillionTestApi.Domain.Repositories;
using MillionTestApi.Infrastructure.Repositories;
using MillionTestApi.Infrastructure.Middleware;
using MillionTestApi.Infrastructure.Services;
using MillionTestApi.Infrastructure.Extensions;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings"));

// Caching
builder.Services.AddMemoryCache();
builder.Services.AddScoped<ICacheService, MemoryCacheService>();

// Dependency injection
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IPropertyService, PropertyService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Initialize database indexes
using (var scope = app.Services.CreateScope())
{
    var databaseSettings = scope.ServiceProvider.GetRequiredService<IOptions<DatabaseSettings>>();
    var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
    var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
    await mongoDatabase.CreateIndexesAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Global exception handling middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

// app.UseHttpsRedirection(); // Disabled for development
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
