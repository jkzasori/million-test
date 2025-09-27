using Microsoft.AspNetCore.Mvc;
using MillionTestApi.Application.Mappers;
using MillionTestApi.Application.Services;
using MillionTestApi.Domain.Exceptions;
using MillionTestApi.DTOs;

namespace MillionTestApi.Controllers;

/// <summary>
/// Handles HTTP requests for property management operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _propertyService;
    private readonly ILogger<PropertiesController> _logger;

    /// <summary>
    /// Initializes a new instance of the PropertiesController
    /// </summary>
    /// <param name="propertyService">Service for property operations</param>
    /// <param name="logger">Logger for request tracking</param>
    public PropertiesController(
        IPropertyService propertyService,
        ILogger<PropertiesController> logger)
    {
        _propertyService = propertyService ?? throw new ArgumentNullException(nameof(propertyService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Retrieves a paginated list of properties with optional filtering
    /// </summary>
    /// <param name="name">Filter by property name</param>
    /// <param name="address">Filter by property address</param>
    /// <param name="minPrice">Minimum price filter</param>
    /// <param name="maxPrice">Maximum price filter</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10, max: 100)</param>
    /// <returns>Paginated list of properties</returns>
    /// <response code="200">Returns the list of properties</response>
    /// <response code="400">Invalid filter parameters</response>
    [HttpGet]
    [ProducesResponseType(typeof(PropertyListResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PropertyListResponseDto>> GetProperties(
        [FromQuery] string? name = null,
        [FromQuery] string? address = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            _logger.LogInformation("Retrieving properties with filters - Page: {Page}, Size: {PageSize}", page, pageSize);

            var filter = PropertyMapper.CreateFilter(name, address, minPrice, maxPrice, page, pageSize);
            var result = await _propertyService.GetPropertiesAsync(filter);

            _logger.LogInformation("Successfully retrieved {Count} properties", result.Properties.Count);
            return Ok(result);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning("Validation error in GetProperties: {Message}", ex.Message);
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Retrieves detailed information for a specific property
    /// </summary>
    /// <param name="id">Property identifier</param>
    /// <returns>Property details including owner, images and transaction history</returns>
    /// <response code="200">Returns the property details</response>
    /// <response code="404">Property not found</response>
    /// <response code="400">Invalid property ID</response>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PropertyDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PropertyDetailDto>> GetPropertyById(int id)
    {
        try
        {
            _logger.LogInformation("Retrieving property details for ID: {PropertyId}", id);

            var property = await _propertyService.GetPropertyByIdAsync(id);

            if (property == null)
            {
                _logger.LogWarning("Property not found: {PropertyId}", id);
                return NotFound($"Property with ID {id} was not found");
            }

            _logger.LogInformation("Successfully retrieved property: {PropertyId}", id);
            return Ok(property);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning("Validation error in GetPropertyById: {Message}", ex.Message);
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Creates a new property in the system
    /// </summary>
    /// <param name="propertyDto">Property information to create</param>
    /// <returns>Created property with assigned ID</returns>
    /// <response code="201">Property created successfully</response>
    /// <response code="400">Invalid property data</response>
    [HttpPost]
    [ProducesResponseType(typeof(PropertyDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PropertyDto>> CreateProperty([FromBody] PropertyDto propertyDto)
    {
        try
        {
            ValidatePropertyDto(propertyDto);

            _logger.LogInformation("Creating new property: {PropertyName}", propertyDto.Name);

            var property = PropertyMapper.ToEntity(propertyDto);
            var createdProperty = await _propertyService.CreatePropertyAsync(property);
            var result = PropertyMapper.ToDto(createdProperty);

            _logger.LogInformation("Successfully created property with ID: {PropertyId}", result.IdProperty);
            return CreatedAtAction(nameof(GetPropertyById), new { id = result.IdProperty }, result);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning("Validation error in CreateProperty: {Message}", ex.Message);
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Updates an existing property
    /// </summary>
    /// <param name="id">Property identifier to update</param>
    /// <param name="propertyDto">Updated property information</param>
    /// <returns>Updated property details</returns>
    /// <response code="200">Property updated successfully</response>
    /// <response code="404">Property not found</response>
    /// <response code="400">Invalid property data</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(PropertyDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PropertyDto>> UpdateProperty(int id, [FromBody] PropertyDto propertyDto)
    {
        try
        {
            ValidatePropertyDto(propertyDto);

            _logger.LogInformation("Updating property: {PropertyId}", id);

            var property = PropertyMapper.ToEntity(propertyDto, id);
            var updatedProperty = await _propertyService.UpdatePropertyAsync(id, property);

            if (updatedProperty == null)
            {
                _logger.LogWarning("Property not found for update: {PropertyId}", id);
                return NotFound($"Property with ID {id} was not found");
            }

            var result = PropertyMapper.ToDto(updatedProperty);

            _logger.LogInformation("Successfully updated property: {PropertyId}", id);
            return Ok(result);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning("Validation error in UpdateProperty: {Message}", ex.Message);
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Deletes a property from the system
    /// </summary>
    /// <param name="id">Property identifier to delete</param>
    /// <returns>Success confirmation</returns>
    /// <response code="204">Property deleted successfully</response>
    /// <response code="404">Property not found</response>
    /// <response code="400">Invalid property ID</response>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> DeleteProperty(int id)
    {
        try
        {
            _logger.LogInformation("Deleting property: {PropertyId}", id);

            var deleted = await _propertyService.DeletePropertyAsync(id);

            if (!deleted)
            {
                _logger.LogWarning("Property not found for deletion: {PropertyId}", id);
                return NotFound($"Property with ID {id} was not found");
            }

            _logger.LogInformation("Successfully deleted property: {PropertyId}", id);
            return NoContent();
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning("Validation error in DeleteProperty: {Message}", ex.Message);
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Validates PropertyDto for required fields and constraints
    /// </summary>
    /// <param name="propertyDto">Property DTO to validate</param>
    /// <exception cref="ValidationException">Thrown when validation fails</exception>
    private static void ValidatePropertyDto(PropertyDto propertyDto)
    {
        if (propertyDto == null)
        {
            throw new ValidationException("Property data is required");
        }

        if (string.IsNullOrWhiteSpace(propertyDto.Name))
        {
            throw new ValidationException("Property name is required");
        }

        if (string.IsNullOrWhiteSpace(propertyDto.Address))
        {
            throw new ValidationException("Property address is required");
        }

        if (propertyDto.Price <= 0)
        {
            throw new ValidationException("Property price must be greater than zero");
        }

        if (propertyDto.IdOwner <= 0)
        {
            throw new ValidationException("Valid owner ID is required");
        }
    }
}
