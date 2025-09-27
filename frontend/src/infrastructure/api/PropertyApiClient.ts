import { PropertyDetailDto, PropertyFilterDto, PropertyListResponseDto } from '../../types/property';

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

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
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new ApiError(error.message || `HTTP ${response.status}`, response.status);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      
      throw new ApiError('Network error', 0);
    }
  }
}