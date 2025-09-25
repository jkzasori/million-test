using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MillionTestApi.Models;

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