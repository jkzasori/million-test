namespace MillionTestApi.DTOs;

public class PropertyImageDto
{
    public int IdPropertyImage { get; set; }
    public int IdProperty { get; set; }
    public string File { get; set; } = string.Empty;
    public bool Enabled { get; set; }
}