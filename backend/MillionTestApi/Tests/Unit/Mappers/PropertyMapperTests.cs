using MillionTestApi.Application.Mappers;
using MillionTestApi.DTOs;
using MillionTestApi.Models;
using NUnit.Framework;

namespace MillionTestApi.Tests.Unit.Mappers;

[TestFixture]
public class PropertyMapperTests
{
    [Test]
    public void ToEntity_WithValidDto_ShouldMapCorrectly()
    {
        // Arrange
        var dto = new PropertyDto
        {
            IdProperty = 1,
            Name = "Test Property",
            Address = "123 Test St",
            Price = 250000,
            CodeInternal = "TEST001",
            Year = 2020,
            IdOwner = 1,
            OwnerName = "Test Owner"
        };

        // Act
        var entity = PropertyMapper.ToEntity(dto);

        // Assert
        Assert.That(entity, Is.Not.Null);
        Assert.That(entity.IdProperty, Is.EqualTo(dto.IdProperty));
        Assert.That(entity.Name, Is.EqualTo(dto.Name));
        Assert.That(entity.Address, Is.EqualTo(dto.Address));
        Assert.That(entity.Price, Is.EqualTo(dto.Price));
        Assert.That(entity.CodeInternal, Is.EqualTo(dto.CodeInternal));
        Assert.That(entity.Year, Is.EqualTo(dto.Year));
        Assert.That(entity.IdOwner, Is.EqualTo(dto.IdOwner));
    }

    [Test]
    public void ToEntity_WithIdOverride_ShouldUseProvidedId()
    {
        // Arrange
        var dto = new PropertyDto
        {
            IdProperty = 1,
            Name = "Test Property"
        };
        const int overrideId = 5;

        // Act
        var entity = PropertyMapper.ToEntity(dto, overrideId);

        // Assert
        Assert.That(entity.IdProperty, Is.EqualTo(overrideId));
        Assert.That(entity.Name, Is.EqualTo(dto.Name));
    }

    [Test]
    public void ToEntity_WithNullDto_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => PropertyMapper.ToEntity(null!));
    }

    [Test]
    public void ToDto_WithValidEntity_ShouldMapCorrectly()
    {
        // Arrange
        var entity = new Property
        {
            IdProperty = 1,
            Name = "Test Property",
            Address = "123 Test St",
            Price = 250000,
            CodeInternal = "TEST001",
            Year = 2020,
            IdOwner = 1,
            Owner = new Owner
            {
                IdOwner = 1,
                Name = "Test Owner",
                Address = "Owner Address",
                Photo = "https://example.com/photo.jpg"
            }
        };

        // Act
        var dto = PropertyMapper.ToDto(entity);

        // Assert
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto.IdProperty, Is.EqualTo(entity.IdProperty));
        Assert.That(dto.Name, Is.EqualTo(entity.Name));
        Assert.That(dto.Address, Is.EqualTo(entity.Address));
        Assert.That(dto.Price, Is.EqualTo(entity.Price));
        Assert.That(dto.CodeInternal, Is.EqualTo(entity.CodeInternal));
        Assert.That(dto.Year, Is.EqualTo(entity.Year));
        Assert.That(dto.IdOwner, Is.EqualTo(entity.IdOwner));
        Assert.That(dto.OwnerName, Is.EqualTo("Test Owner"));
    }

    [Test]
    public void ToDto_WithEntityWithoutOwner_ShouldMapCorrectly()
    {
        // Arrange
        var entity = new Property
        {
            IdProperty = 1,
            Name = "Test Property",
            Address = "123 Test St",
            Price = 250000,
            CodeInternal = "TEST001",
            Year = 2020,
            IdOwner = 1,
            Owner = null
        };

        // Act
        var dto = PropertyMapper.ToDto(entity);

        // Assert
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto.OwnerName, Is.Null);
    }

    [Test]
    public void ToDto_WithNullEntity_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => PropertyMapper.ToDto(null!));
    }

    [Test]
    public void CreateFilter_WithAllParameters_ShouldCreateFilterCorrectly()
    {
        // Arrange
        const string name = "Villa";
        const string address = "Beach St";
        const decimal minPrice = 100000;
        const decimal maxPrice = 500000;
        const int page = 2;
        const int pageSize = 20;

        // Act
        var filter = PropertyMapper.CreateFilter(name, address, minPrice, maxPrice, page, pageSize);

        // Assert
        Assert.That(filter, Is.Not.Null);
        Assert.That(filter.Name, Is.EqualTo(name));
        Assert.That(filter.Address, Is.EqualTo(address));
        Assert.That(filter.MinPrice, Is.EqualTo(minPrice));
        Assert.That(filter.MaxPrice, Is.EqualTo(maxPrice));
        Assert.That(filter.Page, Is.EqualTo(page));
        Assert.That(filter.PageSize, Is.EqualTo(pageSize));
    }

    [Test]
    public void CreateFilter_WithDefaults_ShouldUseDefaultValues()
    {
        // Act
        var filter = PropertyMapper.CreateFilter();

        // Assert
        Assert.That(filter, Is.Not.Null);
        Assert.That(filter.Name, Is.Null);
        Assert.That(filter.Address, Is.Null);
        Assert.That(filter.MinPrice, Is.Null);
        Assert.That(filter.MaxPrice, Is.Null);
        Assert.That(filter.Page, Is.EqualTo(1));
        Assert.That(filter.PageSize, Is.EqualTo(10));
    }

    [Test]
    public void CreateFilter_WithInvalidPage_ShouldClampToMinimum()
    {
        // Act
        var filter = PropertyMapper.CreateFilter(page: 0);

        // Assert
        Assert.That(filter.Page, Is.EqualTo(1));
    }

    [Test]
    public void CreateFilter_WithInvalidPageSize_ShouldClampToLimits()
    {
        // Act
        var filterTooSmall = PropertyMapper.CreateFilter(pageSize: 0);
        var filterTooLarge = PropertyMapper.CreateFilter(pageSize: 200);

        // Assert
        Assert.That(filterTooSmall.PageSize, Is.EqualTo(1));
        Assert.That(filterTooLarge.PageSize, Is.EqualTo(100));
    }

    [Test]
    public void CreateFilter_WithWhitespaceStrings_ShouldTrimValues()
    {
        // Act
        var filter = PropertyMapper.CreateFilter("  Villa  ", "  Beach St  ");

        // Assert
        Assert.That(filter.Name, Is.EqualTo("Villa"));
        Assert.That(filter.Address, Is.EqualTo("Beach St"));
    }

    [Test]
    public void ToDtoCollection_WithValidEntities_ShouldMapAllEntities()
    {
        // Arrange
        var entities = new List<Property>
        {
            new Property { IdProperty = 1, Name = "Property 1", Address = "Address 1", Price = 100000, CodeInternal = "P001", Year = 2020, IdOwner = 1 },
            new Property { IdProperty = 2, Name = "Property 2", Address = "Address 2", Price = 200000, CodeInternal = "P002", Year = 2021, IdOwner = 2 }
        };

        // Act
        var dtos = PropertyMapper.ToDtoCollection(entities);

        // Assert
        Assert.That(dtos, Is.Not.Null);
        Assert.That(dtos.Count(), Is.EqualTo(2));
        
        var dtoList = dtos.ToList();
        Assert.That(dtoList[0].IdProperty, Is.EqualTo(1));
        Assert.That(dtoList[0].Name, Is.EqualTo("Property 1"));
        Assert.That(dtoList[1].IdProperty, Is.EqualTo(2));
        Assert.That(dtoList[1].Name, Is.EqualTo("Property 2"));
    }

    [Test]
    public void ToDtoCollection_WithEmptyCollection_ShouldReturnEmptyCollection()
    {
        // Arrange
        var entities = new List<Property>();

        // Act
        var dtos = PropertyMapper.ToDtoCollection(entities);

        // Assert
        Assert.That(dtos, Is.Not.Null);
        Assert.That(dtos.Count(), Is.EqualTo(0));
    }

    [Test]
    public void ToDtoCollection_WithNullCollection_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => PropertyMapper.ToDtoCollection(null!));
    }
}