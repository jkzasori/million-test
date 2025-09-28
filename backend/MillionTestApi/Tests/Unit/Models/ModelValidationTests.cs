using MillionTestApi.DTOs;
using MillionTestApi.Models;
using NUnit.Framework;
using System.ComponentModel.DataAnnotations;

namespace MillionTestApi.Tests.Unit.Models;

[TestFixture]
public class ModelValidationTests
{
    [Test]
    public void Property_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var property = new Property
        {
            IdProperty = 1,
            Name = "Valid Property",
            Address = "123 Valid Street",
            Price = 100000,
            CodeInternal = "VALID001",
            Year = 2020,
            IdOwner = 1
        };

        // Act
        var validationResults = ValidateModel(property);

        // Assert
        Assert.That(validationResults, Is.Empty);
    }

    [Test]
    public void Property_WithEmptyName_ShouldFailValidation()
    {
        // Arrange
        var property = new Property
        {
            IdProperty = 1,
            Name = string.Empty, // Invalid
            Address = "123 Valid Street",
            Price = 100000,
            CodeInternal = "VALID001",
            Year = 2020,
            IdOwner = 1
        };

        // Act
        var validationResults = ValidateModel(property);

        // Assert
        Assert.That(validationResults, Is.Not.Empty);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Name")), Is.True);
    }

    [Test]
    public void Property_WithNegativePrice_ShouldFailValidation()
    {
        // Arrange
        var property = new Property
        {
            IdProperty = 1,
            Name = "Valid Property",
            Address = "123 Valid Street",
            Price = -1000, // Invalid
            CodeInternal = "VALID001",
            Year = 2020,
            IdOwner = 1
        };

        // Act
        var validationResults = ValidateModel(property);

        // Assert
        Assert.That(validationResults, Is.Not.Empty);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Price")), Is.True);
    }

    [Test]
    public void PropertyDto_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var propertyDto = new PropertyDto
        {
            IdProperty = 1,
            Name = "Valid Property DTO",
            Address = "123 Valid Street",
            Price = 200000,
            CodeInternal = "DTO001",
            Year = 2021,
            IdOwner = 1
        };

        // Act
        var validationResults = ValidateModel(propertyDto);

        // Assert
        Assert.That(validationResults, Is.Empty);
    }

    [Test]
    public void PropertyFilterDto_WithValidFilters_ShouldPassValidation()
    {
        // Arrange
        var filterDto = new PropertyFilterDto
        {
            Name = "Test Property",
            Address = "Test Address",
            MinPrice = 100000,
            MaxPrice = 500000,
            Page = 1,
            PageSize = 10
        };

        // Act
        var validationResults = ValidateModel(filterDto);

        // Assert
        Assert.That(validationResults, Is.Empty);
    }

    [Test]
    public void PropertyFilterDto_WithInvalidPageSize_ShouldFailValidation()
    {
        // Arrange
        var filterDto = new PropertyFilterDto
        {
            Page = 1,
            PageSize = 0 // Invalid - should be greater than 0
        };

        // Act
        var validationResults = ValidateModel(filterDto);

        // Assert
        Assert.That(validationResults, Is.Not.Empty);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("PageSize")), Is.True);
    }

    [Test]
    public void PropertyFilterDto_WithNegativePage_ShouldFailValidation()
    {
        // Arrange
        var filterDto = new PropertyFilterDto
        {
            Page = 0, // Invalid - should be greater than 0
            PageSize = 10
        };

        // Act
        var validationResults = ValidateModel(filterDto);

        // Assert
        Assert.That(validationResults, Is.Not.Empty);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Page")), Is.True);
    }

    [Test]
    public void Owner_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var owner = new Owner
        {
            IdOwner = 1,
            Name = "John Doe",
            Address = "123 Owner Street",
            Photo = "https://example.com/photo.jpg",
            Birthday = new DateTime(1980, 1, 1)
        };

        // Act
        var validationResults = ValidateModel(owner);

        // Assert
        Assert.That(validationResults, Is.Empty);
    }

    [Test]
    public void Owner_WithEmptyName_ShouldFailValidation()
    {
        // Arrange
        var owner = new Owner
        {
            IdOwner = 1,
            Name = string.Empty, // Invalid
            Address = "123 Owner Street",
            Photo = "https://example.com/photo.jpg"
        };

        // Act
        var validationResults = ValidateModel(owner);

        // Assert
        Assert.That(validationResults, Is.Not.Empty);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Name")), Is.True);
    }

    [Test]
    public void PropertyImage_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var propertyImage = new PropertyImage
        {
            IdPropertyImage = 1,
            IdProperty = 1,
            File = "https://example.com/image.jpg",
            Enabled = true
        };

        // Act
        var validationResults = ValidateModel(propertyImage);

        // Assert
        Assert.That(validationResults, Is.Empty);
    }

    [Test]
    public void PropertyImage_WithEmptyFile_ShouldFailValidation()
    {
        // Arrange
        var propertyImage = new PropertyImage
        {
            IdPropertyImage = 1,
            IdProperty = 1,
            File = string.Empty, // Invalid
            Enabled = true
        };

        // Act
        var validationResults = ValidateModel(propertyImage);

        // Assert
        Assert.That(validationResults, Is.Not.Empty);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("File")), Is.True);
    }

    [Test]
    public void PropertyTrace_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var propertyTrace = new PropertyTrace
        {
            IdPropertyTrace = 1,
            IdProperty = 1,
            DateSale = DateTime.Now,
            Name = "Initial Sale",
            Value = 250000,
            Tax = 12500
        };

        // Act
        var validationResults = ValidateModel(propertyTrace);

        // Assert
        Assert.That(validationResults, Is.Empty);
    }

    [Test]
    public void PropertyTrace_WithNegativeValue_ShouldFailValidation()
    {
        // Arrange
        var propertyTrace = new PropertyTrace
        {
            IdPropertyTrace = 1,
            IdProperty = 1,
            DateSale = DateTime.Now,
            Name = "Invalid Sale",
            Value = -1000, // Invalid
            Tax = 0
        };

        // Act
        var validationResults = ValidateModel(propertyTrace);

        // Assert
        Assert.That(validationResults, Is.Not.Empty);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Value")), Is.True);
    }

    [Test]
    public void PropertyListResponseDto_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var responseDto = new PropertyListResponseDto
        {
            Properties = new List<PropertyDto>
            {
                new PropertyDto { IdProperty = 1, Name = "Test", Address = "Test", Price = 100000 }
            },
            TotalCount = 1,
            Page = 1,
            PageSize = 10,
            TotalPages = 1
        };

        // Act
        var validationResults = ValidateModel(responseDto);

        // Assert
        Assert.That(validationResults, Is.Empty);
    }

    [Test]
    public void PropertyDetailDto_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var detailDto = new PropertyDetailDto
        {
            IdProperty = 1,
            Name = "Detailed Property",
            Address = "123 Detail Street",
            Price = 300000,
            CodeInternal = "DETAIL001",
            Year = 2022,
            IdOwner = 1,
            Owner = new OwnerDto { IdOwner = 1, Name = "Owner Name" },
            Images = new List<PropertyImageDto>(),
            Traces = new List<PropertyTraceDto>()
        };

        // Act
        var validationResults = ValidateModel(detailDto);

        // Assert
        Assert.That(validationResults, Is.Empty);
    }

    [Test]
    public void DatabaseSettings_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var databaseSettings = new DatabaseSettings
        {
            ConnectionString = "mongodb://localhost:27017",
            DatabaseName = "TestDatabase",
            PropertiesCollectionName = "properties",
            OwnersCollectionName = "owners",
            PropertyImagesCollectionName = "property_images",
            PropertyTracesCollectionName = "property_traces"
        };

        // Act
        var validationResults = ValidateModel(databaseSettings);

        // Assert
        Assert.That(validationResults, Is.Empty);
    }

    [Test]
    public void DatabaseSettings_WithEmptyConnectionString_ShouldFailValidation()
    {
        // Arrange
        var databaseSettings = new DatabaseSettings
        {
            ConnectionString = string.Empty, // Invalid
            DatabaseName = "TestDatabase",
            PropertiesCollectionName = "properties",
            OwnersCollectionName = "owners",
            PropertyImagesCollectionName = "property_images",
            PropertyTracesCollectionName = "property_traces"
        };

        // Act
        var validationResults = ValidateModel(databaseSettings);

        // Assert
        Assert.That(validationResults, Is.Not.Empty);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("ConnectionString")), Is.True);
    }

    private static List<ValidationResult> ValidateModel(object model)
    {
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(model);
        Validator.TryValidateObject(model, validationContext, validationResults, true);
        return validationResults;
    }
}