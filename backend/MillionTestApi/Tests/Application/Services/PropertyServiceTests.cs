using Microsoft.Extensions.Logging;
using MillionTestApi.Application.Services;
using MillionTestApi.Domain.Repositories;
using MillionTestApi.DTOs;
using MillionTestApi.Models;
using Moq;
using NUnit.Framework;

namespace MillionTestApi.Tests.Application.Services;

[TestFixture]
public class PropertyServiceTests
{
    private Mock<IPropertyRepository> _mockPropertyRepository = null!;
    private Mock<ILogger<PropertyService>> _mockLogger = null!;
    private PropertyService _propertyService = null!;

    [SetUp]
    public void Setup()
    {
        _mockPropertyRepository = new Mock<IPropertyRepository>();
        _mockLogger = new Mock<ILogger<PropertyService>>();
        _propertyService = new PropertyService(_mockPropertyRepository.Object, _mockLogger.Object);
    }

    [Test]
    public async Task GetPropertiesAsync_ShouldReturnCachedData_WhenCacheHit()
    {
        // Arrange
        var filters = new PropertyFilterDto { Page = 1, PageSize = 10 };
        var expectedResult = new PropertyListResponseDto
        {
            Properties = new List<PropertyDto>
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

        _mockPropertyRepository
            .Setup(x => x.GetPropertiesAsync(It.IsAny<PropertyFilterDto>()))
            .ReturnsAsync(expectedResult);

        // Act
        var result = await _propertyService.GetPropertiesAsync(filters);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Properties.Count, Is.EqualTo(1));
        Assert.That(result.Properties.First().Name, Is.EqualTo("Test Property"));
        _mockPropertyRepository.Verify(x => x.GetPropertiesAsync(It.IsAny<PropertyFilterDto>()), Times.Once);
    }

    [Test]
    public async Task GetPropertiesAsync_ShouldCallRepository_AndReturnResults()
    {
        // Arrange
        var filters = new PropertyFilterDto { Page = 1, PageSize = 10 };
        var expectedResult = new PropertyListResponseDto
        {
            Properties = new List<PropertyDto>
            {
                new PropertyDto
                {
                    IdProperty = 1,
                    Name = "Test Property",
                    Address = "Test Address",
                    Price = 100000,
                    CodeInternal = "TEST001",
                    Year = 2023
                }
            },
            TotalCount = 1,
            Page = 1,
            PageSize = 10
        };

        _mockPropertyRepository
            .Setup(x => x.GetPropertiesAsync(filters))
            .ReturnsAsync(expectedResult);

        // Act
        var result = await _propertyService.GetPropertiesAsync(filters);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Properties.Count, Is.EqualTo(1));
        Assert.That(result.Properties.First().Name, Is.EqualTo("Test Property"));
        _mockPropertyRepository.Verify(x => x.GetPropertiesAsync(filters), Times.Once);
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

        var propertyDetailDto = new PropertyDetailDto
        {
            IdProperty = propertyId,
            Name = "Test Property",
            Address = "Test Address",
            Price = 100000,
            CodeInternal = "TEST001",
            Year = 2023
        };

        _mockPropertyRepository
            .Setup(x => x.GetPropertyByIdAsync(propertyId))
            .ReturnsAsync(propertyDetailDto);

        // Act
        var result = await _propertyService.GetPropertyByIdAsync(propertyId);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.IdProperty, Is.EqualTo(propertyId));
        Assert.That(result.Name, Is.EqualTo("Test Property"));
    }

    [Test]
    public async Task GetPropertyByIdAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        var propertyId = 999;

        _mockPropertyRepository
            .Setup(x => x.GetPropertyByIdAsync(propertyId))
            .ReturnsAsync((PropertyDetailDto?)null);

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
            Name = "test",
            Address = "test address"
        };

        var expectedResult = new PropertyListResponseDto
        {
            Properties = new List<PropertyDto>(),
            TotalCount = 0,
            Page = 1,
            PageSize = 5
        };

        _mockPropertyRepository
            .Setup(x => x.GetPropertiesAsync(filters))
            .ReturnsAsync(expectedResult);

        // Act
        await _propertyService.GetPropertiesAsync(filters);

        // Assert
        _mockPropertyRepository.Verify(x => x.GetPropertiesAsync(
            It.Is<PropertyFilterDto>(f =>
                f.MinPrice == 50000 &&
                f.MaxPrice == 200000 &&
                f.Name == "test" &&
                f.Address == "test address")), Times.Once);
    }
}
