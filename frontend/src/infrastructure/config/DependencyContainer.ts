import { PropertyApiClient, ApiClientConfig } from '../api/PropertyApiClient';
import { PropertyRepositoryImpl } from '../repositories/PropertyRepositoryImpl';
import { GetPropertiesUseCase } from '../../domain/use-cases/GetPropertiesUseCase';
import { GetPropertyByIdUseCase } from '../../domain/use-cases/GetPropertyByIdUseCase';
import { PropertyService } from '../../application/services/PropertyService';

export class DependencyContainer {
  private static instance: DependencyContainer;
  private _propertyService: PropertyService | null = null;

  private constructor() {}

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  getPropertyService(): PropertyService {
    if (!this._propertyService) {
      // Configuration
      const apiConfig: ApiClientConfig = {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
        timeout: 10000,
      };

      // Infrastructure Layer
      const apiClient = new PropertyApiClient(apiConfig);
      const propertyRepository = new PropertyRepositoryImpl(apiClient);

      // Domain Layer (Use Cases)
      const getPropertiesUseCase = new GetPropertiesUseCase(propertyRepository);
      const getPropertyByIdUseCase = new GetPropertyByIdUseCase(propertyRepository);

      // Application Layer
      this._propertyService = new PropertyService(
        getPropertiesUseCase,
        getPropertyByIdUseCase
      );
    }

    return this._propertyService;
  }

  // Method to reset instance (useful for testing)
  static reset(): void {
    DependencyContainer.instance = null as unknown as DependencyContainer;
  }
}