using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MillionTestApi.Controllers;
using MillionTestApi.DTOs;
using MillionTestApi.Models;
using MillionTestApi.Application.Services;
using Moq;
using NUnit.Framework;

namespace MillionTestApi.Tests.Unit.Controllers;

[TestFixture]
public class PropertiesControllerUnitTests
{
    private Mock<IPropertyService> _mockPropertyService = null!;
    private PropertiesController _controller = null!;

    [SetUp]
    public void Setup()
    {
        _mockPropertyService = new Mock<IPropertyService>();
        var mockLogger = new Mock<ILogger<PropertiesController>>();
        _controller = new PropertiesController(_mockPropertyService.Object, mockLogger.Object);
    }

    [Test]
    public async Task GetProperties_WithValidFilters_ShouldReturnOkWithData()
    {
        // Arrange
        var expectedResponse = new PropertyListResponseDto
        {
            Properties = new List<PropertyDto>
            {
                new PropertyDto 
                { 
                    IdProperty = 1, 
                    Name = "Test Property", 
                    Address = "123 Test St", 
                    Price = 500000,
                    CodeInternal = "PROP001",
                    Year = 2020,
                    IdOwner = 1
                }
            },
            TotalCount = 1,
            Page = 1,
            PageSize = 10,
            TotalPages = 1
        };

        _mockPropertyService
            .Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilterDto>()))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GetProperties("Test", "123 Test St", 400000, 600000, 1, 10);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult!.Value, Is.EqualTo(expectedResponse));

        _mockPropertyService.Verify(s => s.GetPropertiesAsync(It.Is<PropertyFilterDto>(f =>
            f.Name == "Test" &&
            f.Address == "123 Test St" &&
            f.MinPrice == 400000 &&
            f.MaxPrice == 600000 &&
            f.Page == 1 &&
            f.PageSize == 10
        )), Times.Once);
    }

    [Test]
    public async Task GetProperties_WithNullFilters_ShouldUseDefaults()
    {
        // Arrange
        var expectedResponse = new PropertyListResponseDto
        {
            Properties = new List<PropertyDto>(),
            TotalCount = 0,
            Page = 1,
            PageSize = 12,
            TotalPages = 0
        };

        _mockPropertyService
            .Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilterDto>()))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GetProperties(null, null, null, null, 1, 12);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());

        _mockPropertyService.Verify(s => s.GetPropertiesAsync(It.Is<PropertyFilterDto>(f =>
            f.Name == null &&
            f.Address == null &&
            f.MinPrice == null &&
            f.MaxPrice == null &&
            f.Page == 1 &&
            f.PageSize == 12
        )), Times.Once);
    }

    [Test]
    public async Task GetProperties_ServiceThrowsValidationException_ShouldReturnBadRequest()
    {
        // Arrange
        _mockPropertyService
            .Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilterDto>()))
            .ThrowsAsync(new MillionTestApi.Domain.Exceptions.ValidationException("Invalid filter parameters"));

        // Act
        var result = await _controller.GetProperties(null, null, null, null, 1, 10);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
        var badRequestResult = result.Result as BadRequestObjectResult;
        Assert.That(badRequestResult!.Value, Is.EqualTo("Invalid filter parameters"));
    }

    [Test]
    public async Task GetProperty_WithValidId_ShouldReturnOkWithProperty()
    {
        // Arrange
        const int propertyId = 1;
        var expectedProperty = new PropertyDetailDto
        {
            IdProperty = propertyId,
            Name = "Test Property",
            Address = "123 Test St",
            Price = 500000,
            CodeInternal = "PROP001",
            Year = 2020,
            IdOwner = 1,
            Owner = new OwnerDto 
            { 
                IdOwner = 1, 
                Name = "John Doe", 
                Address = "Owner Address" 
            },
            Images = new List<PropertyImageDto>
            {
                new PropertyImageDto { IdPropertyImage = 1, IdProperty = propertyId, File = "image1.jpg", Enabled = true }
            },
            Traces = new List<PropertyTraceDto>
            {
                new PropertyTraceDto { IdPropertyTrace = 1, IdProperty = propertyId, DateSale = DateTime.Now, Name = "Sale", Value = 500000, Tax = 25000 }
            }
        };

        _mockPropertyService
            .Setup(s => s.GetPropertyByIdAsync(propertyId))
            .ReturnsAsync(expectedProperty);

        // Act
        var result = await _controller.GetPropertyById(propertyId);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult!.Value, Is.EqualTo(expectedProperty));

        _mockPropertyService.Verify(s => s.GetPropertyByIdAsync(propertyId), Times.Once);
    }

    [Test]
    public async Task GetProperty_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        const int invalidId = 999;
        _mockPropertyService
            .Setup(s => s.GetPropertyByIdAsync(invalidId))
            .ReturnsAsync((PropertyDetailDto?)null);

        // Act
        var result = await _controller.GetPropertyById(invalidId);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
        var notFoundResult = result.Result as NotFoundObjectResult;
        Assert.That(notFoundResult!.Value, Is.EqualTo($"Property with ID {invalidId} was not found"));
    }

    [Test]
    public async Task CreateProperty_WithValidData_ShouldReturnCreatedAtAction()
    {
        // Arrange
        var propertyDto = new PropertyDto
        {
            Name = "New Property",
            Address = "456 New St",
            Price = 300000,
            CodeInternal = "PROP002",
            Year = 2023,
            IdOwner = 2
        };

        var createdProperty = new Property
        {
            IdProperty = 10,
            Name = "New Property",
            Address = "456 New St",
            Price = 300000,
            CodeInternal = "PROP002",
            Year = 2023,
            IdOwner = 2
        };

        _mockPropertyService
            .Setup(s => s.CreatePropertyAsync(It.IsAny<Property>()))
            .ReturnsAsync(createdProperty);

        // Act
        var result = await _controller.CreateProperty(propertyDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
        var createdResult = result.Result as CreatedAtActionResult;
        Assert.That(createdResult!.ActionName, Is.EqualTo(nameof(_controller.GetPropertyById)));
        Assert.That(createdResult.RouteValues!["id"], Is.EqualTo(10));
        var returnedDto = createdResult.Value as PropertyDto;
        Assert.That(returnedDto, Is.Not.Null);
        Assert.That(returnedDto!.IdProperty, Is.EqualTo(createdProperty.IdProperty));
        Assert.That(returnedDto.Name, Is.EqualTo(createdProperty.Name));

        _mockPropertyService.Verify(s => s.CreatePropertyAsync(It.Is<Property>(p =>
            p.Name == propertyDto.Name &&
            p.Address == propertyDto.Address &&
            p.Price == propertyDto.Price &&
            p.CodeInternal == propertyDto.CodeInternal &&
            p.Year == propertyDto.Year &&
            p.IdOwner == propertyDto.IdOwner
        )), Times.Once);
    }

    [Test]
    public async Task CreateProperty_WithInvalidModelState_ShouldReturnBadRequest()
    {
        // Arrange
        var propertyDto = new PropertyDto(); // Invalid - missing required fields
        _controller.ModelState.AddModelError("Name", "Name is required");

        // Act
        var result = await _controller.CreateProperty(propertyDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());

        _mockPropertyService.Verify(s => s.CreatePropertyAsync(It.IsAny<Property>()), Times.Never);
    }

    [Test]
    public async Task UpdateProperty_WithValidData_ShouldReturnOkWithUpdatedProperty()
    {
        // Arrange
        const int propertyId = 1;
        var propertyDto = new PropertyDto
        {
            IdProperty = propertyId,
            Name = "Updated Property",
            Address = "789 Updated St",
            Price = 400000,
            CodeInternal = "PROP001_UPD",
            Year = 2021,
            IdOwner = 1
        };

        var updatedProperty = new Property
        {
            IdProperty = propertyId,
            Name = "Updated Property",
            Address = "789 Updated St",
            Price = 400000,
            CodeInternal = "PROP001_UPD",
            Year = 2021,
            IdOwner = 1
        };

        _mockPropertyService
            .Setup(s => s.UpdatePropertyAsync(propertyId, It.IsAny<Property>()))
            .ReturnsAsync(updatedProperty);

        // Act
        var result = await _controller.UpdateProperty(propertyId, propertyDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        var returnedDto = okResult!.Value as PropertyDto;
        Assert.That(returnedDto, Is.Not.Null);
        Assert.That(returnedDto!.IdProperty, Is.EqualTo(updatedProperty.IdProperty));
        Assert.That(returnedDto.Name, Is.EqualTo(updatedProperty.Name));

        _mockPropertyService.Verify(s => s.UpdatePropertyAsync(propertyId, It.Is<Property>(p =>
            p.IdProperty == propertyId &&
            p.Name == propertyDto.Name &&
            p.Address == propertyDto.Address &&
            p.Price == propertyDto.Price
        )), Times.Once);
    }

    [Test]
    public async Task UpdateProperty_WithInvalidPropertyData_ShouldReturnBadRequest()
    {
        // Arrange
        const int propertyId = 1;
        var propertyDto = new PropertyDto { IdProperty = propertyId, Name = "" }; // Invalid - empty name

        // Act
        var result = await _controller.UpdateProperty(propertyId, propertyDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
        var badRequestResult = result.Result as BadRequestObjectResult;
        Assert.That(badRequestResult!.Value, Is.EqualTo("Property name is required"));

        _mockPropertyService.Verify(s => s.UpdatePropertyAsync(It.IsAny<int>(), It.IsAny<Property>()), Times.Never);
    }

    [Test]
    public async Task UpdateProperty_WithNonExistentProperty_ShouldReturnNotFound()
    {
        // Arrange
        const int propertyId = 999;
        var propertyDto = new PropertyDto { 
            IdProperty = propertyId, 
            Name = "Valid Name",
            Address = "Valid Address",
            Price = 100000,
            IdOwner = 1,
            CodeInternal = "TEST001",
            Year = 2020
        };

        _mockPropertyService
            .Setup(s => s.UpdatePropertyAsync(propertyId, It.IsAny<Property>()))
            .ReturnsAsync((Property?)null);

        // Act
        var result = await _controller.UpdateProperty(propertyId, propertyDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
        var notFoundResult = result.Result as NotFoundObjectResult;
        Assert.That(notFoundResult!.Value, Is.EqualTo($"Property with ID {propertyId} was not found"));
    }

    [Test]
    public async Task DeleteProperty_WithValidId_ShouldReturnNoContent()
    {
        // Arrange
        const int propertyId = 1;
        _mockPropertyService
            .Setup(s => s.DeletePropertyAsync(propertyId))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteProperty(propertyId);

        // Assert
        Assert.That(result, Is.InstanceOf<NoContentResult>());

        _mockPropertyService.Verify(s => s.DeletePropertyAsync(propertyId), Times.Once);
    }

    [Test]
    public async Task DeleteProperty_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        const int invalidId = 999;
        _mockPropertyService
            .Setup(s => s.DeletePropertyAsync(invalidId))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteProperty(invalidId);

        // Assert
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
        var notFoundResult = result as NotFoundObjectResult;
        Assert.That(notFoundResult!.Value, Is.EqualTo($"Property with ID {invalidId} was not found"));
    }

    [Test]
    public async Task DeleteProperty_ServiceThrowsValidationException_ShouldReturnBadRequest()
    {
        // Arrange
        const int propertyId = 0; // Invalid ID
        _mockPropertyService
            .Setup(s => s.DeletePropertyAsync(propertyId))
            .ThrowsAsync(new MillionTestApi.Domain.Exceptions.ValidationException("Property ID must be greater than 0"));

        // Act
        var result = await _controller.DeleteProperty(propertyId);

        // Assert
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        var badRequestResult = result as BadRequestObjectResult;
        Assert.That(badRequestResult!.Value, Is.EqualTo("Property ID must be greater than 0"));
    }

    [Test]
    public void Constructor_WithNullService_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => new PropertiesController(null!, Mock.Of<ILogger<PropertiesController>>()));
    }

    [Test]
    public async Task GetProperties_WithInvalidPageSize_ShouldUseMaxAllowed()
    {
        // Arrange
        var expectedResponse = new PropertyListResponseDto
        {
            Properties = new List<PropertyDto>(),
            TotalCount = 0,
            Page = 1,
            PageSize = 100, // Max allowed
            TotalPages = 0
        };

        _mockPropertyService
            .Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilterDto>()))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GetProperties(null, null, null, null, 1, 200); // Requesting more than max

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());

        _mockPropertyService.Verify(s => s.GetPropertiesAsync(It.Is<PropertyFilterDto>(f =>
            f.PageSize <= 100 // Should be capped at maximum
        )), Times.Once);
    }
}