import { FilterState } from '@/presentation/components/luxury/FilterBar';
import { PropertyFilters } from '@/domain/entities/Property';

/**
 * Utility functions for handling property filters
 */
export class FilterUtils {
  /**
   * Converts FilterState from UI components to domain PropertyFilters
   * @param filterState - The filter state from UI components
   * @returns PropertyFilters object for domain use cases
   */
  static toDomainFilters(filterState: FilterState): PropertyFilters {
    const filters: PropertyFilters = {};

    if (filterState.search?.trim()) {
      filters.name = filterState.search.trim();
    }

    if (filterState.address?.trim()) {
      filters.address = filterState.address.trim();
    }

    if (filterState.minPrice?.trim()) {
      const minPrice = parseInt(filterState.minPrice.trim());
      if (!isNaN(minPrice) && minPrice > 0) {
        filters.minPrice = minPrice;
      }
    }

    if (filterState.maxPrice?.trim()) {
      const maxPrice = parseInt(filterState.maxPrice.trim());
      if (!isNaN(maxPrice) && maxPrice > 0) {
        filters.maxPrice = maxPrice;
      }
    }

    return filters;
  }

  /**
   * Validates filter values to ensure they are within acceptable ranges
   * @param filters - PropertyFilters to validate
   * @returns Array of validation error messages, empty if valid
   */
  static validateFilters(filters: PropertyFilters): string[] {
    const errors: string[] = [];

    if (filters.minPrice !== undefined && filters.minPrice < 0) {
      errors.push('Minimum price cannot be negative');
    }

    if (filters.maxPrice !== undefined && filters.maxPrice < 0) {
      errors.push('Maximum price cannot be negative');
    }

    if (
      filters.minPrice !== undefined && 
      filters.maxPrice !== undefined && 
      filters.minPrice > filters.maxPrice
    ) {
      errors.push('Minimum price cannot be greater than maximum price');
    }

    return errors;
  }

  /**
   * Creates a clean filter state with validated values
   * @param filterState - Raw filter state from UI
   * @returns Cleaned and validated PropertyFilters
   */
  static createCleanFilters(filterState: FilterState): PropertyFilters {
    const domainFilters = this.toDomainFilters(filterState);
    const validationErrors = this.validateFilters(domainFilters);

    if (validationErrors.length > 0) {
      console.warn('Filter validation warnings:', validationErrors);
      // Remove invalid filters instead of throwing errors
      if (domainFilters.minPrice !== undefined && domainFilters.minPrice < 0) {
        delete domainFilters.minPrice;
      }
      if (domainFilters.maxPrice !== undefined && domainFilters.maxPrice < 0) {
        delete domainFilters.maxPrice;
      }
      if (
        domainFilters.minPrice !== undefined && 
        domainFilters.maxPrice !== undefined && 
        domainFilters.minPrice > domainFilters.maxPrice
      ) {
        delete domainFilters.maxPrice;
      }
    }

    return domainFilters;
  }

  /**
   * Checks if any meaningful filters are applied
   * @param filters - PropertyFilters to check
   * @returns true if filters are applied, false otherwise
   */
  static hasActiveFilters(filters: PropertyFilters): boolean {
    return !!(
      filters.name ||
      filters.address ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
    );
  }

  /**
   * Creates a display-friendly string representation of active filters
   * @param filters - PropertyFilters to describe
   * @returns Human-readable filter description
   */
  static getFilterDescription(filters: PropertyFilters): string {
    const descriptions: string[] = [];

    if (filters.name) {
      descriptions.push(`name contains "${filters.name}"`);
    }

    if (filters.address) {
      descriptions.push(`address contains "${filters.address}"`);
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      descriptions.push(`price between $${filters.minPrice.toLocaleString()} - $${filters.maxPrice.toLocaleString()}`);
    } else if (filters.minPrice !== undefined) {
      descriptions.push(`price from $${filters.minPrice.toLocaleString()}`);
    } else if (filters.maxPrice !== undefined) {
      descriptions.push(`price up to $${filters.maxPrice.toLocaleString()}`);
    }

    return descriptions.length > 0 
      ? `Filtered by: ${descriptions.join(', ')}` 
      : 'No filters applied';
  }
}