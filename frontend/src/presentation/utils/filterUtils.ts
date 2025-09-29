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
    return {
      ...(filterState.search?.trim() && { name: filterState.search.trim() }),
      ...(filterState.address?.trim() && { address: filterState.address.trim() }),
      ...(filterState.minPrice?.trim() && !isNaN(parseInt(filterState.minPrice.trim())) && parseInt(filterState.minPrice.trim()) > 0 && { minPrice: parseInt(filterState.minPrice.trim()) }),
      ...(filterState.maxPrice?.trim() && !isNaN(parseInt(filterState.maxPrice.trim())) && parseInt(filterState.maxPrice.trim()) > 0 && { maxPrice: parseInt(filterState.maxPrice.trim()) })
    };
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
      // Create new object without invalid filters
      return {
        ...(domainFilters.name && { name: domainFilters.name }),
        ...(domainFilters.address && { address: domainFilters.address }),
        ...(domainFilters.minPrice !== undefined && domainFilters.minPrice >= 0 && { minPrice: domainFilters.minPrice }),
        ...(domainFilters.maxPrice !== undefined && domainFilters.maxPrice >= 0 && 
            (domainFilters.minPrice === undefined || domainFilters.maxPrice >= domainFilters.minPrice) && 
            { maxPrice: domainFilters.maxPrice })
      };
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