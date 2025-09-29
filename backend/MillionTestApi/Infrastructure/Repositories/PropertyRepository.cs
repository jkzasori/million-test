using System.Text.Json;
using Microsoft.Extensions.Options;
using MillionTestApi.Domain.Exceptions;
using MillionTestApi.Domain.Repositories;
using MillionTestApi.DTOs;
using MillionTestApi.Infrastructure.Services;
using MillionTestApi.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

namespace MillionTestApi.Infrastructure.Repositories;

public class PropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<Property> _properties;
    private readonly IMongoCollection<Owner> _owners;
    private readonly IMongoCollection<PropertyImage> _propertyImages;
    private readonly IMongoCollection<PropertyTrace> _propertyTraces;
    private readonly ILogger<PropertyRepository> _logger;
    private readonly ICacheService _cacheService;

    public PropertyRepository(IOptions<DatabaseSettings> databaseSettings, ILogger<PropertyRepository> logger, ICacheService cacheService)
    {
        _logger = logger;
        _cacheService = cacheService;

        try
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);

            _properties = mongoDatabase.GetCollection<Property>(databaseSettings.Value.PropertiesCollectionName);
            _owners = mongoDatabase.GetCollection<Owner>(databaseSettings.Value.OwnersCollectionName);
            _propertyImages = mongoDatabase.GetCollection<PropertyImage>(databaseSettings.Value.PropertyImagesCollectionName);
            _propertyTraces = mongoDatabase.GetCollection<PropertyTrace>(databaseSettings.Value.PropertyTracesCollectionName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize MongoDB collections");
            throw new DatabaseException("Failed to connect to database", ex);
        }
    }

    public async Task<PropertyListResponseDto> GetPropertiesAsync(PropertyFilterDto filter)
    {
        try
        {
            // Create cache key based on filter parameters
            var cacheKey = CacheKeys.GetPropertiesListKey(JsonSerializer.Serialize(filter));

            // Try to get from cache first
            var cachedResult = await _cacheService.GetAsync<PropertyListResponseDto>(cacheKey);
            if (cachedResult != null)
            {
                _logger.LogDebug("Cache hit for properties list");
                return cachedResult;
            }

            var filterBuilder = Builders<Property>.Filter.Empty;

            // Use text search for better performance when available
            if (!string.IsNullOrWhiteSpace(filter.Name) || !string.IsNullOrWhiteSpace(filter.Address))
            {
                var searchTerms = new List<string>();
                if (!string.IsNullOrWhiteSpace(filter.Name)) searchTerms.Add(filter.Name);
                if (!string.IsNullOrWhiteSpace(filter.Address)) searchTerms.Add(filter.Address);

                var searchText = string.Join(" ", searchTerms);
                filterBuilder &= Builders<Property>.Filter.Text(searchText);
            }

            if (filter.MinPrice.HasValue)
            {
                filterBuilder &= Builders<Property>.Filter.Gte(p => p.Price, filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue)
            {
                filterBuilder &= Builders<Property>.Filter.Lte(p => p.Price, filter.MaxPrice.Value);
            }

            // Use simple approach instead of complex aggregation
            var totalCount = await _properties.CountDocumentsAsync(filterBuilder);
            
            var properties = await _properties
                .Find(filterBuilder)
                .Sort(Builders<Property>.Sort.Ascending(p => p.IdProperty))
                .Skip((filter.Page - 1) * filter.PageSize)
                .Limit(filter.PageSize)
                .ToListAsync();

            // Optimized: Get all owner IDs and property IDs in bulk
            var ownerIds = properties.Select(p => p.IdOwner).Distinct().ToList();
            var propertyIds = properties.Select(p => p.IdProperty).ToList();

            // Bulk fetch owners and images
            var owners = await _owners
                .Find(o => ownerIds.Contains(o.IdOwner))
                .ToListAsync();

            var images = await _propertyImages
                .Find(img => propertyIds.Contains(img.IdProperty) && img.Enabled)
                .ToListAsync();

            // Create lookup dictionaries for O(1) access
            var ownerLookup = owners.ToDictionary(o => o.IdOwner, o => o);
            var imageLookup = images
                .GroupBy(img => img.IdProperty)
                .ToDictionary(g => g.Key, g => g.First());

            var propertyDtos = properties.Select(property => new PropertyDto
            {
                IdProperty = property.IdProperty,
                IdOwner = property.IdOwner,
                Name = property.Name,
                Address = property.Address,
                Price = property.Price,
                CodeInternal = property.CodeInternal,
                Year = property.Year,
                Image = imageLookup.GetValueOrDefault(property.IdProperty)?.File,
                OwnerName = ownerLookup.GetValueOrDefault(property.IdOwner)?.Name
            }).ToList();

            var response = new PropertyListResponseDto
            {
                Properties = propertyDtos,
                TotalCount = (int)totalCount,
                Page = filter.Page,
                PageSize = filter.PageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize)
            };

            // Cache the result for 10 minutes
            await _cacheService.SetAsync(cacheKey, response, TimeSpan.FromMinutes(10));

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get properties with filter: {@Filter}", filter);
            throw new DatabaseException("Failed to retrieve properties", ex);
        }
    }

    public async Task<PropertyDetailDto?> GetPropertyByIdAsync(int id)
    {
        try
        {
            // Check cache first
            var cacheKey = CacheKeys.GetPropertyDetailKey(id);
            var cachedResult = await _cacheService.GetAsync<PropertyDetailDto>(cacheKey);
            if (cachedResult != null)
            {
                _logger.LogDebug("Cache hit for property detail: {PropertyId}", id);
                return cachedResult;
            }

            var property = await _properties.Find(p => p.IdProperty == id).FirstOrDefaultAsync();
            if (property == null)
            {
                throw new PropertyNotFoundException(id);
            }

            // Parallel execution for better performance
            var ownerTask = _owners.Find(o => o.IdOwner == property.IdOwner).FirstOrDefaultAsync();
            var imagesTask = _propertyImages.Find(img => img.IdProperty == id).ToListAsync();
            var tracesTask = _propertyTraces.Find(t => t.IdProperty == id).ToListAsync();

            await Task.WhenAll(ownerTask, imagesTask, tracesTask);

            var owner = ownerTask.Result;
            var images = imagesTask.Result;
            var traces = tracesTask.Result;

            var result = new PropertyDetailDto
            {
                IdProperty = property.IdProperty,
                IdOwner = property.IdOwner,
                Name = property.Name,
                Address = property.Address,
                Price = property.Price,
                CodeInternal = property.CodeInternal,
                Year = property.Year,
                Image = images.FirstOrDefault(img => img.Enabled)?.File,
                OwnerName = owner?.Name,
                Owner = owner != null ? new OwnerDto
                {
                    IdOwner = owner.IdOwner,
                    Name = owner.Name,
                    Address = owner.Address,
                    Photo = owner.Photo,
                    Birthday = owner.Birthday
                } : null,
                Images = images.Select(img => new PropertyImageDto
                {
                    IdPropertyImage = img.IdPropertyImage,
                    IdProperty = img.IdProperty,
                    File = img.File,
                    Enabled = img.Enabled
                }).ToList(),
                Traces = traces.Select(t => new PropertyTraceDto
                {
                    IdPropertyTrace = t.IdPropertyTrace,
                    DateSale = t.DateSale,
                    Name = t.Name,
                    Value = t.Value,
                    Tax = t.Tax,
                    IdProperty = t.IdProperty
                }).ToList()
            };

            // Cache the result for 30 minutes
            await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(30));

            return result;
        }
        catch (PropertyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get property by ID: {PropertyId}", id);
            throw new DatabaseException($"Failed to retrieve property with ID {id}", ex);
        }
    }

    public async Task<Property> CreatePropertyAsync(Property property)
    {
        try
        {
            // Validate property doesn't already exist
            var existing = await _properties.Find(p => p.IdProperty == property.IdProperty).FirstOrDefaultAsync();
            if (existing != null)
            {
                throw new ValidationException($"Property with ID {property.IdProperty} already exists");
            }

            await _properties.InsertOneAsync(property);
            _logger.LogInformation("Property created successfully: {PropertyId}", property.IdProperty);
            return property;
        }
        catch (ValidationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create property: {@Property}", property);
            throw new DatabaseException("Failed to create property", ex);
        }
    }

    public async Task<Property?> UpdatePropertyAsync(int id, Property property)
    {
        try
        {
            property.IdProperty = id;
            var result = await _properties.ReplaceOneAsync(p => p.IdProperty == id, property);

            if (result.MatchedCount == 0)
            {
                throw new PropertyNotFoundException(id);
            }

            _logger.LogInformation("Property updated successfully: {PropertyId}", id);
            return property;
        }
        catch (PropertyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update property: {PropertyId}", id);
            throw new DatabaseException($"Failed to update property with ID {id}", ex);
        }
    }

    public async Task<bool> DeletePropertyAsync(int id)
    {
        try
        {
            var result = await _properties.DeleteOneAsync(p => p.IdProperty == id);

            if (result.DeletedCount == 0)
            {
                throw new PropertyNotFoundException(id);
            }

            _logger.LogInformation("Property deleted successfully: {PropertyId}", id);
            return true;
        }
        catch (PropertyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete property: {PropertyId}", id);
            throw new DatabaseException($"Failed to delete property with ID {id}", ex);
        }
    }
}
