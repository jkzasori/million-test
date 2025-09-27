import { PropertyDetailDto, PropertyFilterDto, PropertyListResponseDto } from '../../types/property';
import { 
  NetworkError, 
  ServerError, 
  TimeoutError, 
  NotFoundError,
  ValidationError 
} from '../../domain/errors/DomainErrors';

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
}

export class PropertyApiClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 10000;
  }

  async getProperties(filter: PropertyFilterDto = {}): Promise<PropertyListResponseDto> {
    const params = new URLSearchParams();
    
    if (filter.name) params.append('name', filter.name);
    if (filter.address) params.append('address', filter.address);
    if (filter.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString());
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const queryString = params.toString();
    const endpoint = `/api/properties${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchApi<PropertyListResponseDto>(endpoint);
  }

  async getPropertyById(id: number): Promise<PropertyDetailDto> {
    return this.fetchApi<PropertyDetailDto>(`/api/properties/${id}`);
  }

  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        const errorMessage = errorData.message || `HTTP ${response.status}`;
        
        switch (response.status) {
          case 400:
            throw new ValidationError(errorMessage);
          case 404:
            throw new NotFoundError('Resource', endpoint);
          case 408:
            throw new TimeoutError(errorMessage);
          case 500:
          case 502:
          case 503:
          case 504:
            throw new ServerError(errorMessage, response.status);
          default:
            throw new ServerError(errorMessage, response.status);
        }
      }

      return response.json();
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      
      // Re-throw domain errors
      if (error instanceof ValidationError || 
          error instanceof NotFoundError || 
          error instanceof TimeoutError || 
          error instanceof ServerError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError('Request timeout');
      }
      
      throw new NetworkError('Network connection failed');
    }
  }
}