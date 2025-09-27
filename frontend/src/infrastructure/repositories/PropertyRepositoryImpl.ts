import { PropertyRepository } from '../../domain/repositories/PropertyRepository';
import { Property, PropertyFilters, PaginatedPropertyResult } from '../../domain/entities/Property';
import { PropertyApiClient } from '../api/PropertyApiClient';
import { PropertyMapper } from '../mappers/PropertyMapper';
import { PropertyFilterDto } from '../../types/property';

export class PropertyRepositoryImpl implements PropertyRepository {
  constructor(private readonly apiClient: PropertyApiClient) {}

  async getProperties(
    page: number,
    size: number,
    filters?: PropertyFilters
  ): Promise<PaginatedPropertyResult> {
    const filterDto: PropertyFilterDto = {
      page,
      pageSize: size,
      name: filters?.name,
      address: filters?.address,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
    };

    const response = await this.apiClient.getProperties(filterDto);
    return PropertyMapper.paginatedResultToDomain(response);
  }

  async getPropertyById(id: number): Promise<Property> {
    const response = await this.apiClient.getPropertyById(id);
    return PropertyMapper.toDomain(response);
  }

  async searchProperties(
    query: string,
    page: number,
    size: number
  ): Promise<PaginatedPropertyResult> {
    // Implement search by name or address
    const filterDto: PropertyFilterDto = {
      page,
      pageSize: size,
      name: query, // Search in name field primarily
    };

    const response = await this.apiClient.getProperties(filterDto);
    return PropertyMapper.paginatedResultToDomain(response);
  }
}