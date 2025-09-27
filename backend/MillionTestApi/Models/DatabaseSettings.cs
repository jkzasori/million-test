namespace MillionTestApi.Models;

public class DatabaseSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string OwnersCollectionName { get; set; } = "owners";
    public string PropertiesCollectionName { get; set; } = "properties";
    public string PropertyImagesCollectionName { get; set; } = "property_images";
    public string PropertyTracesCollectionName { get; set; } = "property_traces";
}
