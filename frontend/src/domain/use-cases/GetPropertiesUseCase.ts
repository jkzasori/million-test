import { PropertyRepository } from '../repositories/PropertyRepository';
import { PropertyFilters, PaginatedPropertyResult } from '../entities/Property';

export interface GetPropertiesUseCaseInput {
  page: number;
  size: number;
  filters?: PropertyFilters;
}

export class GetPropertiesUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(input: GetPropertiesUseCaseInput): Promise<PaginatedPropertyResult> {
    const { page, size, filters } = input;
    
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    
    if (size < 1 || size > 100) {
      throw new Error('Size must be between 1 and 100');
    }

    return this.propertyRepository.getProperties(page, size, filters);
  }
}