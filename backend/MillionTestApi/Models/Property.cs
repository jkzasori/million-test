using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MillionTestApi.Models;

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
    
    [BsonIgnore]
    public Owner? Owner { get; set; }
    
    [BsonIgnore]
    public List<PropertyImage>? Images { get; set; }
    
    [BsonIgnore]
    public List<PropertyTrace>? Traces { get; set; }
}