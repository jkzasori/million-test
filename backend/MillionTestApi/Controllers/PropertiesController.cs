using Microsoft.AspNetCore.Mvc;
using MillionTestApi.DTOs;
using MillionTestApi.Application.Services;

namespace MillionTestApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _propertyService;

    public PropertiesController(IPropertyService propertyService)
    {
        _propertyService = propertyService;
    }

    /// <summary>
    /// Get all properties with optional filters
    /// </summary>
    /// <param name="name">Filter by property name</param>
    /// <param name="address">Filter by property address</param>
    /// <param name="minPrice">Minimum price filter</param>
    /// <param name="maxPrice">Maximum price filter</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10)</param>
    /// <returns>List of properties with pagination</returns>
    [HttpGet]
    public async Task<ActionResult<PropertyListResponseDto>> GetProperties(
        [FromQuery] string? name = null,
        [FromQuery] string? address = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var filter = new PropertyFilterDto
        {
            Name = name,
            Address = address,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            Page = page,
            PageSize = pageSize
        };

        var result = await _propertyService.GetPropertiesAsync(filter);
        return Ok(result);
    }

    /// <summary>
    /// Get property by ID with detailed information
    /// </summary>
    /// <param name="id">Property ID</param>
    /// <returns>Property details including owner, images and traces</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyDetailDto>> GetProperty(int id)
    {
        var property = await _propertyService.GetPropertyByIdAsync(id);
        return Ok(property);
    }

    /// <summary>
    /// Create a new property
    /// </summary>
    /// <param name="propertyDto">Property data</param>
    /// <returns>Created property</returns>
    [HttpPost]
    public async Task<ActionResult<PropertyDto>> CreateProperty(PropertyDto propertyDto)
    {
        var property = new Models.Property
        {
            IdProperty = propertyDto.IdProperty,
            Name = propertyDto.Name,
            Address = propertyDto.Address,
            Price = propertyDto.Price,
            CodeInternal = propertyDto.CodeInternal,
            Year = propertyDto.Year,
            IdOwner = propertyDto.IdOwner
        };

        var createdProperty = await _propertyService.CreatePropertyAsync(property);
        
        var result = new PropertyDto
        {
            IdProperty = createdProperty.IdProperty,
            IdOwner = createdProperty.IdOwner,
            Name = createdProperty.Name,
            Address = createdProperty.Address,
            Price = createdProperty.Price,
            CodeInternal = createdProperty.CodeInternal,
            Year = createdProperty.Year
        };

        return CreatedAtAction(nameof(GetProperty), new { id = result.IdProperty }, result);
    }

    /// <summary>
    /// Update an existing property
    /// </summary>
    /// <param name="id">Property ID</param>
    /// <param name="propertyDto">Updated property data</param>
    /// <returns>Updated property</returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<PropertyDto>> UpdateProperty(int id, PropertyDto propertyDto)
    {
        var property = new Models.Property
        {
            IdProperty = id,
            Name = propertyDto.Name,
            Address = propertyDto.Address,
            Price = propertyDto.Price,
            CodeInternal = propertyDto.CodeInternal,
            Year = propertyDto.Year,
            IdOwner = propertyDto.IdOwner
        };

        var updatedProperty = await _propertyService.UpdatePropertyAsync(id, property);

        var result = new PropertyDto
        {
            IdProperty = updatedProperty!.IdProperty,
            IdOwner = updatedProperty.IdOwner,
            Name = updatedProperty.Name,
            Address = updatedProperty.Address,
            Price = updatedProperty.Price,
            CodeInternal = updatedProperty.CodeInternal,
            Year = updatedProperty.Year
        };

        return Ok(result);
    }

    /// <summary>
    /// Delete a property
    /// </summary>
    /// <param name="id">Property ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProperty(int id)
    {
        await _propertyService.DeletePropertyAsync(id);
        return NoContent();
    }
}