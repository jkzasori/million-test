import { PropertyDto, PropertyDetailDto, PropertyFilterDto, PropertyListResponseDto } from '@/types/property';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(error.message || `HTTP ${response.status}`, response.status);
  }

  return response.json();
}

export const propertyService = {
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
    
    return fetchApi<PropertyListResponseDto>(endpoint);
  },

  async getProperty(id: number): Promise<PropertyDetailDto> {
    return fetchApi<PropertyDetailDto>(`/api/properties/${id}`);
  },

  async createProperty(property: Omit<PropertyDto, 'idProperty'>): Promise<PropertyDto> {
    return fetchApi<PropertyDto>('/api/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  },

  async updateProperty(id: number, property: PropertyDto): Promise<PropertyDto> {
    return fetchApi<PropertyDto>(`/api/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(property),
    });
  },

  async deleteProperty(id: number): Promise<void> {
    await fetchApi<void>(`/api/properties/${id}`, {
      method: 'DELETE',
    });
  },
};

export { ApiError };