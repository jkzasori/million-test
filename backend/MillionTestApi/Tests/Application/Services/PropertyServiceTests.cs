using MillionTestApi.Application.Services;
using MillionTestApi.Domain.Repositories;
using MillionTestApi.DTOs;
using MillionTestApi.Infrastructure.Services;
using MillionTestApi.Models;
using Moq;
using NUnit.Framework;

namespace MillionTestApi.Tests.Application.Services;

[TestFixture]
public class PropertyServiceTests
{
    private Mock<IPropertyRepository> _mockPropertyRepository = null!;
    private Mock<ICacheService> _mockCacheService = null!;
    private PropertyService _propertyService = null!;

    [SetUp]
    public void Setup()
    {
        _mockPropertyRepository = new Mock<IPropertyRepository>();
        _mockCacheService = new Mock<ICacheService>();
        _propertyService = new PropertyService(_mockPropertyRepository.Object, _mockCacheService.Object);
    }

    [Test]
    public async Task GetPropertiesAsync_ShouldReturnCachedData_WhenCacheHit()
    {
        // Arrange
        var filters = new PropertyFilterDto { Page = 1, PageSize = 10 };
        var expectedResult = new PaginatedResult<PropertyDto>
        {
            Items = new List<PropertyDto>
            {
                new PropertyDto
                {
                    IdProperty = 1,
                    Name = "Test Property",
                    Price = 100000
                }
            },
            TotalCount = 1,
            Page = 1,
            PageSize = 10
        };

        _mockCacheService
            .Setup(x => x.GetAsync<PaginatedResult<PropertyDto>>(It.IsAny<string>()))
            .ReturnsAsync(expectedResult);

        // Act
        var result = await _propertyService.GetPropertiesAsync(filters);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Items.Count(), Is.EqualTo(1));
        Assert.That(result.Items.First().Name, Is.EqualTo("Test Property"));
        _mockPropertyRepository.Verify(x => x.GetPropertiesAsync(It.IsAny<PropertyFilterDto>()), Times.Never);
    }

    [Test]
    public async Task GetPropertiesAsync_ShouldFetchFromRepository_WhenCacheMiss()
    {
        // Arrange
        var filters = new PropertyFilterDto { Page = 1, PageSize = 10 };
        var properties = new List<Property>
        {
            new Property
            {
                IdProperty = 1,
                Name = "Test Property",
                Address = "Test Address",
                Price = 100000,
                CodeInternal = "TEST001",
                Year = 2023
            }
        };

        _mockCacheService
            .Setup(x => x.GetAsync<PaginatedResult<PropertyDto>>(It.IsAny<string>()))
            .ReturnsAsync((PaginatedResult<PropertyDto>?)null);

        _mockPropertyRepository
            .Setup(x => x.GetPropertiesAsync(filters))
            .ReturnsAsync(new PaginatedResult<Property>
            {
                Items = properties,
                TotalCount = 1,
                Page = 1,
                PageSize = 10
            });

        // Act
        var result = await _propertyService.GetPropertiesAsync(filters);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Items.Count(), Is.EqualTo(1));
        Assert.That(result.Items.First().Name, Is.EqualTo("Test Property"));
        _mockPropertyRepository.Verify(x => x.GetPropertiesAsync(filters), Times.Once);
        _mockCacheService.Verify(x => x.SetAsync(It.IsAny<string>(), It.IsAny<PaginatedResult<PropertyDto>>(), It.IsAny<TimeSpan?>()), Times.Once);
    }

    [Test]
    public async Task GetPropertyByIdAsync_ShouldReturnProperty_WhenExists()
    {
        // Arrange
        var propertyId = 1;
        var property = new Property
        {
            IdProperty = propertyId,
            Name = "Test Property",
            Address = "Test Address",
            Price = 100000,
            CodeInternal = "TEST001",
            Year = 2023
        };

        _mockCacheService
            .Setup(x => x.GetAsync<PropertyDetailDto>(It.IsAny<string>()))
            .ReturnsAsync((PropertyDetailDto?)null);

        _mockPropertyRepository
            .Setup(x => x.GetPropertyByIdAsync(propertyId))
            .ReturnsAsync(property);

        // Act
        var result = await _propertyService.GetPropertyByIdAsync(propertyId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IdProperty, Is.EqualTo(propertyId));
        Assert.That(result.Name, Is.EqualTo("Test Property"));
    }

    [Test]
    public async Task GetPropertyByIdAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        var propertyId = 999;

        _mockCacheService
            .Setup(x => x.GetAsync<PropertyDetailDto>(It.IsAny<string>()))
            .ReturnsAsync((PropertyDetailDto?)null);

        _mockPropertyRepository
            .Setup(x => x.GetPropertyByIdAsync(propertyId))
            .ReturnsAsync((Property?)null);

        // Act
        var result = await _propertyService.GetPropertyByIdAsync(propertyId);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetPropertiesAsync_ShouldApplyFilters_WhenProvided()
    {
        // Arrange
        var filters = new PropertyFilterDto
        {
            Page = 1,
            PageSize = 5,
            MinPrice = 50000,
            MaxPrice = 200000,
            Year = 2023,
            Search = "test"
        };

        _mockCacheService
            .Setup(x => x.GetAsync<PaginatedResult<PropertyDto>>(It.IsAny<string>()))
            .ReturnsAsync((PaginatedResult<PropertyDto>?)null);

        _mockPropertyRepository
            .Setup(x => x.GetPropertiesAsync(filters))
            .ReturnsAsync(new PaginatedResult<Property>
            {
                Items = new List<Property>(),
                TotalCount = 0,
                Page = 1,
                PageSize = 5
            });

        // Act
        await _propertyService.GetPropertiesAsync(filters);

        // Assert
        _mockPropertyRepository.Verify(x => x.GetPropertiesAsync(
            It.Is<PropertyFilterDto>(f =>
                f.MinPrice == 50000 &&
                f.MaxPrice == 200000 &&
                f.Year == 2023 &&
                f.Search == "test")), Times.Once);
    }
}
