using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using MillionTestApi.Models;
using MongoDB.Driver;
using NUnit.Framework;
using System.Net;
using System.Text;
using System.Text.Json;

namespace MillionTestApi.Tests.E2E;

[TestFixture]
public class PropertyApiE2ETests : IDisposable
{
    private WebApplicationFactory<Program> _factory = null!;
    private HttpClient _client = null!;
    private IMongoDatabase _testDatabase = null!;
    private readonly string _testDatabaseName = $"E2ETest_{Guid.NewGuid():N}";

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Override database settings for E2E tests
                    services.Configure<DatabaseSettings>(options =>
                    {
                        options.ConnectionString = "mongodb://admin:million123@localhost:27017/MillionTestPropertiesE2E?authSource=admin";
                        options.DatabaseName = _testDatabaseName;
                        options.PropertiesCollectionName = "Properties";
                        options.OwnersCollectionName = "Owners";
                        options.PropertyImagesCollectionName = "PropertyImages";
                        options.PropertyTracesCollectionName = "PropertyTraces";
                    });
                });
                builder.UseEnvironment("Testing");
            });

        _client = _factory.CreateClient();
        
        // Setup test database
        var mongoClient = new MongoClient("mongodb://admin:million123@localhost:27017/?authSource=admin");
        _testDatabase = mongoClient.GetDatabase(_testDatabaseName);
    }

    [SetUp]
    public async Task SetUp()
    {
        // Clean database before each test
        await _testDatabase.DropCollectionAsync("Properties");
        await _testDatabase.DropCollectionAsync("Owners");
        await _testDatabase.DropCollectionAsync("PropertyImages");
        await _testDatabase.DropCollectionAsync("PropertyTraces");
        
        // Seed test data
        await SeedTestData();
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDown()
    {
        // Clean up test database
        var mongoClient = new MongoClient("mongodb://admin:million123@localhost:27017/?authSource=admin");
        await mongoClient.DropDatabaseAsync(_testDatabaseName);
        
        _client?.Dispose();
        _factory?.Dispose();
    }

    [Test]
    public async Task E2E_GetProperties_ShouldReturnPropertiesWithPagination()
    {
        // Act
        var response = await _client.GetAsync("/api/properties?page=1&pageSize=5");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PropertyListResponse>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Properties, Is.Not.Empty);
        Assert.That(result.Properties.Count, Is.LessThanOrEqualTo(5));
        Assert.That(result.TotalCount, Is.GreaterThan(0));
        Assert.That(result.Page, Is.EqualTo(1));
        Assert.That(result.PageSize, Is.EqualTo(5));
    }

    [Test]
    public async Task E2E_GetProperties_WithFilters_ShouldReturnFilteredResults()
    {
        // Act - Filter by price range
        var response = await _client.GetAsync("/api/properties?minPrice=200000&maxPrice=400000&page=1&pageSize=10");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PropertyListResponse>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Properties.All(p => p.Price >= 200000 && p.Price <= 400000), Is.True);
    }

    [Test]
    public async Task E2E_GetProperty_WithValidId_ShouldReturnCompletePropertyData()
    {
        // Arrange - Get a property ID from the seeded data
        var propertiesResponse = await _client.GetAsync("/api/properties?page=1&pageSize=1");
        var propertiesContent = await propertiesResponse.Content.ReadAsStringAsync();
        var propertiesResult = JsonSerializer.Deserialize<PropertyListResponse>(propertiesContent, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        
        var propertyId = propertiesResult!.Properties.First().IdProperty;

        // Act
        var response = await _client.GetAsync($"/api/properties/{propertyId}");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PropertyDetailResponse>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.That(result, Is.Not.Null);
        Assert.That(result.IdProperty, Is.EqualTo(propertyId));
        Assert.That(result.Name, Is.Not.Empty);
        Assert.That(result.Address, Is.Not.Empty);
        Assert.That(result.Price, Is.GreaterThan(0));
        Assert.That(result.Owner, Is.Not.Null);
        Assert.That(result.Owner.Name, Is.Not.Empty);
    }

    [Test]
    public async Task E2E_GetProperty_WithInvalidId_ShouldReturn404()
    {
        // Act
        var response = await _client.GetAsync("/api/properties/99999");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
    }

    [Test]
    public async Task E2E_SearchProperties_ByName_ShouldReturnMatchingResults()
    {
        // Act
        var response = await _client.GetAsync("/api/properties?name=Villa&page=1&pageSize=10");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PropertyListResponse>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Properties.All(p => p.Name.Contains("Villa", StringComparison.OrdinalIgnoreCase)), Is.True);
    }

    [Test]
    public async Task E2E_HealthCheck_ShouldReturnHealthy()
    {
        // Act
        var response = await _client.GetAsync("/health");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<JsonElement>(content);
        
        Assert.That(result.GetProperty("status").GetString(), Is.EqualTo("Healthy"));
    }

    [Test]
    public async Task E2E_ApiWorkflow_CreateUpdateDeleteProperty()
    {
        // This test represents a complete workflow that a real user might perform
        
        // Step 1: Create a new property
        var newProperty = new
        {
            Name = "E2E Test Property",
            Address = "123 E2E Test Street",
            Price = 350000,
            CodeInternal = "E2E001",
            Year = 2023,
            IdOwner = 1
        };

        var createContent = new StringContent(
            JsonSerializer.Serialize(newProperty),
            Encoding.UTF8,
            "application/json");

        var createResponse = await _client.PostAsync("/api/properties", createContent);
        Assert.That(createResponse.StatusCode, Is.EqualTo(HttpStatusCode.Created));

        // Extract the created property ID
        var createLocation = createResponse.Headers.Location?.ToString();
        Assert.That(createLocation, Is.Not.Null);
        var propertyId = int.Parse(createLocation!.Split('/').Last());

        // Step 2: Verify the property was created
        var getResponse = await _client.GetAsync($"/api/properties/{propertyId}");
        Assert.That(getResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        var getContent = await getResponse.Content.ReadAsStringAsync();
        var createdProperty = JsonSerializer.Deserialize<PropertyDetailResponse>(getContent, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.That(createdProperty!.Name, Is.EqualTo("E2E Test Property"));
        Assert.That(createdProperty.Price, Is.EqualTo(350000));

        // Step 3: Update the property
        var updatedProperty = new
        {
            IdProperty = propertyId,
            Name = "Updated E2E Test Property",
            Address = "456 Updated E2E Street",
            Price = 400000,
            CodeInternal = "E2E001_UPD",
            Year = 2023,
            IdOwner = 1
        };

        var updateContent = new StringContent(
            JsonSerializer.Serialize(updatedProperty),
            Encoding.UTF8,
            "application/json");

        var updateResponse = await _client.PutAsync($"/api/properties/{propertyId}", updateContent);
        Assert.That(updateResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        // Step 4: Verify the update
        var verifyResponse = await _client.GetAsync($"/api/properties/{propertyId}");
        var verifyContent = await verifyResponse.Content.ReadAsStringAsync();
        var updatedPropertyResult = JsonSerializer.Deserialize<PropertyDetailResponse>(verifyContent, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.That(updatedPropertyResult!.Name, Is.EqualTo("Updated E2E Test Property"));
        Assert.That(updatedPropertyResult.Price, Is.EqualTo(400000));

        // Step 5: Delete the property
        var deleteResponse = await _client.DeleteAsync($"/api/properties/{propertyId}");
        Assert.That(deleteResponse.StatusCode, Is.EqualTo(HttpStatusCode.NoContent));

        // Step 6: Verify deletion
        var finalCheckResponse = await _client.GetAsync($"/api/properties/{propertyId}");
        Assert.That(finalCheckResponse.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
    }

    private async Task SeedTestData()
    {
        var properties = new[]
        {
            new Property
            {
                IdProperty = 1,
                Name = "Villa Paradise E2E",
                Address = "123 Paradise Lane",
                Price = 250000,
                CodeInternal = "E2E_VILLA_001",
                Year = 2020,
                IdOwner = 1
            },
            new Property
            {
                IdProperty = 2,
                Name = "Modern Apartment E2E",
                Address = "456 Modern Ave",
                Price = 180000,
                CodeInternal = "E2E_APT_001",
                Year = 2021,
                IdOwner = 2
            },
            new Property
            {
                IdProperty = 3,
                Name = "Villa Sunset E2E",
                Address = "789 Sunset Blvd",
                Price = 320000,
                CodeInternal = "E2E_VILLA_002",
                Year = 2019,
                IdOwner = 1
            }
        };

        var owners = new[]
        {
            new Owner
            {
                IdOwner = 1,
                Name = "John E2E Owner",
                Address = "111 Owner Street",
                Photo = "https://ui-avatars.com/api/?name=John+E2E+Owner"
            },
            new Owner
            {
                IdOwner = 2,
                Name = "Jane E2E Owner",
                Address = "222 Owner Avenue",
                Photo = "https://ui-avatars.com/api/?name=Jane+E2E+Owner"
            }
        };

        var images = new[]
        {
            new PropertyImage
            {
                IdPropertyImage = 1,
                IdProperty = 1,
                File = "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
                Enabled = true
            },
            new PropertyImage
            {
                IdPropertyImage = 2,
                IdProperty = 2,
                File = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
                Enabled = true
            }
        };

        await _testDatabase.GetCollection<Property>("Properties").InsertManyAsync(properties);
        await _testDatabase.GetCollection<Owner>("Owners").InsertManyAsync(owners);
        await _testDatabase.GetCollection<PropertyImage>("PropertyImages").InsertManyAsync(images);
    }

    public void Dispose()
    {
        _client?.Dispose();
        _factory?.Dispose();
    }
}

// Response DTOs for E2E tests
public class PropertyListResponse
{
    public List<PropertySummary> Properties { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class PropertySummary
{
    public int IdProperty { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CodeInternal { get; set; } = string.Empty;
    public int Year { get; set; }
}

public class PropertyDetailResponse
{
    public int IdProperty { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CodeInternal { get; set; } = string.Empty;
    public int Year { get; set; }
    public OwnerResponse Owner { get; set; } = new();
    public List<PropertyImageResponse> Images { get; set; } = new();
    public List<PropertyTraceResponse> Traces { get; set; } = new();
}

public class OwnerResponse
{
    public int IdOwner { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Photo { get; set; } = string.Empty;
}

public class PropertyImageResponse
{
    public int IdPropertyImage { get; set; }
    public string File { get; set; } = string.Empty;
    public bool Enabled { get; set; }
}

public class PropertyTraceResponse
{
    public int IdPropertyTrace { get; set; }
    public DateTime DateSale { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public decimal Tax { get; set; }
}