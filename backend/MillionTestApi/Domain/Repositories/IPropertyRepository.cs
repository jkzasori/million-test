using MillionTestApi.DTOs;
using MillionTestApi.Models;

namespace MillionTestApi.Domain.Repositories;

public interface IPropertyRepository
{
    Task<PropertyListResponseDto> GetPropertiesAsync(PropertyFilterDto filter);
    Task<PropertyDetailDto?> GetPropertyByIdAsync(int id);
    Task<Property> CreatePropertyAsync(Property property);
    Task<Property?> UpdatePropertyAsync(int id, Property property);
    Task<bool> DeletePropertyAsync(int id);
}
