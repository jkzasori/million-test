import { GetPropertiesUseCase, GetPropertiesUseCaseInput } from '../../domain/use-cases/GetPropertiesUseCase';
import { GetPropertyByIdUseCase, GetPropertyByIdUseCaseInput } from '../../domain/use-cases/GetPropertyByIdUseCase';
import { Property, PropertyFilters, PaginatedPropertyResult } from '../../domain/entities/Property';

export class PropertyService {
  constructor(
    private readonly getPropertiesUseCase: GetPropertiesUseCase,
    private readonly getPropertyByIdUseCase: GetPropertyByIdUseCase
  ) {}

  async getProperties(
    page: number = 1,
    size: number = 10,
    filters?: PropertyFilters
  ): Promise<PaginatedPropertyResult> {
    const input: GetPropertiesUseCaseInput = {
      page,
      size,
      filters,
    };

    return this.getPropertiesUseCase.execute(input);
  }

  async getPropertyById(id: number): Promise<Property> {
    const input: GetPropertyByIdUseCaseInput = { id };
    return this.getPropertyByIdUseCase.execute(input);
  }

  async searchProperties(
    query: string,
    page: number = 1,
    size: number = 10
  ): Promise<PaginatedPropertyResult> {
    if (!query || query.trim().length === 0) {
      return this.getProperties(page, size);
    }

    const filters: PropertyFilters = {
      name: query.trim(),
    };

    return this.getProperties(page, size, filters);
  }
}