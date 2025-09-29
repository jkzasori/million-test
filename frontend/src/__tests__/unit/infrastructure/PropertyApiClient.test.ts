import { PropertyApiClient } from '@/infrastructure/api/PropertyApiClient';
import { PropertyFilterDto } from '@/types/property';
import { 
  NetworkError, 
  ServerError, 
  TimeoutError, 
  NotFoundError,
  ValidationError 
} from '@/domain/errors/DomainErrors';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('PropertyApiClient', () => {
  let apiClient: PropertyApiClient;
  const baseUrl = 'http://localhost:5001';

  beforeEach(() => {
    apiClient = new PropertyApiClient({ 
      baseUrl,
      timeout: 5001 
    });
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProperties', () => {
    it('should fetch properties successfully', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            idProperty: 1,
            name: 'Test Property',
            address: 'Test Address',
            price: 100000,
            codeInternal: 'TEST001',
            year: 2020,
            idOwner: 1
          }
        ],
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const filters: PropertyFilterDto = {
        page: 1,
        pageSize: 10
      };

      // Act
      const result = await apiClient.getProperties(filters);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/properties?page=1&pageSize=10`,
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
          signal: expect.any(AbortSignal),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch properties with filters', async () => {
      // Arrange
      const mockResponse = {
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const filters: PropertyFilterDto = {
        page: 1,
        pageSize: 10,
        name: 'Villa',
        minPrice: 100000,
        maxPrice: 500000,
        address: 'Test Street'
      };

      // Act
      const result = await apiClient.getProperties(filters);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`${baseUrl}/api/properties`),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
          signal: expect.any(AbortSignal),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle 404 error', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      });

      const filters: PropertyFilterDto = {
        page: 1,
        pageSize: 10
      };

      // Act & Assert
      await expect(apiClient.getProperties(filters)).rejects.toThrow(NotFoundError);
    });

    it('should handle 500 server error', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      const filters: PropertyFilterDto = {
        page: 1,
        pageSize: 10
      };

      // Act & Assert
      await expect(apiClient.getProperties(filters)).rejects.toThrow(ServerError);
    });

    it('should handle network error', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const filters: PropertyFilterDto = {
        page: 1,
        pageSize: 10
      };

      // Act & Assert
      await expect(apiClient.getProperties(filters)).rejects.toThrow(NetworkError);
    });

    it('should handle timeout error', async () => {
      // Arrange
      const abortError = new Error('Abort');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(abortError);

      const filters: PropertyFilterDto = {
        page: 1,
        pageSize: 10
      };

      // Act & Assert
      await expect(apiClient.getProperties(filters)).rejects.toThrow(TimeoutError);
    });
  });

  describe('getPropertyById', () => {
    it('should fetch property by id successfully', async () => {
      // Arrange
      const propertyId = 1;
      const mockResponse = {
        idProperty: 1,
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      // Act
      const result = await apiClient.getPropertyById(propertyId);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/properties/${propertyId}`,
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
          signal: expect.any(AbortSignal),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle property not found', async () => {
      // Arrange
      const propertyId = 999;
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Property not found' }),
      });

      // Act & Assert
      await expect(apiClient.getPropertyById(propertyId)).rejects.toThrow(NotFoundError);
    });

    it('should handle server error when fetching property', async () => {
      // Arrange
      const propertyId = 1;
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      // Act & Assert
      await expect(apiClient.getPropertyById(propertyId)).rejects.toThrow(ServerError);
    });
  });


  describe('error handling', () => {
    it('should throw ValidationError for 400 status', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad request' }),
      });

      // Act & Assert
      await expect(apiClient.getPropertyById(1)).rejects.toThrow(ValidationError);
    });

    it('should throw appropriate error for different status codes', async () => {
      // Test various status codes
      const testCases = [
        { status: 400, expectedError: ValidationError },
        { status: 404, expectedError: NotFoundError },
        { status: 500, expectedError: ServerError },
        { status: 503, expectedError: ServerError },
      ];

      for (const testCase of testCases) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: testCase.status,
          json: async () => ({ error: 'Test error' }),
        });

        await expect(apiClient.getPropertyById(1)).rejects.toThrow(testCase.expectedError);
      }
    });
  });

  describe('timeout handling', () => {
    it('should set timeout for requests', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      // Act
      await apiClient.getPropertyById(1);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });
  });
});