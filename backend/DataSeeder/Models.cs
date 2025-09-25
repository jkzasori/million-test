using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DataSeeder;

public class Owner
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonElement("idOwner")]
    public int IdOwner { get; set; }
    
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;
    
    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;
    
    [BsonElement("photo")]
    public string? Photo { get; set; }
    
    [BsonElement("birthday")]
    public DateTime Birthday { get; set; }
}

public class Property
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonElement("idProperty")]
    public int IdProperty { get; set; }
    
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;
    
    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;
    
    [BsonElement("price")]
    public decimal Price { get; set; }
    
    [BsonElement("codeInternal")]
    public string CodeInternal { get; set; } = string.Empty;
    
    [BsonElement("year")]
    public int Year { get; set; }
    
    [BsonElement("idOwner")]
    public int IdOwner { get; set; }
}

public class PropertyImage
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonElement("idPropertyImage")]
    public int IdPropertyImage { get; set; }
    
    [BsonElement("idProperty")]
    public int IdProperty { get; set; }
    
    [BsonElement("file")]
    public string File { get; set; } = string.Empty;
    
    [BsonElement("enabled")]
    public bool Enabled { get; set; }
}

public class PropertyTrace
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonElement("idPropertyTrace")]
    public int IdPropertyTrace { get; set; }
    
    [BsonElement("dateSale")]
    public DateTime DateSale { get; set; }
    
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;
    
    [BsonElement("value")]
    public decimal Value { get; set; }
    
    [BsonElement("tax")]
    public decimal Tax { get; set; }
    
    [BsonElement("idProperty")]
    public int IdProperty { get; set; }
}