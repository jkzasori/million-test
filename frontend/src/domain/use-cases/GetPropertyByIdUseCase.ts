import { PropertyRepository } from '../repositories/PropertyRepository';
import { Property } from '../entities/Property';

export interface GetPropertyByIdUseCaseInput {
  id: number;
}

export class GetPropertyByIdUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(input: GetPropertyByIdUseCaseInput): Promise<Property> {
    const { id } = input;
    
    if (!id || id <= 0) {
      throw new Error('Property ID must be a positive number');
    }

    return this.propertyRepository.getPropertyById(id);
  }
}