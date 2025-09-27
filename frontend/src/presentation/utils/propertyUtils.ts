import { Property as DomainProperty } from '@/domain/entities/Property';
import { Property as UIProperty } from '@/presentation/components/luxury/LuxuryPropertyCard';

/**
 * Utility functions for property data transformations and operations
 */
export class PropertyUtils {
  private static readonly DEFAULT_IMAGE = '/placeholder-property.jpg';
  private static readonly DEFAULT_OWNER = 'Private Owner';

  /**
   * Transforms domain property entities to UI component properties
   * @param domainProperties - Array of domain property entities
   * @returns Array of UI property objects
   */
  static transformToUIProperties(domainProperties: DomainProperty[]): UIProperty[] {
    if (!Array.isArray(domainProperties)) {
      console.warn('Invalid properties array provided to transformToUIProperties');
      return [];
    }

    return domainProperties.map(this.transformSingleProperty);
  }

  /**
   * Transforms a single domain property to UI property
   * @param property - Domain property entity
   * @returns UI property object
   */
  private static transformSingleProperty(property: DomainProperty): UIProperty {
    return {
      idProperty: property.idProperty,
      name: property.name || 'Unnamed Property',
      address: property.address || 'Address not provided',
      price: property.price || 0,
      image: property.mainImageUrl || this.DEFAULT_IMAGE,
      ownerName: property.ownerName || this.DEFAULT_OWNER,
      codeInternal: property.codeInternal || '',
      year: property.year || new Date().getFullYear()
    };
  }

  /**
   * Formats property price with currency and thousand separators
   * @param price - Property price as number
   * @param currency - Currency symbol (default: '$')
   * @returns Formatted price string
   */
  static formatPrice(price: number, currency: string = '$'): string {
    if (typeof price !== 'number' || isNaN(price)) {
      return 'Price not available';
    }

    if (price === 0) {
      return 'Contact for price';
    }

    return `${currency}${price.toLocaleString()}`;
  }

  /**
   * Generates a user-friendly property description
   * @param property - UI property object
   * @returns Formatted property description
   */
  static generatePropertyDescription(property: UIProperty): string {
    const parts: string[] = [];

    if (property.year) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - property.year;
      if (age === 0) {
        parts.push('Brand new');
      } else if (age <= 5) {
        parts.push('Recent construction');
      } else if (age <= 10) {
        parts.push('Modern property');
      }
    }

    parts.push(`Listed by ${property.ownerName}`);

    return parts.join(' • ');
  }

  /**
   * Validates property data completeness
   * @param property - Property to validate
   * @returns Validation result with errors if any
   */
  static validateProperty(property: Partial<UIProperty>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!property.name?.trim()) {
      errors.push('Property name is required');
    }

    if (!property.address?.trim()) {
      errors.push('Property address is required');
    }

    if (typeof property.price !== 'number' || property.price < 0) {
      errors.push('Valid property price is required');
    }

    if (!property.codeInternal?.trim()) {
      errors.push('Internal code is required');
    }

    if (property.year && (property.year < 1800 || property.year > new Date().getFullYear() + 10)) {
      errors.push('Property year must be realistic');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sorts properties by various criteria
   * @param properties - Array of properties to sort
   * @param criteria - Sorting criteria
   * @param direction - Sort direction
   * @returns Sorted properties array
   */
  static sortProperties(
    properties: UIProperty[], 
    criteria: 'price' | 'name' | 'year',
    direction: 'asc' | 'desc' = 'asc'
  ): UIProperty[] {
    const sortedProperties = [...properties];
    const multiplier = direction === 'asc' ? 1 : -1;

    return sortedProperties.sort((a, b) => {
      switch (criteria) {
        case 'price':
          return (a.price - b.price) * multiplier;
        case 'name':
          return a.name.localeCompare(b.name) * multiplier;
        case 'year':
          return (a.year - b.year) * multiplier;
        default:
          return 0;
      }
    });
  }

  /**
   * Filters properties by search term
   * @param properties - Array of properties to search
   * @param searchTerm - Search term to filter by
   * @returns Filtered properties array
   */
  static searchProperties(properties: UIProperty[], searchTerm: string): UIProperty[] {
    if (!searchTerm?.trim()) {
      return properties;
    }

    const term = searchTerm.toLowerCase().trim();

    return properties.filter(property => 
      property.name.toLowerCase().includes(term) ||
      property.address.toLowerCase().includes(term) ||
      property.ownerName.toLowerCase().includes(term) ||
      property.codeInternal.toLowerCase().includes(term)
    );
  }

  /**
   * Creates pagination information object
   * @param totalCount - Total number of items
   * @param currentPage - Current page number
   * @param pageSize - Items per page
   * @returns Pagination information
   */
  static createPaginationInfo(totalCount: number, currentPage: number, pageSize: number) {
    const totalPages = Math.ceil(totalCount / pageSize);
    
    return {
      totalCount,
      page: currentPage,
      pageSize,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex: (currentPage - 1) * pageSize + 1,
      endIndex: Math.min(currentPage * pageSize, totalCount)
    };
  }
}