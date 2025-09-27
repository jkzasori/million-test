import { Property, PropertyFilters, PaginatedPropertyResult } from '../entities/Property';

export interface PropertyRepository {
  getProperties(
    page: number,
    size: number,
    filters?: PropertyFilters
  ): Promise<PaginatedPropertyResult>;

  getPropertyById(id: number): Promise<Property>;

  searchProperties(
    query: string,
    page: number,
    size: number
  ): Promise<PaginatedPropertyResult>;
}