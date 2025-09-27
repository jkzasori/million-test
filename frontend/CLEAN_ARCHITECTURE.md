# Clean Architecture - Frontend

This frontend follows Clean Architecture principles to ensure maintainability, testability, and scalability.

## Architecture Layers

### 1. Domain Layer (`src/domain/`)
Contains the business logic and rules. This layer is independent of any external concerns.

#### Entities (`domain/entities/`)
- `Property.ts` - Core business entities and value objects
- Represents the business data and rules

#### Repositories (`domain/repositories/`)
- `PropertyRepository.ts` - Abstract interfaces for data access
- Defines contracts without implementation details

#### Use Cases (`domain/use-cases/`)
- `GetPropertiesUseCase.ts` - Business logic for fetching properties
- `GetPropertyByIdUseCase.ts` - Business logic for fetching single property
- Contains business rules and validation

### 2. Application Layer (`src/application/`)
Orchestrates the use cases and coordinates application workflows.

#### Services (`application/services/`)
- `PropertyService.ts` - Application services that orchestrate use cases
- Handles application-specific logic and coordination

### 3. Infrastructure Layer (`src/infrastructure/`)
Contains implementation details for external concerns.

#### API (`infrastructure/api/`)
- `PropertyApiClient.ts` - HTTP client implementation
- Handles API communication and error handling

#### Repositories (`infrastructure/repositories/`)
- `PropertyRepositoryImpl.ts` - Concrete implementation of repository interfaces
- Implements data access using the API client

#### Mappers (`infrastructure/mappers/`)
- `PropertyMapper.ts` - Maps between DTOs and domain entities
- Handles data transformation between layers

#### Config (`infrastructure/config/`)
- `DependencyContainer.ts` - Dependency injection container
- Manages object creation and dependencies

### 4. Presentation Layer (`src/presentation/`)
Contains UI components and presentation logic.

#### Components (`presentation/components/`)
- UI components moved from `src/components/`
- React components that display data and handle user interactions

#### Hooks (`presentation/hooks/`)
- `useProperties.ts` - Custom hook for property listing
- `useProperty.ts` - Custom hook for single property
- Encapsulates presentation logic and state management

#### Pages (`presentation/pages/`)
- Page components that compose the application

## Data Flow

1. **User Interaction** → Presentation Layer (Components/Hooks)
2. **Presentation Layer** → Application Layer (Services)
3. **Application Layer** → Domain Layer (Use Cases)
4. **Use Cases** → Domain Repositories (Interfaces)
5. **Repository Interfaces** → Infrastructure Layer (Repository Implementations)
6. **Repository Implementations** → Infrastructure Layer (API Clients)
7. **API Clients** → External API

## Key Benefits

### 1. **Testability**
- Each layer can be tested in isolation
- Use cases contain pure business logic
- Infrastructure can be mocked easily

### 2. **Maintainability**
- Clear separation of concerns
- Changes in one layer don't affect others
- Easy to understand and modify

### 3. **Scalability**
- Easy to add new features
- Can swap implementations without changing business logic
- Supports multiple data sources

### 4. **Independence**
- Domain layer doesn't depend on external frameworks
- Business logic is framework-agnostic
- Easy to migrate to different technologies

## Dependency Rule

Dependencies point inward:
- **Presentation** depends on **Application** and **Domain**
- **Application** depends on **Domain**
- **Infrastructure** depends on **Domain** (through interfaces)
- **Domain** depends on nothing (pure business logic)

## Usage Examples

### Using the Property Hook
```typescript
const { properties, loading, error, loadProperties } = useProperties(1, 12);

// Load properties with filters
const filters: PropertyFilters = { name: 'luxury', minPrice: 100000 };
loadProperties(1, 12, filters);
```

### Using the Dependency Container
```typescript
const container = DependencyContainer.getInstance();
const propertyService = container.getPropertyService();
```

### Creating New Use Cases
1. Define interface in `domain/repositories/`
2. Create use case in `domain/use-cases/`
3. Implement repository in `infrastructure/repositories/`
4. Add to dependency container
5. Create hook in `presentation/hooks/`

## Migration Notes

The following files have been restructured:
- Components moved to `presentation/components/`
- Business logic extracted to domain layer
- API logic moved to infrastructure layer
- React state management replaced with custom hooks
- Direct API calls replaced with use cases

## Future Enhancements

- Add validation using domain entities
- Implement caching in infrastructure layer
- Add error boundary in presentation layer
- Create integration tests for use cases
- Add TypeScript strict mode compliance