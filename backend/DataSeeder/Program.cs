using Bogus;
using MongoDB.Driver;

namespace DataSeeder;

class Program
{
    private static readonly string[] PropertyTypes = {
        "Luxury Villa", "Modern Apartment", "Colonial House", "Penthouse", "Studio Loft",
        "Town House", "Beach House", "Mountain Cabin", "City Condo", "Suburban Home",
        "Duplex", "Triplex", "Mansion", "Cottage", "Bungalow", "High-rise Apartment",
        "Garden Apartment", "Loft", "Ranch House", "Victorian House"
    };

    private static readonly string[] PropertyAdjectives = {
        "Elegant", "Spacious", "Modern", "Cozy", "Luxury", "Charming", "Stunning",
        "Beautiful", "Magnificent", "Exquisite", "Premium", "Exclusive", "Sophisticated",
        "Contemporary", "Classic", "Upscale", "Stylish", "Grand", "Pristine", "Impressive"
    };

    private static readonly string[] Cities = {
        "Miami", "Los Angeles", "New York", "Chicago", "San Francisco", "Boston",
        "Seattle", "Austin", "Denver", "Atlanta", "Phoenix", "Dallas", "Houston",
        "Las Vegas", "San Diego", "Portland", "Nashville", "Charlotte", "Orlando", "Tampa"
    };

    private static readonly string[] ImageUrls = {
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    };

    static async Task Main(string[] args)
    {
        Console.WriteLine("🏠 Million Test Properties - Data Seeder");
        Console.WriteLine("==========================================");
        
        var client = new MongoClient("mongodb://localhost:27017");
        var database = client.GetDatabase("million_test_dev");
        
        // Drop existing collections to start fresh
        await database.DropCollectionAsync("owners");
        await database.DropCollectionAsync("properties");
        await database.DropCollectionAsync("property_images");
        await database.DropCollectionAsync("property_traces");
        
        var ownersCollection = database.GetCollection<Owner>("owners");
        var propertiesCollection = database.GetCollection<Property>("properties");
        var imagesCollection = database.GetCollection<PropertyImage>("property_images");
        var tracesCollection = database.GetCollection<PropertyTrace>("property_traces");

        Console.WriteLine("🗑️  Cleared existing data");

        // Generate owners
        var ownerFaker = new Faker<Owner>()
            .RuleFor(o => o.IdOwner, f => f.Random.Int(1, 1000000))
            .RuleFor(o => o.Name, f => f.Name.FullName())
            .RuleFor(o => o.Address, f => $"{f.Address.StreetAddress()}, {f.PickRandom(Cities)}, {f.Address.StateAbbr()} {f.Address.ZipCode()}")
            .RuleFor(o => o.Photo, f => $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(f.Name.FirstName())}+{Uri.EscapeDataString(f.Name.LastName())}&size=200&background=f0f0f0&color=333")
            .RuleFor(o => o.Birthday, f => f.Date.Between(new DateTime(1950, 1, 1), new DateTime(1995, 12, 31)));

        Console.WriteLine("👥 Generating 1,000 owners...");
        var owners = ownerFaker.Generate(1000);
        
        // Ensure unique IdOwner values
        for (int i = 0; i < owners.Count; i++)
        {
            owners[i].IdOwner = i + 1;
        }
        
        await ownersCollection.InsertManyAsync(owners);
        Console.WriteLine($"✅ Created {owners.Count} owners");

        // Generate properties
        var propertyFaker = new Faker<Property>()
            .RuleFor(p => p.IdProperty, f => f.Random.Int(1, 1000000))
            .RuleFor(p => p.Name, f => $"{f.PickRandom(PropertyAdjectives)} {f.PickRandom(PropertyTypes)}")
            .RuleFor(p => p.Address, f => $"{f.Address.StreetAddress()}, {f.PickRandom(Cities)}, {f.Address.StateAbbr()} {f.Address.ZipCode()}")
            .RuleFor(p => p.Price, f => f.Random.Decimal(50000, 5000000))
            .RuleFor(p => p.CodeInternal, f => $"PROP{f.Random.AlphaNumeric(6).ToUpper()}")
            .RuleFor(p => p.Year, f => f.Random.Int(1980, 2024))
            .RuleFor(p => p.IdOwner, f => f.Random.Int(1, 1000));

        Console.WriteLine("🏘️  Generating 2,500 properties...");
        var properties = propertyFaker.Generate(2500);
        
        // Ensure unique IdProperty values
        for (int i = 0; i < properties.Count; i++)
        {
            properties[i].IdProperty = i + 1;
        }
        
        await propertiesCollection.InsertManyAsync(properties);
        Console.WriteLine($"✅ Created {properties.Count} properties");

        // Generate property images (2-5 images per property)
        var images = new List<PropertyImage>();
        var imageIdCounter = 1;
        
        Console.WriteLine("📸 Generating property images...");
        foreach (var property in properties)
        {
            var imageCount = new Random().Next(2, 6); // 2-5 images per property
            for (int i = 0; i < imageCount; i++)
            {
                images.Add(new PropertyImage
                {
                    IdPropertyImage = imageIdCounter++,
                    IdProperty = property.IdProperty,
                    File = new Faker().PickRandom(ImageUrls),
                    Enabled = i < 4 // Enable first 4 images, disable others if any
                });
            }
        }
        
        await imagesCollection.InsertManyAsync(images);
        Console.WriteLine($"✅ Created {images.Count} property images");

        // Generate property traces (1-3 transactions per property)
        var traces = new List<PropertyTrace>();
        var traceIdCounter = 1;
        var traceNames = new[] { 
            "Initial Purchase", "Refinancing", "Market Appraisal", "Insurance Assessment",
            "Tax Assessment", "Sale Transaction", "Mortgage Application", "Property Transfer"
        };
        
        Console.WriteLine("📈 Generating property transaction history...");
        foreach (var property in properties)
        {
            var traceCount = new Random().Next(1, 4); // 1-3 traces per property
            var faker = new Faker();
            
            for (int i = 0; i < traceCount; i++)
            {
                var baseValue = property.Price * (decimal)faker.Random.Double(0.7, 1.3); // ±30% of property price
                traces.Add(new PropertyTrace
                {
                    IdPropertyTrace = traceIdCounter++,
                    IdProperty = property.IdProperty,
                    DateSale = faker.Date.Between(new DateTime(2020, 1, 1), DateTime.Now),
                    Name = faker.PickRandom(traceNames),
                    Value = Math.Round(baseValue, 2),
                    Tax = Math.Round(baseValue * (decimal)faker.Random.Double(0.01, 0.08), 2) // 1-8% tax
                });
            }
        }
        
        await tracesCollection.InsertManyAsync(traces);
        Console.WriteLine($"✅ Created {traces.Count} property traces");

        // Create indexes for better performance
        Console.WriteLine("📊 Creating database indexes...");
        
        await propertiesCollection.Indexes.CreateOneAsync(
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(p => p.IdOwner)));
        
        await propertiesCollection.Indexes.CreateOneAsync(
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Text(p => p.Name).Text(p => p.Address)));
        
        await propertiesCollection.Indexes.CreateOneAsync(
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(p => p.Price)));
        
        await imagesCollection.Indexes.CreateOneAsync(
            new CreateIndexModel<PropertyImage>(Builders<PropertyImage>.IndexKeys.Ascending(i => i.IdProperty)));
        
        await tracesCollection.Indexes.CreateOneAsync(
            new CreateIndexModel<PropertyTrace>(Builders<PropertyTrace>.IndexKeys.Ascending(t => t.IdProperty)));

        Console.WriteLine("✅ Created performance indexes");
        Console.WriteLine();
        Console.WriteLine("🎉 DATA SEEDING COMPLETED SUCCESSFULLY!");
        Console.WriteLine("======================================");
        Console.WriteLine($"📊 SUMMARY:");
        Console.WriteLine($"   👥 Owners: {owners.Count:N0}");
        Console.WriteLine($"   🏘️  Properties: {properties.Count:N0}");
        Console.WriteLine($"   📸 Images: {images.Count:N0}");
        Console.WriteLine($"   📈 Traces: {traces.Count:N0}");
        Console.WriteLine();
        Console.WriteLine($"🌐 Test your API: curl http://localhost:5000/api/properties");
        Console.WriteLine($"🔍 Frontend ready: http://localhost:3000");
    }
}