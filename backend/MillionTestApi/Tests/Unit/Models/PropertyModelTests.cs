using MillionTestApi.Models;
using NUnit.Framework;

namespace MillionTestApi.Tests.Unit.Models;

[TestFixture]
public class PropertyModelTests
{
    [Test]
    public void Property_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var property = new Property();

        // Assert
        Assert.That(property, Is.Not.Null);
        Assert.That(property.Id, Is.Null);
        Assert.That(property.IdProperty, Is.EqualTo(0));
        Assert.That(property.Name, Is.EqualTo(string.Empty));
        Assert.That(property.Address, Is.EqualTo(string.Empty));
        Assert.That(property.Price, Is.EqualTo(0));
        Assert.That(property.CodeInternal, Is.EqualTo(string.Empty));
        Assert.That(property.Year, Is.EqualTo(0));
        Assert.That(property.IdOwner, Is.EqualTo(0));
        Assert.That(property.Owner, Is.Null);
        Assert.That(property.Images, Is.Null);
        Assert.That(property.Traces, Is.Null);
    }

    [Test]
    public void Property_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var property = new Property();
        var owner = new Owner { IdOwner = 1, Name = "Test Owner" };
        var images = new List<PropertyImage> { new PropertyImage { IdPropertyImage = 1 } };
        var traces = new List<PropertyTrace> { new PropertyTrace { IdPropertyTrace = 1 } };

        // Act
        property.Id = "507f1f77bcf86cd799439011";
        property.IdProperty = 1;
        property.Name = "Test Property";
        property.Address = "123 Test Street";
        property.Price = 250000;
        property.CodeInternal = "TEST001";
        property.Year = 2020;
        property.IdOwner = 1;
        property.Owner = owner;
        property.Images = images;
        property.Traces = traces;

        // Assert
        Assert.That(property.Id, Is.EqualTo("507f1f77bcf86cd799439011"));
        Assert.That(property.IdProperty, Is.EqualTo(1));
        Assert.That(property.Name, Is.EqualTo("Test Property"));
        Assert.That(property.Address, Is.EqualTo("123 Test Street"));
        Assert.That(property.Price, Is.EqualTo(250000));
        Assert.That(property.CodeInternal, Is.EqualTo("TEST001"));
        Assert.That(property.Year, Is.EqualTo(2020));
        Assert.That(property.IdOwner, Is.EqualTo(1));
        Assert.That(property.Owner, Is.EqualTo(owner));
        Assert.That(property.Images, Is.EqualTo(images));
        Assert.That(property.Traces, Is.EqualTo(traces));
    }

    [Test]
    public void Owner_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var owner = new Owner();

        // Assert
        Assert.That(owner, Is.Not.Null);
        Assert.That(owner.Id, Is.Null);
        Assert.That(owner.IdOwner, Is.EqualTo(0));
        Assert.That(owner.Name, Is.EqualTo(string.Empty));
        Assert.That(owner.Address, Is.EqualTo(string.Empty));
        Assert.That(owner.Photo, Is.Null);
        Assert.That(owner.Birthday, Is.EqualTo(default(DateTime)));
    }

    [Test]
    public void Owner_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var owner = new Owner();
        var birthday = new DateTime(1990, 1, 1);

        // Act
        owner.Id = "507f1f77bcf86cd799439011";
        owner.IdOwner = 1;
        owner.Name = "Test Owner";
        owner.Address = "123 Owner Street";
        owner.Photo = "https://example.com/photo.jpg";
        owner.Birthday = birthday;

        // Assert
        Assert.That(owner.Id, Is.EqualTo("507f1f77bcf86cd799439011"));
        Assert.That(owner.IdOwner, Is.EqualTo(1));
        Assert.That(owner.Name, Is.EqualTo("Test Owner"));
        Assert.That(owner.Address, Is.EqualTo("123 Owner Street"));
        Assert.That(owner.Photo, Is.EqualTo("https://example.com/photo.jpg"));
        Assert.That(owner.Birthday, Is.EqualTo(birthday));
    }

    [Test]
    public void PropertyImage_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var image = new PropertyImage();

        // Assert
        Assert.That(image, Is.Not.Null);
        Assert.That(image.Id, Is.Null);
        Assert.That(image.IdPropertyImage, Is.EqualTo(0));
        Assert.That(image.IdProperty, Is.EqualTo(0));
        Assert.That(image.File, Is.EqualTo(string.Empty));
        Assert.That(image.Enabled, Is.False);
    }

    [Test]
    public void PropertyImage_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var image = new PropertyImage();

        // Act
        image.Id = "507f1f77bcf86cd799439011";
        image.IdPropertyImage = 1;
        image.IdProperty = 1;
        image.File = "image.jpg";
        image.Enabled = true;

        // Assert
        Assert.That(image.Id, Is.EqualTo("507f1f77bcf86cd799439011"));
        Assert.That(image.IdPropertyImage, Is.EqualTo(1));
        Assert.That(image.IdProperty, Is.EqualTo(1));
        Assert.That(image.File, Is.EqualTo("image.jpg"));
        Assert.That(image.Enabled, Is.True);
    }

    [Test]
    public void PropertyTrace_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var trace = new PropertyTrace();

        // Assert
        Assert.That(trace, Is.Not.Null);
        Assert.That(trace.Id, Is.Null);
        Assert.That(trace.IdPropertyTrace, Is.EqualTo(0));
        Assert.That(trace.DateSale, Is.EqualTo(default(DateTime)));
        Assert.That(trace.Name, Is.EqualTo(string.Empty));
        Assert.That(trace.Value, Is.EqualTo(0));
        Assert.That(trace.Tax, Is.EqualTo(0));
        Assert.That(trace.IdProperty, Is.EqualTo(0));
    }

    [Test]
    public void PropertyTrace_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var trace = new PropertyTrace();
        var saleDate = new DateTime(2023, 1, 15);

        // Act
        trace.Id = "507f1f77bcf86cd799439011";
        trace.IdPropertyTrace = 1;
        trace.DateSale = saleDate;
        trace.Name = "Initial Sale";
        trace.Value = 200000;
        trace.Tax = 10000;
        trace.IdProperty = 1;

        // Assert
        Assert.That(trace.Id, Is.EqualTo("507f1f77bcf86cd799439011"));
        Assert.That(trace.IdPropertyTrace, Is.EqualTo(1));
        Assert.That(trace.DateSale, Is.EqualTo(saleDate));
        Assert.That(trace.Name, Is.EqualTo("Initial Sale"));
        Assert.That(trace.Value, Is.EqualTo(200000));
        Assert.That(trace.Tax, Is.EqualTo(10000));
        Assert.That(trace.IdProperty, Is.EqualTo(1));
    }

    [Test]
    public void DatabaseSettings_DefaultConstructor_ShouldInitializeWithDefaults()
    {
        // Act
        var settings = new DatabaseSettings();

        // Assert
        Assert.That(settings, Is.Not.Null);
        Assert.That(settings.ConnectionString, Is.EqualTo(string.Empty));
        Assert.That(settings.DatabaseName, Is.EqualTo(string.Empty));
        Assert.That(settings.PropertiesCollectionName, Is.EqualTo("properties"));
        Assert.That(settings.OwnersCollectionName, Is.EqualTo("owners"));
        Assert.That(settings.PropertyImagesCollectionName, Is.EqualTo("property_images"));
        Assert.That(settings.PropertyTracesCollectionName, Is.EqualTo("property_traces"));
    }

    [Test]
    public void DatabaseSettings_SetProperties_ShouldSetValuesCorrectly()
    {
        // Arrange
        var settings = new DatabaseSettings();

        // Act
        settings.ConnectionString = "mongodb://localhost:27017";
        settings.DatabaseName = "MillionTestDb";
        settings.PropertiesCollectionName = "Properties";
        settings.OwnersCollectionName = "Owners";
        settings.PropertyImagesCollectionName = "PropertyImages";
        settings.PropertyTracesCollectionName = "PropertyTraces";

        // Assert
        Assert.That(settings.ConnectionString, Is.EqualTo("mongodb://localhost:27017"));
        Assert.That(settings.DatabaseName, Is.EqualTo("MillionTestDb"));
        Assert.That(settings.PropertiesCollectionName, Is.EqualTo("Properties"));
        Assert.That(settings.OwnersCollectionName, Is.EqualTo("Owners"));
        Assert.That(settings.PropertyImagesCollectionName, Is.EqualTo("PropertyImages"));
        Assert.That(settings.PropertyTracesCollectionName, Is.EqualTo("PropertyTraces"));
    }
}