using MillionTestApi.DTOs;
using MillionTestApi.Models;

namespace MillionTestApi.Application.Mappers;

/// <summary>
/// Provides mapping functionality between Property domain models and DTOs
/// </summary>
public static class PropertyMapper
{
    /// <summary>
    /// Maps a PropertyDto to a Property domain model
    /// </summary>
    /// <param name="dto">The PropertyDto to map</param>
    /// <param name="id">Optional property ID for updates</param>
    /// <returns>A Property domain model</returns>
    public static Property ToEntity(PropertyDto dto, int? id = null)
    {
        ArgumentNullException.ThrowIfNull(dto);

        return new Property
        {
            IdProperty = id ?? dto.IdProperty,
            Name = dto.Name,
            Address = dto.Address,
            Price = dto.Price,
            CodeInternal = dto.CodeInternal,
            Year = dto.Year,
            IdOwner = dto.IdOwner
        };
    }

    /// <summary>
    /// Maps a Property domain model to a PropertyDto
    /// </summary>
    /// <param name="entity">The Property entity to map</param>
    /// <returns>A PropertyDto</returns>
    public static PropertyDto ToDto(Property entity)
    {
        ArgumentNullException.ThrowIfNull(entity);

        return new PropertyDto
        {
            IdProperty = entity.IdProperty,
            IdOwner = entity.IdOwner,
            Name = entity.Name,
            Address = entity.Address,
            Price = entity.Price,
            CodeInternal = entity.CodeInternal,
            Year = entity.Year,
            OwnerName = entity.Owner?.Name
        };
    }

    /// <summary>
    /// Maps a PropertyFilterDto to ensure consistent filter creation
    /// </summary>
    /// <param name="name">Property name filter</param>
    /// <param name="address">Property address filter</param>
    /// <param name="minPrice">Minimum price filter</param>
    /// <param name="maxPrice">Maximum price filter</param>
    /// <param name="page">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <returns>A configured PropertyFilterDto</returns>
    public static PropertyFilterDto CreateFilter(
        string? name = null,
        string? address = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        int page = 1,
        int pageSize = 10)
    {
        return new PropertyFilterDto
        {
            Name = name?.Trim(),
            Address = address?.Trim(),
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            Page = Math.Max(page, 1),
            PageSize = Math.Clamp(pageSize, 1, 100)
        };
    }

    /// <summary>
    /// Maps a collection of Property entities to PropertyDto collection
    /// </summary>
    /// <param name="entities">Collection of Property entities</param>
    /// <returns>Collection of PropertyDto objects</returns>
    public static IEnumerable<PropertyDto> ToDtoCollection(IEnumerable<Property> entities)
    {
        ArgumentNullException.ThrowIfNull(entities);

        return entities.Select(ToDto);
    }
}
