using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MillionTestApi.DTOs;
using MillionTestApi.Models;

namespace MillionTestApi.Services;

public class PropertyService : IPropertyService
{
    private readonly IMongoCollection<Property> _properties;
    private readonly IMongoCollection<Owner> _owners;
    private readonly IMongoCollection<PropertyImage> _propertyImages;
    private readonly IMongoCollection<PropertyTrace> _propertyTraces;

    public PropertyService(IOptions<DatabaseSettings> databaseSettings)
    {
        var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);

        _properties = mongoDatabase.GetCollection<Property>(databaseSettings.Value.PropertiesCollectionName);
        _owners = mongoDatabase.GetCollection<Owner>(databaseSettings.Value.OwnersCollectionName);
        _propertyImages = mongoDatabase.GetCollection<PropertyImage>(databaseSettings.Value.PropertyImagesCollectionName);
        _propertyTraces = mongoDatabase.GetCollection<PropertyTrace>(databaseSettings.Value.PropertyTracesCollectionName);
    }

    public async Task<PropertyListResponseDto> GetPropertiesAsync(PropertyFilterDto filter)
    {
        var filterBuilder = Builders<Property>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            filterBuilder &= Builders<Property>.Filter.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(filter.Name, "i"));
        }

        if (!string.IsNullOrWhiteSpace(filter.Address))
        {
            filterBuilder &= Builders<Property>.Filter.Regex(p => p.Address, new MongoDB.Bson.BsonRegularExpression(filter.Address, "i"));
        }

        if (filter.MinPrice.HasValue)
        {
            filterBuilder &= Builders<Property>.Filter.Gte(p => p.Price, filter.MinPrice.Value);
        }

        if (filter.MaxPrice.HasValue)
        {
            filterBuilder &= Builders<Property>.Filter.Lte(p => p.Price, filter.MaxPrice.Value);
        }

        var totalCount = await _properties.CountDocumentsAsync(filterBuilder);
        
        var properties = await _properties
            .Find(filterBuilder)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Limit(filter.PageSize)
            .ToListAsync();

        var propertyDtos = new List<PropertyDto>();
        
        foreach (var property in properties)
        {
            var owner = await _owners.Find(o => o.IdOwner == property.IdOwner).FirstOrDefaultAsync();
            var firstImage = await _propertyImages
                .Find(img => img.IdProperty == property.IdProperty && img.Enabled)
                .FirstOrDefaultAsync();

            propertyDtos.Add(new PropertyDto
            {
                IdProperty = property.IdProperty,
                IdOwner = property.IdOwner,
                Name = property.Name,
                Address = property.Address,
                Price = property.Price,
                CodeInternal = property.CodeInternal,
                Year = property.Year,
                Image = firstImage?.File,
                OwnerName = owner?.Name
            });
        }

        return new PropertyListResponseDto
        {
            Properties = propertyDtos,
            TotalCount = (int)totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize)
        };
    }

    public async Task<PropertyDetailDto?> GetPropertyByIdAsync(int id)
    {
        var property = await _properties.Find(p => p.IdProperty == id).FirstOrDefaultAsync();
        if (property == null) return null;

        var owner = await _owners.Find(o => o.IdOwner == property.IdOwner).FirstOrDefaultAsync();
        var images = await _propertyImages.Find(img => img.IdProperty == id).ToListAsync();
        var traces = await _propertyTraces.Find(t => t.IdProperty == id).ToListAsync();

        return new PropertyDetailDto
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
    }

    public async Task<Property> CreatePropertyAsync(Property property)
    {
        await _properties.InsertOneAsync(property);
        return property;
    }

    public async Task<Property?> UpdatePropertyAsync(int id, Property property)
    {
        property.IdProperty = id;
        var result = await _properties.ReplaceOneAsync(p => p.IdProperty == id, property);
        return result.MatchedCount > 0 ? property : null;
    }

    public async Task<bool> DeletePropertyAsync(int id)
    {
        var result = await _properties.DeleteOneAsync(p => p.IdProperty == id);
        return result.DeletedCount > 0;
    }
}