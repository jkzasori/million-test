# Million Test API - Backend

A .NET Core 9 Web API for managing real estate properties with MongoDB integration.

## 🏗️ Architecture

This backend follows **Clean Architecture** principles with clear separation of concerns:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data orchestration
- **Models**: MongoDB data models with BSON attributes
- **DTOs**: Data transfer objects for API communication
- **Tests**: Unit tests for controllers and services

## 🚀 Features

- RESTful API with full CRUD operations
- Advanced filtering and pagination
- MongoDB integration with optimized queries
- Comprehensive unit testing
- Swagger/OpenAPI documentation
- CORS configuration for frontend integration
- Error handling with proper HTTP status codes

## 📁 Project Structure

```
backend/MillionTestApi/
├── Controllers/
│   └── PropertiesController.cs    # Property API endpoints
├── DTOs/
│   ├── PropertyDto.cs             # Property data transfer objects
│   ├── PropertyFilterDto.cs       # Filtering and pagination DTOs
│   ├── OwnerDto.cs               # Owner data transfer objects
│   ├── PropertyImageDto.cs        # Image data transfer objects
│   └── PropertyTraceDto.cs        # Transaction data transfer objects
├── Models/
│   ├── DatabaseSettings.cs        # MongoDB configuration model
│   ├── Owner.cs                   # Owner entity
│   ├── Property.cs                # Property entity
│   ├── PropertyImage.cs           # Property image entity
│   └── PropertyTrace.cs           # Transaction history entity
├── Services/
│   ├── IPropertyService.cs        # Property service interface
│   └── PropertyService.cs         # Property service implementation
├── Tests/
│   ├── PropertiesControllerTests.cs  # Controller unit tests
│   └── PropertyServiceTests.cs       # Service unit tests
├── Properties/
│   └── launchSettings.json        # Development server settings
├── appsettings.json               # Production configuration
├── appsettings.Development.json   # Development configuration
├── Program.cs                     # Application entry point
└── MillionTestApi.csproj         # Project file
```

## 🛠️ Dependencies

### NuGet Packages
```xml
<PackageReference Include="MongoDB.Driver" Version="3.5.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="7.1.0" />
<PackageReference Include="Microsoft.AspNetCore.Cors" Version="2.3.0" />
<PackageReference Include="NUnit" Version="4.4.0" />
<PackageReference Include="NUnit3TestAdapter" Version="5.1.0" />
<PackageReference Include="Moq" Version="4.20.72" />
<PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.14.1" />
```

## ⚙️ Configuration

### appsettings.json
```json
{
  "DatabaseSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "million_test",
    "OwnersCollectionName": "owners",
    "PropertiesCollectionName": "properties", 
    "PropertyImagesCollectionName": "property_images",
    "PropertyTracesCollectionName": "property_traces"
  },
  "AllowedHosts": "localhost;127.0.0.1;*.milliontest.com"
}
```

### appsettings.Development.json
```json
{
  "DatabaseSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "million_test_dev"
  },
  "AllowedHosts": "localhost;127.0.0.1;::1"
}
```

## 🔗 API Endpoints

### GET /api/properties
Get paginated and filtered list of properties.

**Query Parameters:**
- `name` (string): Filter by property name (partial match)
- `address` (string): Filter by address (partial match)  
- `minPrice` (decimal): Minimum price filter
- `maxPrice` (decimal): Maximum price filter
- `page` (int): Page number (default: 1)
- `pageSize` (int): Items per page (default: 10)

**Response:**
```json
{
  "properties": [
    {
      "idProperty": 1,
      "idOwner": 1,
      "name": "Luxury Villa",
      "address": "123 Main Street",
      "price": 750000,
      "image": "villa1.jpg",
      "ownerName": "John Smith",
      "codeInternal": "PROP001",
      "year": 2020
    }
  ],
  "totalCount": 25,
  "page": 1,
  "pageSize": 10,
  "totalPages": 3
}
```

### GET /api/properties/{id}
Get detailed property information by ID.

**Response:**
```json
{
  "idProperty": 1,
  "idOwner": 1,
  "name": "Luxury Villa",
  "address": "123 Main Street", 
  "price": 750000,
  "codeInternal": "PROP001",
  "year": 2020,
  "owner": {
    "idOwner": 1,
    "name": "John Smith",
    "address": "456 Owner St",
    "birthday": "1980-01-15T00:00:00Z"
  },
  "images": [
    {
      "idPropertyImage": 1,
      "idProperty": 1,
      "file": "villa1_main.jpg",
      "enabled": true
    }
  ],
  "traces": [
    {
      "idPropertyTrace": 1,
      "dateSale": "2023-01-15T00:00:00Z",
      "name": "Initial Purchase",
      "value": 700000,
      "tax": 35000,
      "idProperty": 1
    }
  ]
}
```

### POST /api/properties
Create a new property.

**Request Body:**
```json
{
  "idProperty": 1,
  "idOwner": 1,
  "name": "New Property",
  "address": "789 New Street",
  "price": 500000,
  "codeInternal": "PROP002",
  "year": 2023
}
```

### PUT /api/properties/{id}
Update an existing property.

### DELETE /api/properties/{id}
Delete a property by ID.

## 🧪 Testing

### Run All Tests
```bash
dotnet test
```

### Run Specific Test Class
```bash
dotnet test --filter PropertiesControllerTests
dotnet test --filter PropertyServiceTests
```

### Test Coverage
The test suite includes:
- **Controller Tests**: HTTP endpoint behavior, status codes, response formatting
- **Service Tests**: Business logic, data validation, error handling
- **Mock Dependencies**: MongoDB collections mocked for isolated testing

### Example Test
```csharp
[Test]
public async Task GetProperties_WithValidFilters_ShouldReturnOkResult()
{
    // Arrange
    var expectedResponse = new PropertyListResponseDto { /* ... */ };
    _mockPropertyService.Setup(s => s.GetPropertiesAsync(It.IsAny<PropertyFilterDto>()))
                       .ReturnsAsync(expectedResponse);

    // Act
    var result = await _controller.GetProperties("Test", "Address", 50000, 150000, 1, 10);

    // Assert
    Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
    // Additional assertions...
}
```

## 💾 Database Models

### Owner Model
```csharp
public class Owner
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonElement("idOwner")]
    public int IdOwner { get; set; }
    
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;
    
    // Additional properties...
}
```

### Property Model
```csharp
public class Property
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonElement("idProperty")]
    public int IdProperty { get; set; }
    
    // Additional properties with proper BSON mapping...
}
```

## 🔒 Security Features

### CORS Policy
- Development: `localhost`, `127.0.0.1`, `::1`
- Production: Specific domain allowlist

### Input Validation
- Model validation attributes
- Custom validation in services
- Proper error handling and status codes

### Data Protection
- No sensitive data in DTOs
- Secure connection strings in configuration
- Environment-specific settings

## 📊 Performance Optimizations

### MongoDB Optimizations
- Indexed queries for common search patterns
- Aggregation pipelines for complex queries  
- Connection pooling via MongoDB driver
- Async/await throughout for non-blocking operations

### API Optimizations
- Pagination to limit response sizes
- Selective field projection in DTOs
- Efficient filtering at database level
- Response caching headers

## 🐛 Error Handling

### Global Exception Handling
```csharp
public class ExceptionMiddleware
{
    // Catches unhandled exceptions
    // Returns standardized error responses
    // Logs errors for debugging
}
```

### API Error Responses
```json
{
  "message": "Internal server error",
  "error": "Detailed error message for debugging"
}
```

## 🚀 Deployment

### Build for Production
```bash
dotnet publish -c Release -o ./publish
```

### Docker Support (Optional)
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY ./publish .
ENTRYPOINT ["dotnet", "MillionTestApi.dll"]
```

### Environment Variables
- `ASPNETCORE_ENVIRONMENT`: Set to `Production`
- `ConnectionStrings__DefaultConnection`: MongoDB connection string
- Update CORS policy for production domains

## 📚 Additional Resources

- [.NET Core Documentation](https://docs.microsoft.com/dotnet/core/)
- [MongoDB .NET Driver](https://docs.mongodb.com/drivers/csharp/)
- [ASP.NET Core Web API](https://docs.microsoft.com/aspnet/core/web-api/)
- [NUnit Testing Framework](https://nunit.org/)