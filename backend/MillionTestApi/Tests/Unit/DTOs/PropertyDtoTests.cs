using MillionTestApi.DTOs;
using NUnit.Framework;

namespace MillionTestApi.Tests.Unit.DTOs;

[TestFixture]
public class PropertyDtoTests
{
    [Test]
    public void PropertyDto_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var dto = new PropertyDto();

        // Assert
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto.IdProperty, Is.EqualTo(0));
        Assert.That(dto.IdOwner, Is.EqualTo(0));
        Assert.That(dto.Name, Is.EqualTo(string.Empty));
        Assert.That(dto.Address, Is.EqualTo(string.Empty));
        Assert.That(dto.Price, Is.EqualTo(0));
        Assert.That(dto.CodeInternal, Is.EqualTo(string.Empty));
        Assert.That(dto.Year, Is.EqualTo(0));
        Assert.That(dto.OwnerName, Is.Null);
    }

    [Test]
    public void PropertyDto_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var dto = new PropertyDto();

        // Act
        dto.IdProperty = 1;
        dto.IdOwner = 10;
        dto.Name = "Test Property";
        dto.Address = "123 Test Street";
        dto.Price = 250000;
        dto.CodeInternal = "TEST001";
        dto.Year = 2020;
        dto.OwnerName = "Test Owner";

        // Assert
        Assert.That(dto.IdProperty, Is.EqualTo(1));
        Assert.That(dto.IdOwner, Is.EqualTo(10));
        Assert.That(dto.Name, Is.EqualTo("Test Property"));
        Assert.That(dto.Address, Is.EqualTo("123 Test Street"));
        Assert.That(dto.Price, Is.EqualTo(250000));
        Assert.That(dto.CodeInternal, Is.EqualTo("TEST001"));
        Assert.That(dto.Year, Is.EqualTo(2020));
        Assert.That(dto.OwnerName, Is.EqualTo("Test Owner"));
    }

    [Test]
    public void PropertyFilterDto_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var dto = new PropertyFilterDto();

        // Assert
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto.Name, Is.Null);
        Assert.That(dto.Address, Is.Null);
        Assert.That(dto.MinPrice, Is.Null);
        Assert.That(dto.MaxPrice, Is.Null);
        Assert.That(dto.Page, Is.EqualTo(1));
        Assert.That(dto.PageSize, Is.EqualTo(10));
    }

    [Test]
    public void PropertyFilterDto_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var dto = new PropertyFilterDto();

        // Act
        dto.Name = "Villa";
        dto.Address = "Beach Street";
        dto.MinPrice = 100000;
        dto.MaxPrice = 500000;
        dto.Page = 2;
        dto.PageSize = 20;

        // Assert
        Assert.That(dto.Name, Is.EqualTo("Villa"));
        Assert.That(dto.Address, Is.EqualTo("Beach Street"));
        Assert.That(dto.MinPrice, Is.EqualTo(100000));
        Assert.That(dto.MaxPrice, Is.EqualTo(500000));
        Assert.That(dto.Page, Is.EqualTo(2));
        Assert.That(dto.PageSize, Is.EqualTo(20));
    }

    [Test]
    public void PropertyListResponseDto_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var dto = new PropertyListResponseDto();

        // Assert
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto.Properties, Is.Not.Null);
        Assert.That(dto.Properties, Is.Empty);
        Assert.That(dto.TotalCount, Is.EqualTo(0));
        Assert.That(dto.Page, Is.EqualTo(0));
        Assert.That(dto.PageSize, Is.EqualTo(0));
        Assert.That(dto.TotalPages, Is.EqualTo(0));
    }

    [Test]
    public void PropertyListResponseDto_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var dto = new PropertyListResponseDto();
        var properties = new List<PropertyDto>
        {
            new PropertyDto { IdProperty = 1, Name = "Property 1" },
            new PropertyDto { IdProperty = 2, Name = "Property 2" }
        };

        // Act
        dto.Properties = properties;
        dto.TotalCount = 50;
        dto.Page = 2;
        dto.PageSize = 10;
        dto.TotalPages = 5;

        // Assert
        Assert.That(dto.Properties, Is.EqualTo(properties));
        Assert.That(dto.Properties.Count, Is.EqualTo(2));
        Assert.That(dto.TotalCount, Is.EqualTo(50));
        Assert.That(dto.Page, Is.EqualTo(2));
        Assert.That(dto.PageSize, Is.EqualTo(10));
        Assert.That(dto.TotalPages, Is.EqualTo(5));
    }

    [Test]
    public void PropertyDetailDto_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var dto = new PropertyDetailDto();

        // Assert
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto.IdProperty, Is.EqualTo(0));
        Assert.That(dto.IdOwner, Is.EqualTo(0));
        Assert.That(dto.Name, Is.EqualTo(string.Empty));
        Assert.That(dto.Address, Is.EqualTo(string.Empty));
        Assert.That(dto.Price, Is.EqualTo(0));
        Assert.That(dto.CodeInternal, Is.EqualTo(string.Empty));
        Assert.That(dto.Year, Is.EqualTo(0));
        Assert.That(dto.Owner, Is.Null);
        Assert.That(dto.Images, Is.Null);
        Assert.That(dto.Traces, Is.Null);
    }

    [Test]
    public void OwnerDto_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var dto = new OwnerDto();

        // Assert
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto.IdOwner, Is.EqualTo(0));
        Assert.That(dto.Name, Is.EqualTo(string.Empty));
        Assert.That(dto.Address, Is.EqualTo(string.Empty));
        Assert.That(dto.Photo, Is.Null);
        Assert.That(dto.Birthday, Is.EqualTo(default(DateTime)));
    }

    [Test]
    public void OwnerDto_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var dto = new OwnerDto();
        var birthday = new DateTime(1990, 5, 15);

        // Act
        dto.IdOwner = 1;
        dto.Name = "Test Owner";
        dto.Address = "123 Owner Street";
        dto.Photo = "https://example.com/photo.jpg";
        dto.Birthday = birthday;

        // Assert
        Assert.That(dto.IdOwner, Is.EqualTo(1));
        Assert.That(dto.Name, Is.EqualTo("Test Owner"));
        Assert.That(dto.Address, Is.EqualTo("123 Owner Street"));
        Assert.That(dto.Photo, Is.EqualTo("https://example.com/photo.jpg"));
        Assert.That(dto.Birthday, Is.EqualTo(birthday));
    }

    [Test]
    public void PropertyImageDto_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var dto = new PropertyImageDto();

        // Assert
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto.IdPropertyImage, Is.EqualTo(0));
        Assert.That(dto.IdProperty, Is.EqualTo(0));
        Assert.That(dto.File, Is.EqualTo(string.Empty));
        Assert.That(dto.Enabled, Is.False);
    }

    [Test]
    public void PropertyImageDto_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var dto = new PropertyImageDto();

        // Act
        dto.IdPropertyImage = 1;
        dto.IdProperty = 10;
        dto.File = "property_image.jpg";
        dto.Enabled = true;

        // Assert
        Assert.That(dto.IdPropertyImage, Is.EqualTo(1));
        Assert.That(dto.IdProperty, Is.EqualTo(10));
        Assert.That(dto.File, Is.EqualTo("property_image.jpg"));
        Assert.That(dto.Enabled, Is.True);
    }

    [Test]
    public void PropertyTraceDto_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var dto = new PropertyTraceDto();

        // Assert
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto.IdPropertyTrace, Is.EqualTo(0));
        Assert.That(dto.DateSale, Is.EqualTo(default(DateTime)));
        Assert.That(dto.Name, Is.EqualTo(string.Empty));
        Assert.That(dto.Value, Is.EqualTo(0));
        Assert.That(dto.Tax, Is.EqualTo(0));
        Assert.That(dto.IdProperty, Is.EqualTo(0));
    }

    [Test]
    public void PropertyTraceDto_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var dto = new PropertyTraceDto();
        var saleDate = new DateTime(2023, 6, 20);

        // Act
        dto.IdPropertyTrace = 1;
        dto.DateSale = saleDate;
        dto.Name = "Property Sale";
        dto.Value = 300000;
        dto.Tax = 15000;
        dto.IdProperty = 10;

        // Assert
        Assert.That(dto.IdPropertyTrace, Is.EqualTo(1));
        Assert.That(dto.DateSale, Is.EqualTo(saleDate));
        Assert.That(dto.Name, Is.EqualTo("Property Sale"));
        Assert.That(dto.Value, Is.EqualTo(300000));
        Assert.That(dto.Tax, Is.EqualTo(15000));
        Assert.That(dto.IdProperty, Is.EqualTo(10));
    }
}