using Microsoft.Extensions.Options;
using MillionTestApi.DTOs;
using MillionTestApi.Models;
using MillionTestApi.Services;
using MongoDB.Driver;
using Moq;
using NUnit.Framework;
using System.Linq.Expressions;

namespace MillionTestApi.Tests.Unit.Services;

[TestFixture]
public class PropertyServiceUnitTests
{
    private Mock<IMongoDatabase> _mockDatabase = null!;
    private Mock<IMongoCollection<Property>> _mockPropertyCollection = null!;
    private Mock<IMongoCollection<Owner>> _mockOwnerCollection = null!;
    private Mock<IMongoCollection<PropertyImage>> _mockImageCollection = null!;
    private Mock<IMongoCollection<PropertyTrace>> _mockTraceCollection = null!;
    private Mock<IAsyncCursor<Property>> _mockPropertyCursor = null!;
    private Mock<IAsyncCursor<Owner>> _mockOwnerCursor = null!;
    private Mock<IAsyncCursor<PropertyImage>> _mockImageCursor = null!;
    private Mock<IAsyncCursor<PropertyTrace>> _mockTraceCursor = null!;
    private PropertyService _propertyService = null!;

    [SetUp]
    public void Setup()
    {
        var databaseSettings = new DatabaseSettings
        {
            ConnectionString = "mongodb://localhost:27017",
            DatabaseName = "test_db",
            PropertiesCollectionName = "properties",
            OwnersCollectionName = "owners",
            PropertyImagesCollectionName = "property_images",
            PropertyTracesCollectionName = "property_traces"
        };

        var mockOptions = new Mock<IOptions<DatabaseSettings>>();
        mockOptions.Setup(x => x.Value).Returns(databaseSettings);

        _mockDatabase = new Mock<IMongoDatabase>();
        _mockPropertyCollection = new Mock<IMongoCollection<Property>>();
        _mockOwnerCollection = new Mock<IMongoCollection<Owner>>();
        _mockImageCollection = new Mock<IMongoCollection<PropertyImage>>();
        _mockTraceCollection = new Mock<IMongoCollection<PropertyTrace>>();

        _mockPropertyCursor = new Mock<IAsyncCursor<Property>>();
        _mockOwnerCursor = new Mock<IAsyncCursor<Owner>>();
        _mockImageCursor = new Mock<IAsyncCursor<PropertyImage>>();
        _mockTraceCursor = new Mock<IAsyncCursor<PropertyTrace>>();

        // Setup database collection returns
        _mockDatabase.Setup(x => x.GetCollection<Property>("properties", null))
                    .Returns(_mockPropertyCollection.Object);
        _mockDatabase.Setup(x => x.GetCollection<Owner>("owners", null))
                    .Returns(_mockOwnerCollection.Object);
        _mockDatabase.Setup(x => x.GetCollection<PropertyImage>("property_images", null))
                    .Returns(_mockImageCollection.Object);
        _mockDatabase.Setup(x => x.GetCollection<PropertyTrace>("property_traces", null))
                    .Returns(_mockTraceCollection.Object);

        var mockClient = new Mock<IMongoClient>();
        mockClient.Setup(x => x.GetDatabase("test_db", null))
                 .Returns(_mockDatabase.Object);

        _propertyService = new PropertyService(mockClient.Object, mockOptions.Object);
    }

    [Test]
    public async Task GetPropertiesAsync_WithNameFilter_ShouldReturnMatchingProperties()
    {
        // Arrange
        var filter = new PropertyFilterDto
        {
            Name = "Villa",
            Page = 1,
            PageSize = 10
        };

        var properties = new List<Property>
        {
            new Property { IdProperty = 1, Name = "Villa Paradise", Address = "123 Main St", Price = 500000, IdOwner = 1 },
            new Property { IdProperty = 2, Name = "Villa Sunset", Address = "456 Oak Ave", Price = 750000, IdOwner = 2 }
        };

        var owners = new List<Owner>
        {
            new Owner { IdOwner = 1, Name = "John Doe", Address = "Owner Address 1" },
            new Owner { IdOwner = 2, Name = "Jane Smith", Address = "Owner Address 2" }
        };

        SetupMockCursor(_mockPropertyCursor, properties);
        SetupMockCursor(_mockOwnerCursor, owners);

        _mockPropertyCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<FindOptions<Property, Property>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockPropertyCursor.Object);

        _mockPropertyCollection.Setup(x => x.CountDocumentsAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<CountOptions>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(2);

        _mockOwnerCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<Owner>>(),
            It.IsAny<FindOptions<Owner, Owner>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockOwnerCursor.Object);

        // Act
        var result = await _propertyService.GetPropertiesAsync(filter);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Properties.Count, Is.EqualTo(2));
        Assert.That(result.TotalCount, Is.EqualTo(2));
        Assert.That(result.Page, Is.EqualTo(1));
        Assert.That(result.PageSize, Is.EqualTo(10));
        Assert.That(result.Properties.All(p => p.Name.Contains("Villa")), Is.True);
    }

    [Test]
    public async Task GetPropertiesAsync_WithPriceRange_ShouldReturnFilteredProperties()
    {
        // Arrange
        var filter = new PropertyFilterDto
        {
            MinPrice = 400000,
            MaxPrice = 600000,
            Page = 1,
            PageSize = 10
        };

        var properties = new List<Property>
        {
            new Property { IdProperty = 1, Name = "Property 1", Address = "123 Main St", Price = 500000, IdOwner = 1 }
        };

        var owners = new List<Owner>
        {
            new Owner { IdOwner = 1, Name = "John Doe", Address = "Owner Address 1" }
        };

        SetupMockCursor(_mockPropertyCursor, properties);
        SetupMockCursor(_mockOwnerCursor, owners);

        _mockPropertyCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<FindOptions<Property, Property>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockPropertyCursor.Object);

        _mockPropertyCollection.Setup(x => x.CountDocumentsAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<CountOptions>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        _mockOwnerCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<Owner>>(),
            It.IsAny<FindOptions<Owner, Owner>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockOwnerCursor.Object);

        // Act
        var result = await _propertyService.GetPropertiesAsync(filter);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Properties.Count, Is.EqualTo(1));
        Assert.That(result.Properties.First().Price, Is.GreaterThanOrEqualTo(400000));
        Assert.That(result.Properties.First().Price, Is.LessThanOrEqualTo(600000));
    }

    [Test]
    public async Task GetPropertyByIdAsync_WithValidId_ShouldReturnPropertyWithDetails()
    {
        // Arrange
        const int propertyId = 1;
        var property = new Property
        {
            IdProperty = propertyId,
            Name = "Test Property",
            Address = "Test Address",
            Price = 100000,
            IdOwner = 1,
            Year = 2020,
            CodeInternal = "PROP001"
        };

        var owner = new Owner
        {
            IdOwner = 1,
            Name = "John Doe",
            Address = "Owner Address"
        };

        var images = new List<PropertyImage>
        {
            new PropertyImage { IdPropertyImage = 1, IdProperty = propertyId, File = "image1.jpg", Enabled = true },
            new PropertyImage { IdPropertyImage = 2, IdProperty = propertyId, File = "image2.jpg", Enabled = true }
        };

        var traces = new List<PropertyTrace>
        {
            new PropertyTrace { IdPropertyTrace = 1, IdProperty = propertyId, DateSale = DateTime.Now, Name = "Sale", Value = 100000, Tax = 5000 }
        };

        SetupMockCursor(_mockPropertyCursor, new List<Property> { property });
        SetupMockCursor(_mockOwnerCursor, new List<Owner> { owner });
        SetupMockCursor(_mockImageCursor, images);
        SetupMockCursor(_mockTraceCursor, traces);

        _mockPropertyCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<FindOptions<Property, Property>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockPropertyCursor.Object);

        _mockOwnerCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<Owner>>(),
            It.IsAny<FindOptions<Owner, Owner>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockOwnerCursor.Object);

        _mockImageCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<PropertyImage>>(),
            It.IsAny<FindOptions<PropertyImage, PropertyImage>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockImageCursor.Object);

        _mockTraceCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<PropertyTrace>>(),
            It.IsAny<FindOptions<PropertyTrace, PropertyTrace>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockTraceCursor.Object);

        // Act
        var result = await _propertyService.GetPropertyByIdAsync(propertyId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IdProperty, Is.EqualTo(propertyId));
        Assert.That(result.Name, Is.EqualTo("Test Property"));
        Assert.That(result.Owner, Is.Not.Null);
        Assert.That(result.Owner.Name, Is.EqualTo("John Doe"));
        Assert.That(result.Images.Count, Is.EqualTo(2));
        Assert.That(result.Traces.Count, Is.EqualTo(1));
    }

    [Test]
    public async Task GetPropertyByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        const int invalidId = 999;
        SetupMockCursor(_mockPropertyCursor, new List<Property>());

        _mockPropertyCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<FindOptions<Property, Property>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockPropertyCursor.Object);

        // Act
        var result = await _propertyService.GetPropertyByIdAsync(invalidId);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task CreatePropertyAsync_WithValidProperty_ShouldReturnCreatedProperty()
    {
        // Arrange
        var newProperty = new Property
        {
            IdProperty = 1,
            Name = "New Property",
            Address = "New Address",
            Price = 200000,
            IdOwner = 1
        };

        _mockPropertyCollection.Setup(x => x.InsertOneAsync(
            It.IsAny<Property>(),
            It.IsAny<InsertOneOptions>(),
            It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _propertyService.CreatePropertyAsync(newProperty);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Name, Is.EqualTo("New Property"));
        Assert.That(result.Address, Is.EqualTo("New Address"));
        Assert.That(result.Price, Is.EqualTo(200000));

        _mockPropertyCollection.Verify(x => x.InsertOneAsync(
            It.IsAny<Property>(),
            It.IsAny<InsertOneOptions>(),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task UpdatePropertyAsync_WithValidData_ShouldReturnUpdatedProperty()
    {
        // Arrange
        const int propertyId = 1;
        var existingProperty = new Property
        {
            IdProperty = propertyId,
            Name = "Original Property",
            Address = "Original Address",
            Price = 100000,
            IdOwner = 1
        };

        var updatedProperty = new Property
        {
            IdProperty = propertyId,
            Name = "Updated Property",
            Address = "Updated Address",
            Price = 150000,
            IdOwner = 1
        };

        SetupMockCursor(_mockPropertyCursor, new List<Property> { existingProperty });

        _mockPropertyCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<FindOptions<Property, Property>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(_mockPropertyCursor.Object);

        var mockReplaceResult = new Mock<ReplaceOneResult>();
        mockReplaceResult.Setup(x => x.IsAcknowledged).Returns(true);
        mockReplaceResult.Setup(x => x.ModifiedCount).Returns(1);

        _mockPropertyCollection.Setup(x => x.ReplaceOneAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<Property>(),
            It.IsAny<ReplaceOptions>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockReplaceResult.Object);

        // Act
        var result = await _propertyService.UpdatePropertyAsync(propertyId, updatedProperty);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Name, Is.EqualTo("Updated Property"));
        Assert.That(result.Address, Is.EqualTo("Updated Address"));
        Assert.That(result.Price, Is.EqualTo(150000));
    }

    [Test]
    public async Task DeletePropertyAsync_WithValidId_ShouldReturnTrue()
    {
        // Arrange
        const int propertyId = 1;
        var mockDeleteResult = new Mock<DeleteResult>();
        mockDeleteResult.Setup(x => x.IsAcknowledged).Returns(true);
        mockDeleteResult.Setup(x => x.DeletedCount).Returns(1);

        _mockPropertyCollection.Setup(x => x.DeleteOneAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockDeleteResult.Object);

        // Act
        var result = await _propertyService.DeletePropertyAsync(propertyId);

        // Assert
        Assert.That(result, Is.True);
        _mockPropertyCollection.Verify(x => x.DeleteOneAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task DeletePropertyAsync_WithInvalidId_ShouldReturnFalse()
    {
        // Arrange
        const int invalidId = 999;
        var mockDeleteResult = new Mock<DeleteResult>();
        mockDeleteResult.Setup(x => x.IsAcknowledged).Returns(true);
        mockDeleteResult.Setup(x => x.DeletedCount).Returns(0);

        _mockPropertyCollection.Setup(x => x.DeleteOneAsync(
            It.IsAny<FilterDefinition<Property>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockDeleteResult.Object);

        // Act
        var result = await _propertyService.DeletePropertyAsync(invalidId);

        // Assert
        Assert.That(result, Is.False);
    }

    private void SetupMockCursor<T>(Mock<IAsyncCursor<T>> mockCursor, List<T> data)
    {
        var batches = new List<IEnumerable<T>> { data };
        var enumerator = batches.GetEnumerator();

        mockCursor.Setup(x => x.MoveNextAsync(It.IsAny<CancellationToken>()))
                 .Returns(() => Task.FromResult(enumerator.MoveNext()));
        
        mockCursor.Setup(x => x.Current)
                 .Returns(() => enumerator.Current);

        mockCursor.Setup(x => x.ToListAsync(It.IsAny<CancellationToken>()))
                 .ReturnsAsync(data);

        mockCursor.Setup(x => x.FirstOrDefaultAsync(It.IsAny<CancellationToken>()))
                 .ReturnsAsync(data.FirstOrDefault());
    }
}