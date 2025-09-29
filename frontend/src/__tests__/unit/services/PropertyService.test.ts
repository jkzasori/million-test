import { PropertyService } from '@/application/services/PropertyService';
import { GetPropertiesUseCase } from '@/domain/use-cases/GetPropertiesUseCase';
import { GetPropertyByIdUseCase } from '@/domain/use-cases/GetPropertyByIdUseCase';
import { Property, PropertyFilters, PaginatedPropertyResult } from '@/domain/entities/Property';

// Mock use cases
jest.mock('@/domain/use-cases/GetPropertiesUseCase');
jest.mock('@/domain/use-cases/GetPropertyByIdUseCase');

describe('PropertyService', () => {
  let propertyService: PropertyService;
  let mockGetPropertiesUseCase: jest.Mocked<GetPropertiesUseCase>;
  let mockGetPropertyByIdUseCase: jest.Mocked<GetPropertyByIdUseCase>;

  const mockProperty: Property = {
    idProperty: 1,
    idOwner: 1,
    name: 'Test Property',
    address: 'Test Address',
    price: 100000,
    codeInternal: 'TEST001',
    year: 2020,
    owner: {
      idOwner: 1,
      name: 'Test Owner',
      address: 'Owner Address',
      photo: 'https://example.com/photo.jpg'
    },
    images: [],
    traces: []
  };

  beforeEach(() => {
    // Create mocked instances using jest.fn() instead of new constructor
    mockGetPropertiesUseCase = {
      execute: jest.fn(),
      propertyRepository: {} as any,
    } as unknown as jest.Mocked<GetPropertiesUseCase>;
    
    mockGetPropertyByIdUseCase = {
      execute: jest.fn(),
      propertyRepository: {} as any,
    } as unknown as jest.Mocked<GetPropertyByIdUseCase>;
    
    propertyService = new PropertyService(
      mockGetPropertiesUseCase,
      mockGetPropertyByIdUseCase
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProperties', () => {
    it('should return paginated properties with default parameters', async () => {
      // Arrange
      const expectedResult: PaginatedPropertyResult = {
        properties: [mockProperty],
        totalCount: 1,
        page: 1,
        size: 10,
        totalPages: 1
      };

      mockGetPropertiesUseCase.execute.mockResolvedValue(expectedResult);

      // Act
      const result = await propertyService.getProperties();

      // Assert
      expect(mockGetPropertiesUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        size: 10,
        filters: undefined
      });
      expect(result).toEqual(expectedResult);
    });

    it('should return paginated properties with custom parameters', async () => {
      // Arrange
      const page = 2;
      const size = 5;
      const filters: PropertyFilters = {
        name: 'Test',
        minPrice: 50000,
        maxPrice: 200000
      };

      const expectedResult: PaginatedPropertyResult = {
        properties: [mockProperty],
        totalCount: 1,
        page: 2,
        size: 5,
        totalPages: 1
      };

      mockGetPropertiesUseCase.execute.mockResolvedValue(expectedResult);

      // Act
      const result = await propertyService.getProperties(page, size, filters);

      // Assert
      expect(mockGetPropertiesUseCase.execute).toHaveBeenCalledWith({
        page,
        size,
        filters
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle use case errors', async () => {
      // Arrange
      const errorMessage = 'Failed to fetch properties';
      mockGetPropertiesUseCase.execute.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(propertyService.getProperties()).rejects.toThrow(errorMessage);
    });
  });

  describe('getPropertyById', () => {
    it('should return property when found', async () => {
      // Arrange
      const propertyId = 1;
      mockGetPropertyByIdUseCase.execute.mockResolvedValue(mockProperty);

      // Act
      const result = await propertyService.getPropertyById(propertyId);

      // Assert
      expect(mockGetPropertyByIdUseCase.execute).toHaveBeenCalledWith({
        id: propertyId
      });
      expect(result).toEqual(mockProperty);
    });

    it('should return null when property not found', async () => {
      // Arrange
      const propertyId = 999;
      mockGetPropertyByIdUseCase.execute.mockResolvedValue(null as any);

      // Act
      const result = await propertyService.getPropertyById(propertyId);

      // Assert
      expect(mockGetPropertyByIdUseCase.execute).toHaveBeenCalledWith({
        id: propertyId
      });
      expect(result).toBeNull();
    });

    it('should handle use case errors', async () => {
      // Arrange
      const propertyId = 1;
      const errorMessage = 'Failed to fetch property';
      mockGetPropertyByIdUseCase.execute.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(propertyService.getPropertyById(propertyId)).rejects.toThrow(errorMessage);
    });
  });

  describe('parameter validation', () => {
    it('should pass page as provided even when less than 1', async () => {
      // Arrange
      const expectedResult: PaginatedPropertyResult = {
        properties: [],
        totalCount: 0,
        page: 1,
        size: 10,
        totalPages: 0
      };

      mockGetPropertiesUseCase.execute.mockResolvedValue(expectedResult);

      // Act
      await propertyService.getProperties(0);

      // Assert
      expect(mockGetPropertiesUseCase.execute).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        filters: undefined
      });
    });

    it('should pass size as provided even when less than 1', async () => {
      // Arrange
      const expectedResult: PaginatedPropertyResult = {
        properties: [],
        totalCount: 0,
        page: 1,
        size: 10,
        totalPages: 0
      };

      mockGetPropertiesUseCase.execute.mockResolvedValue(expectedResult);

      // Act
      await propertyService.getProperties(1, 0);

      // Assert
      expect(mockGetPropertiesUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        size: 0,
        filters: undefined
      });
    });
  });
});