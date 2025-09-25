using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MillionTestApi.Models;

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