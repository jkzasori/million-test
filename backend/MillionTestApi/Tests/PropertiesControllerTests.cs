using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MillionTestApi.Application.Services;
using MillionTestApi.Controllers;
using MillionTestApi.DTOs;
using Moq;
using NUnit.Framework;

namespace MillionTestApi.Tests;

[TestFixture]
public class PropertiesControllerTests
{
    private Mock<IPropertyService> _mockPropertyService = null!;
    private Mock<ILogger<PropertiesController>> _mockLogger = null!;
    private PropertiesController _controller = null!;

    [SetUp]
    public void Setup()
    {
        _mockPropertyService = new Mock<IPropertyService>();
        _mockLogger = new Mock<ILogger<PropertiesController>>();
        _controller = new PropertiesController(_mockPropertyService.Object, _mockLogger.Object);
    }

    [Test]
    public async Task GetProperties_WithValidFilters_ShouldReturnOkResult()
    {
        // Arrange
        var expectedResponse = new PropertyListResponseDto
        {
            Properties = new List<PropertyDto>
            {
                new PropertyDto { IdProperty = 1, Name = "Test Property", Address = "Test Address", Price = 100000 }
            },
            TotalCount = 1,
            Page = 1,
            PageSize = 10,
            TotalPages = 1
        };

        _mockPropertyService.Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilterDto>()))
                           .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GetProperties("Test", "Address", 50000, 150000, 1, 10);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult, Is.Not.Null);
        Assert.That(okResult!.Value, Is.EqualTo(expectedResponse));

        _mockPropertyService.Verify(s => s.GetPropertiesAsync(It.Is<PropertyFilterDto>(f =>
            f.Name == "Test" &&
            f.Address == "Address" &&
            f.MinPrice == 50000 &&
            f.MaxPrice == 150000 &&
            f.Page == 1 &&
            f.PageSize == 10
        )), Times.Once);
    }

    [Test]
    public async Task GetProperty_WithValidId_ShouldReturnOkResult()
    {
        // Arrange
        const int propertyId = 1;
        var expectedProperty = new PropertyDetailDto
        {
            IdProperty = propertyId,
            Name = "Test Property",
            Address = "Test Address",
            Price = 100000
        };

        _mockPropertyService.Setup(s => s.GetPropertyByIdAsync(propertyId))
                           .ReturnsAsync(expectedProperty);

        // Act
        var result = await _controller.GetPropertyById(propertyId);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult, Is.Not.Null);
        Assert.That(okResult!.Value, Is.EqualTo(expectedProperty));
    }

    [Test]
    public async Task GetProperty_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        const int invalidId = 999;
        _mockPropertyService.Setup(s => s.GetPropertyByIdAsync(invalidId))
                           .ReturnsAsync((PropertyDetailDto?)null);

        // Act
        var result = await _controller.GetPropertyById(invalidId);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task CreateProperty_WithValidData_ShouldReturnCreatedResult()
    {
        // Arrange
        var propertyDto = new PropertyDto
        {
            IdProperty = 1,
            Name = "New Property",
            Address = "New Address",
            Price = 200000,
            IdOwner = 1
        };

        var createdProperty = new Models.Property
        {
            IdProperty = 1,
            Name = "New Property",
            Address = "New Address",
            Price = 200000,
            IdOwner = 1
        };

        _mockPropertyService.Setup(s => s.CreatePropertyAsync(It.IsAny<Models.Property>()))
                           .ReturnsAsync(createdProperty);

        // Act
        var result = await _controller.CreateProperty(propertyDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
        var createdResult = result.Result as CreatedAtActionResult;
        Assert.That(createdResult, Is.Not.Null);
        Assert.That(createdResult!.ActionName, Is.EqualTo(nameof(_controller.GetPropertyById)));
    }

    [Test]
    public async Task UpdateProperty_WithValidData_ShouldReturnOkResult()
    {
        // Arrange
        const int propertyId = 1;
        var propertyDto = new PropertyDto
        {
            IdProperty = propertyId,
            Name = "Updated Property",
            Address = "Updated Address",
            Price = 300000,
            IdOwner = 1
        };

        var updatedProperty = new Models.Property
        {
            IdProperty = propertyId,
            Name = "Updated Property",
            Address = "Updated Address",
            Price = 300000,
            IdOwner = 1
        };

        _mockPropertyService.Setup(s => s.UpdatePropertyAsync(propertyId, It.IsAny<Models.Property>()))
                           .ReturnsAsync(updatedProperty);

        // Act
        var result = await _controller.UpdateProperty(propertyId, propertyDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task UpdateProperty_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        const int invalidId = 999;
        var propertyDto = new PropertyDto { IdProperty = invalidId };

        _mockPropertyService.Setup(s => s.UpdatePropertyAsync(invalidId, It.IsAny<Models.Property>()))
                           .ReturnsAsync((Models.Property?)null);

        // Act
        var result = await _controller.UpdateProperty(invalidId, propertyDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task DeleteProperty_WithValidId_ShouldReturnNoContent()
    {
        // Arrange
        const int propertyId = 1;
        _mockPropertyService.Setup(s => s.DeletePropertyAsync(propertyId))
                           .ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteProperty(propertyId);

        // Assert
        Assert.That(result, Is.InstanceOf<NoContentResult>());
    }

    [Test]
    public async Task DeleteProperty_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        const int invalidId = 999;
        _mockPropertyService.Setup(s => s.DeletePropertyAsync(invalidId))
                           .ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteProperty(invalidId);

        // Assert
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
    }
}
