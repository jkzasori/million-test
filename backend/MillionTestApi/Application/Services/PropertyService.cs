using MillionTestApi.DTOs;
using MillionTestApi.Models;
using MillionTestApi.Domain.Repositories;
using MillionTestApi.Domain.Exceptions;

namespace MillionTestApi.Application.Services;

public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly ILogger<PropertyService> _logger;

    public PropertyService(IPropertyRepository propertyRepository, ILogger<PropertyService> logger)
    {
        _propertyRepository = propertyRepository;
        _logger = logger;
    }

    public async Task<PropertyListResponseDto> GetPropertiesAsync(PropertyFilterDto filter)
    {
        _logger.LogInformation("Getting properties with filter: {@Filter}", filter);
        
        ValidateFilter(filter);
        
        var result = await _propertyRepository.GetPropertiesAsync(filter);
        
        _logger.LogInformation("Retrieved {Count} properties out of {Total}", 
            result.Properties.Count, result.TotalCount);
            
        return result;
    }

    public async Task<PropertyDetailDto?> GetPropertyByIdAsync(int id)
    {
        _logger.LogInformation("Getting property by ID: {PropertyId}", id);
        
        if (id <= 0)
        {
            throw new ValidationException("Property ID must be greater than 0");
        }

        var result = await _propertyRepository.GetPropertyByIdAsync(id);
        
        _logger.LogInformation("Retrieved property: {PropertyId}", id);
        
        return result;
    }

    public async Task<Property> CreatePropertyAsync(Property property)
    {
        _logger.LogInformation("Creating property: {PropertyId}", property.IdProperty);
        
        ValidateProperty(property);
        
        var result = await _propertyRepository.CreatePropertyAsync(property);
        
        _logger.LogInformation("Property created successfully: {PropertyId}", result.IdProperty);
        
        return result;
    }

    public async Task<Property?> UpdatePropertyAsync(int id, Property property)
    {
        _logger.LogInformation("Updating property: {PropertyId}", id);
        
        if (id <= 0)
        {
            throw new ValidationException("Property ID must be greater than 0");
        }
        
        ValidateProperty(property);
        
        var result = await _propertyRepository.UpdatePropertyAsync(id, property);
        
        _logger.LogInformation("Property updated successfully: {PropertyId}", id);
        
        return result;
    }

    public async Task<bool> DeletePropertyAsync(int id)
    {
        _logger.LogInformation("Deleting property: {PropertyId}", id);
        
        if (id <= 0)
        {
            throw new ValidationException("Property ID must be greater than 0");
        }

        var result = await _propertyRepository.DeletePropertyAsync(id);
        
        _logger.LogInformation("Property deleted successfully: {PropertyId}", id);
        
        return result;
    }

    private static void ValidateFilter(PropertyFilterDto filter)
    {
        if (filter.Page <= 0)
        {
            throw new ValidationException("Page number must be greater than 0");
        }

        if (filter.PageSize <= 0 || filter.PageSize > 100)
        {
            throw new ValidationException("Page size must be between 1 and 100");
        }

        if (filter.MinPrice.HasValue && filter.MinPrice < 0)
        {
            throw new ValidationException("Minimum price cannot be negative");
        }

        if (filter.MaxPrice.HasValue && filter.MaxPrice < 0)
        {
            throw new ValidationException("Maximum price cannot be negative");
        }

        if (filter.MinPrice.HasValue && filter.MaxPrice.HasValue && filter.MinPrice > filter.MaxPrice)
        {
            throw new ValidationException("Minimum price cannot be greater than maximum price");
        }
    }

    private static void ValidateProperty(Property property)
    {
        if (string.IsNullOrWhiteSpace(property.Name))
        {
            throw new ValidationException("Property name is required");
        }

        if (property.Name.Length > 200)
        {
            throw new ValidationException("Property name cannot exceed 200 characters");
        }

        if (string.IsNullOrWhiteSpace(property.Address))
        {
            throw new ValidationException("Property address is required");
        }

        if (property.Address.Length > 500)
        {
            throw new ValidationException("Property address cannot exceed 500 characters");
        }

        if (property.Price <= 0)
        {
            throw new ValidationException("Property price must be greater than 0");
        }

        if (string.IsNullOrWhiteSpace(property.CodeInternal))
        {
            throw new ValidationException("Internal code is required");
        }

        if (property.Year < 1800 || property.Year > DateTime.Now.Year + 10)
        {
            throw new ValidationException($"Property year must be between 1800 and {DateTime.Now.Year + 10}");
        }

        if (property.IdOwner <= 0)
        {
            throw new ValidationException("Owner ID must be greater than 0");
        }
    }
}