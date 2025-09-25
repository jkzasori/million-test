namespace MillionTestApi.DTOs;

public class PropertyDto
{
    public int IdProperty { get; set; }
    public int IdOwner { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Image { get; set; }
    public string? OwnerName { get; set; }
    public string CodeInternal { get; set; } = string.Empty;
    public int Year { get; set; }
}

public class PropertyDetailDto : PropertyDto
{
    public OwnerDto? Owner { get; set; }
    public List<PropertyImageDto>? Images { get; set; }
    public List<PropertyTraceDto>? Traces { get; set; }
}