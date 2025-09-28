using Microsoft.AspNetCore.Mvc.Testing;
using MongoDB.Driver;
using NUnit.Framework;
using System.Net;
using System.Text.Json;
using MillionTestApi.Models;

namespace MillionTestApi.Tests.Integration;

[TestFixture]
public class PropertiesControllerIntegrationTests
{
    private WebApplicationFactory<Program> _factory = null!;
    private HttpClient _client = null!;
    private IMongoDatabase _testDatabase = null!;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Override MongoDB connection for testing
                    services.Configure<DatabaseSettings>(options =>
                    {
                        options.ConnectionString = "mongodb://admin:million123@localhost:27017/MillionTestPropertiesTest?authSource=admin";
                        options.DatabaseName = "MillionTestPropertiesTest";
                    });
                });
            });

        _client = _factory.CreateClient();
        
        // Get test database reference
        var services = _factory.Services;
        var mongoClient = services.GetRequiredService<IMongoClient>();
        _testDatabase = mongoClient.GetDatabase("MillionTestPropertiesTest");
    }

    [SetUp]
    public void SetUp()
    {
        // Clean test database before each test
        _testDatabase.DropCollection("Properties");
        _testDatabase.DropCollection("Owners");
        _testDatabase.DropCollection("PropertyImages");
        _testDatabase.DropCollection("PropertyTraces");
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _client?.Dispose();
        _factory?.Dispose();
    }

    [Test]
    public async Task GetProperties_EmptyDatabase_ReturnsEmptyList()
    {
        // Act
        var response = await _client.GetAsync("/api/properties");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PaginatedResult<Property>>(content, JsonOptions);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Data, Is.Empty);
        Assert.That(result.TotalCount, Is.EqualTo(0));
    }

    [Test]
    public async Task GetProperties_WithData_ReturnsPaginatedProperties()
    {
        // Arrange
        await SeedTestData();

        // Act
        var response = await _client.GetAsync("/api/properties?page=1&pageSize=10");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PaginatedResult<Property>>(content, JsonOptions);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Data, Is.Not.Empty);
        Assert.That(result!.TotalCount, Is.GreaterThan(0));
        Assert.That(result.Data.Count, Is.LessThanOrEqualTo(10));
    }

    [Test]
    public async Task GetProperty_ExistingId_ReturnsProperty()
    {
        // Arrange
        var testProperty = await SeedSingleProperty();

        // Act
        var response = await _client.GetAsync($"/api/properties/{testProperty.IdProperty}");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PropertyDetailDto>(content, JsonOptions);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.IdProperty, Is.EqualTo(testProperty.IdProperty));
        Assert.That(result.Name, Is.EqualTo(testProperty.Name));
    }

    [Test]
    public async Task GetProperty_NonExistingId_ReturnsNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/properties/99999");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
    }

    [Test]
    public async Task GetProperties_WithFilters_ReturnsFilteredResults()
    {
        // Arrange
        await SeedTestData();

        // Act
        var response = await _client.GetAsync("/api/properties?minPrice=100000&maxPrice=500000&page=1&pageSize=10");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PaginatedResult<Property>>(content, JsonOptions);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Data.All(p => p.Price >= 100000 && p.Price <= 500000), Is.True);
    }

    [Test]
    public async Task GetHealth_ReturnsHealthy()
    {
        // Act
        var response = await _client.GetAsync("/health");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<JsonElement>(content);
        
        Assert.That(result.GetProperty("status").GetString(), Is.EqualTo("Healthy"));
    }

    private async Task SeedTestData()
    {
        var properties = new[]
        {
            new Property
            {
                IdProperty = 1,
                Name = "Test Property 1",
                Address = "123 Test St",
                Price = 250000,
                CodeInternal = "TEST001",
                Year = 2020,
                IdOwner = 1
            },
            new Property
            {
                IdProperty = 2,
                Name = "Test Property 2", 
                Address = "456 Test Ave",
                Price = 400000,
                CodeInternal = "TEST002",
                Year = 2021,
                IdOwner = 2
            },
            new Property
            {
                IdProperty = 3,
                Name = "Test Property 3",
                Address = "789 Test Blvd",
                Price = 600000,
                CodeInternal = "TEST003",
                Year = 2019,
                IdOwner = 1
            }
        };

        var owners = new[]
        {
            new Owner
            {
                IdOwner = 1,
                Name = "Test Owner 1",
                Address = "Owner Address 1",
                Photo = "https://ui-avatars.com/api/?name=Test+Owner+1"
            },
            new Owner
            {
                IdOwner = 2,
                Name = "Test Owner 2",
                Address = "Owner Address 2", 
                Photo = "https://ui-avatars.com/api/?name=Test+Owner+2"
            }
        };

        await _testDatabase.GetCollection<Property>("Properties").InsertManyAsync(properties);
        await _testDatabase.GetCollection<Owner>("Owners").InsertManyAsync(owners);
    }

    private async Task<Property> SeedSingleProperty()
    {
        var property = new Property
        {
            IdProperty = 100,
            Name = "Single Test Property",
            Address = "100 Single Test St",
            Price = 300000,
            CodeInternal = "SINGLE001",
            Year = 2022,
            IdOwner = 100
        };

        var owner = new Owner
        {
            IdOwner = 100,
            Name = "Single Test Owner",
            Address = "Single Owner Address",
            Photo = "https://ui-avatars.com/api/?name=Single+Test+Owner"
        };

        await _testDatabase.GetCollection<Property>("Properties").InsertOneAsync(property);
        await _testDatabase.GetCollection<Owner>("Owners").InsertOneAsync(owner);

        return property;
    }
}

public class PaginatedResult<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class PropertyDetailDto
{
    public int IdProperty { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CodeInternal { get; set; } = string.Empty;
    public int Year { get; set; }
    public Owner? Owner { get; set; }
    public List<PropertyImage> Images { get; set; } = new();
    public List<PropertyTrace> Traces { get; set; } = new();
}