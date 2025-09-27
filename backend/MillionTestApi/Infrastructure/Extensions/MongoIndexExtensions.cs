using MongoDB.Driver;
using MillionTestApi.Models;

namespace MillionTestApi.Infrastructure.Extensions;

public static class MongoIndexExtensions
{
    public static async Task CreateIndexesAsync(this IMongoDatabase database)
    {
        var propertyCollection = database.GetCollection<Property>("Properties");
        var ownerCollection = database.GetCollection<Owner>("Owners");
        var imageCollection = database.GetCollection<PropertyImage>("PropertyImages");
        var traceCollection = database.GetCollection<PropertyTrace>("PropertyTraces");

        // Property indexes for optimal search performance
        var propertyIndexes = new List<CreateIndexModel<Property>>
        {
            // Text index for name and address search
            new CreateIndexModel<Property>(
                Builders<Property>.IndexKeys
                    .Text(p => p.Name)
                    .Text(p => p.Address),
                new CreateIndexOptions { Background = true }
            ),
            
            // Price range queries
            new CreateIndexModel<Property>(
                Builders<Property>.IndexKeys.Ascending(p => p.Price),
                new CreateIndexOptions { Background = true }
            ),
            
            // Owner lookup optimization
            new CreateIndexModel<Property>(
                Builders<Property>.IndexKeys.Ascending(p => p.IdOwner),
                new CreateIndexOptions { Background = true }
            ),
            
            // Compound index for common filter combinations
            new CreateIndexModel<Property>(
                Builders<Property>.IndexKeys
                    .Ascending(p => p.Price)
                    .Ascending(p => p.Year),
                new CreateIndexOptions { Background = true }
            ),
            
            // Compound index for pagination optimization
            new CreateIndexModel<Property>(
                Builders<Property>.IndexKeys
                    .Ascending(p => p.IdProperty)
                    .Ascending(p => p.Price),
                new CreateIndexOptions { Background = true }
            )
        };

        // PropertyImage indexes
        var imageIndexes = new List<CreateIndexModel<PropertyImage>>
        {
            new CreateIndexModel<PropertyImage>(
                Builders<PropertyImage>.IndexKeys.Ascending(img => img.IdProperty),
                new CreateIndexOptions { Background = true }
            ),
            new CreateIndexModel<PropertyImage>(
                Builders<PropertyImage>.IndexKeys
                    .Ascending(img => img.IdProperty)
                    .Ascending(img => img.Enabled),
                new CreateIndexOptions { Background = true }
            )
        };

        // PropertyTrace indexes
        var traceIndexes = new List<CreateIndexModel<PropertyTrace>>
        {
            new CreateIndexModel<PropertyTrace>(
                Builders<PropertyTrace>.IndexKeys.Ascending(t => t.IdProperty),
                new CreateIndexOptions { Background = true }
            ),
            new CreateIndexModel<PropertyTrace>(
                Builders<PropertyTrace>.IndexKeys.Descending(t => t.DateSale),
                new CreateIndexOptions { Background = true }
            )
        };

        // Owner indexes
        var ownerIndexes = new List<CreateIndexModel<Owner>>
        {
            new CreateIndexModel<Owner>(
                Builders<Owner>.IndexKeys.Ascending(o => o.IdOwner),
                new CreateIndexOptions { Background = true }
            ),
            new CreateIndexModel<Owner>(
                Builders<Owner>.IndexKeys.Text(o => o.Name),
                new CreateIndexOptions { Background = true }
            )
        };

        try
        {
            // Create all indexes in parallel for better performance
            var tasks = new[]
            {
                propertyCollection.Indexes.CreateManyAsync(propertyIndexes),
                imageCollection.Indexes.CreateManyAsync(imageIndexes),
                traceCollection.Indexes.CreateManyAsync(traceIndexes),
                ownerCollection.Indexes.CreateManyAsync(ownerIndexes)
            };

            await Task.WhenAll(tasks);
        }
        catch (Exception ex)
        {
            // Log but don't fail startup if indexes already exist
            Console.WriteLine($"Index creation warning: {ex.Message}");
        }
    }
}