import { PropertyUtils } from '@/presentation/utils/propertyUtils';
import { PropertyListItem as DomainProperty } from '@/domain/entities/Property';
import { Property as UIProperty } from '@/presentation/components/luxury/LuxuryPropertyCard';

describe('PropertyUtils', () => {
  const mockDomainProperty: DomainProperty = {
    idProperty: 1,
    name: 'Modern Villa',
    address: '123 Test Street',
    price: 250000,
    mainImageUrl: 'https://example.com/villa.jpg',
    ownerName: 'John Doe',
    codeInternal: 'MV001',
    year: 2020
  };

  const mockUIProperty: UIProperty = {
    idProperty: 1,
    name: 'Modern Villa',
    address: '123 Test Street',
    price: 250000,
    image: 'https://example.com/villa.jpg',
    ownerName: 'John Doe',
    codeInternal: 'MV001',
    year: 2020
  };

  describe('transformToUIProperties', () => {
    it('should transform domain properties to UI properties', () => {
      const domainProperties = [mockDomainProperty];
      const result = PropertyUtils.transformToUIProperties(domainProperties);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        idProperty: 1,
        name: 'Modern Villa',
        address: '123 Test Street',
        price: 250000,
        image: 'https://example.com/villa.jpg',
        ownerName: 'John Doe',
        codeInternal: 'MV001',
        year: 2020
      });
    });

    it('should handle empty array', () => {
      const result = PropertyUtils.transformToUIProperties([]);
      expect(result).toEqual([]);
    });

    it('should handle invalid input gracefully', () => {
      const result = PropertyUtils.transformToUIProperties(null as any);
      expect(result).toEqual([]);
    });

    it('should use default values for missing properties', () => {
      const incompleteProperty: Partial<DomainProperty> = {
        idProperty: 1,
        price: 100000,
        codeInternal: '',
        year: 2020
      };

      const result = PropertyUtils.transformToUIProperties([incompleteProperty as DomainProperty]);

      expect(result[0]).toEqual(expect.objectContaining({
        idProperty: 1,
        name: 'Unnamed Property',
        address: 'Address not provided',
        price: 100000,
        image: '/placeholder-property.jpg',
        ownerName: 'Private Owner',
        codeInternal: '',
        year: expect.any(Number)
      }));
    });
  });

  describe('formatPrice', () => {
    it('should format price with default currency', () => {
      expect(PropertyUtils.formatPrice(250000)).toBe('$250,000');
      expect(PropertyUtils.formatPrice(1000)).toBe('$1,000');
      expect(PropertyUtils.formatPrice(1500000)).toBe('$1,500,000');
    });

    it('should format price with custom currency', () => {
      expect(PropertyUtils.formatPrice(250000, '€')).toBe('€250,000');
      expect(PropertyUtils.formatPrice(250000, '£')).toBe('£250,000');
    });

    it('should handle zero price', () => {
      expect(PropertyUtils.formatPrice(0)).toBe('Contact for price');
    });

    it('should handle invalid price', () => {
      expect(PropertyUtils.formatPrice(NaN)).toBe('Price not available');
      expect(PropertyUtils.formatPrice('invalid' as any)).toBe('Price not available');
      expect(PropertyUtils.formatPrice(null as any)).toBe('Price not available');
      expect(PropertyUtils.formatPrice(undefined as any)).toBe('Price not available');
    });
  });

  describe('generatePropertyDescription', () => {
    it('should generate description for brand new property', () => {
      const currentYear = new Date().getFullYear();
      const newProperty = { ...mockUIProperty, year: currentYear };
      
      const result = PropertyUtils.generatePropertyDescription(newProperty);
      expect(result).toBe('Brand new • Listed by John Doe');
    });

    it('should generate description for recent construction', () => {
      const currentYear = new Date().getFullYear();
      const recentProperty = { ...mockUIProperty, year: currentYear - 3 };
      
      const result = PropertyUtils.generatePropertyDescription(recentProperty);
      expect(result).toBe('Recent construction • Listed by John Doe');
    });

    it('should generate description for modern property', () => {
      const currentYear = new Date().getFullYear();
      const modernProperty = { ...mockUIProperty, year: currentYear - 8 };
      
      const result = PropertyUtils.generatePropertyDescription(modernProperty);
      expect(result).toBe('Modern property • Listed by John Doe');
    });

    it('should generate description for older property', () => {
      const currentYear = new Date().getFullYear();
      const olderProperty = { ...mockUIProperty, year: currentYear - 15 };
      
      const result = PropertyUtils.generatePropertyDescription(olderProperty);
      expect(result).toBe('Listed by John Doe');
    });

    it('should handle property without year', () => {
      const { year, ...propertyWithoutYear } = mockUIProperty;
      
      const result = PropertyUtils.generatePropertyDescription(propertyWithoutYear as UIProperty);
      expect(result).toBe('Listed by John Doe');
    });
  });

  describe('validateProperty', () => {
    it('should validate complete valid property', () => {
      const result = PropertyUtils.validateProperty(mockUIProperty);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should identify missing name', () => {
      const invalidProperty = { ...mockUIProperty, name: '' };
      const result = PropertyUtils.validateProperty(invalidProperty);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Property name is required');
    });

    it('should identify missing address', () => {
      const invalidProperty = { ...mockUIProperty, address: '' };
      const result = PropertyUtils.validateProperty(invalidProperty);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Property address is required');
    });

    it('should identify invalid price', () => {
      const invalidProperty = { ...mockUIProperty, price: -100 };
      const result = PropertyUtils.validateProperty(invalidProperty);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid property price is required');
    });

    it('should identify missing internal code', () => {
      const invalidProperty = { ...mockUIProperty, codeInternal: '' };
      const result = PropertyUtils.validateProperty(invalidProperty);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Internal code is required');
    });

    it('should identify unrealistic year', () => {
      const invalidProperty = { ...mockUIProperty, year: 1700 };
      const result = PropertyUtils.validateProperty(invalidProperty);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Property year must be realistic');
    });

    it('should identify future year beyond reasonable limit', () => {
      const currentYear = new Date().getFullYear();
      const invalidProperty = { ...mockUIProperty, year: currentYear + 20 };
      const result = PropertyUtils.validateProperty(invalidProperty);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Property year must be realistic');
    });

    it('should collect multiple errors', () => {
      const invalidProperty = {
        ...mockUIProperty,
        name: '',
        address: '',
        price: -100,
        codeInternal: '',
        year: 1700
      };
      const result = PropertyUtils.validateProperty(invalidProperty);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(5);
    });
  });

  describe('sortProperties', () => {
    const properties: UIProperty[] = [
      { ...mockUIProperty, name: 'Villa B', price: 300000, year: 2019 },
      { ...mockUIProperty, name: 'Villa A', price: 200000, year: 2021 },
      { ...mockUIProperty, name: 'Villa C', price: 250000, year: 2020 }
    ];

    it('should sort by price ascending', () => {
      const result = PropertyUtils.sortProperties(properties, 'price', 'asc');
      
      expect(result[0].price).toBe(200000);
      expect(result[1].price).toBe(250000);
      expect(result[2].price).toBe(300000);
    });

    it('should sort by price descending', () => {
      const result = PropertyUtils.sortProperties(properties, 'price', 'desc');
      
      expect(result[0].price).toBe(300000);
      expect(result[1].price).toBe(250000);
      expect(result[2].price).toBe(200000);
    });

    it('should sort by name ascending', () => {
      const result = PropertyUtils.sortProperties(properties, 'name', 'asc');
      
      expect(result[0].name).toBe('Villa A');
      expect(result[1].name).toBe('Villa B');
      expect(result[2].name).toBe('Villa C');
    });

    it('should sort by name descending', () => {
      const result = PropertyUtils.sortProperties(properties, 'name', 'desc');
      
      expect(result[0].name).toBe('Villa C');
      expect(result[1].name).toBe('Villa B');
      expect(result[2].name).toBe('Villa A');
    });

    it('should sort by year ascending', () => {
      const result = PropertyUtils.sortProperties(properties, 'year', 'asc');
      
      expect(result[0].year).toBe(2019);
      expect(result[1].year).toBe(2020);
      expect(result[2].year).toBe(2021);
    });

    it('should not modify original array', () => {
      const originalLength = properties.length;
      const originalFirstProperty = properties[0];
      
      PropertyUtils.sortProperties(properties, 'price', 'desc');
      
      expect(properties).toHaveLength(originalLength);
      expect(properties[0]).toBe(originalFirstProperty);
    });
  });

  describe('searchProperties', () => {
    const properties: UIProperty[] = [
      { ...mockUIProperty, name: 'Modern Villa', address: 'Oak Street', ownerName: 'John Doe', codeInternal: 'MV001' },
      { ...mockUIProperty, name: 'Beach House', address: 'Coast Avenue', ownerName: 'Jane Smith', codeInternal: 'BH002' },
      { ...mockUIProperty, name: 'City Apartment', address: 'Downtown Plaza', ownerName: 'Bob Wilson', codeInternal: 'CA003' }
    ];

    it('should search by property name', () => {
      const result = PropertyUtils.searchProperties(properties, 'villa');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Modern Villa');
    });

    it('should search by address', () => {
      const result = PropertyUtils.searchProperties(properties, 'coast');
      
      expect(result).toHaveLength(1);
      expect(result[0].address).toBe('Coast Avenue');
    });

    it('should search by owner name', () => {
      const result = PropertyUtils.searchProperties(properties, 'jane');
      
      expect(result).toHaveLength(1);
      expect(result[0].ownerName).toBe('Jane Smith');
    });

    it('should search by internal code', () => {
      const result = PropertyUtils.searchProperties(properties, 'bh002');
      
      expect(result).toHaveLength(1);
      expect(result[0].codeInternal).toBe('BH002');
    });

    it('should be case insensitive', () => {
      const result = PropertyUtils.searchProperties(properties, 'MODERN');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Modern Villa');
    });

    it('should return all properties for empty search', () => {
      expect(PropertyUtils.searchProperties(properties, '')).toEqual(properties);
      expect(PropertyUtils.searchProperties(properties, '   ')).toEqual(properties);
      expect(PropertyUtils.searchProperties(properties, null as any)).toEqual(properties);
      expect(PropertyUtils.searchProperties(properties, undefined as any)).toEqual(properties);
    });

    it('should return empty array for no matches', () => {
      const result = PropertyUtils.searchProperties(properties, 'nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('createPaginationInfo', () => {
    it('should create pagination info for first page', () => {
      const result = PropertyUtils.createPaginationInfo(100, 1, 10);
      
      expect(result).toEqual({
        totalCount: 100,
        page: 1,
        pageSize: 10,
        totalPages: 10,
        hasNextPage: true,
        hasPreviousPage: false,
        startIndex: 1,
        endIndex: 10
      });
    });

    it('should create pagination info for middle page', () => {
      const result = PropertyUtils.createPaginationInfo(100, 5, 10);
      
      expect(result).toEqual({
        totalCount: 100,
        page: 5,
        pageSize: 10,
        totalPages: 10,
        hasNextPage: true,
        hasPreviousPage: true,
        startIndex: 41,
        endIndex: 50
      });
    });

    it('should create pagination info for last page', () => {
      const result = PropertyUtils.createPaginationInfo(95, 10, 10);
      
      expect(result).toEqual({
        totalCount: 95,
        page: 10,
        pageSize: 10,
        totalPages: 10,
        hasNextPage: false,
        hasPreviousPage: true,
        startIndex: 91,
        endIndex: 95
      });
    });

    it('should handle single page scenario', () => {
      const result = PropertyUtils.createPaginationInfo(5, 1, 10);
      
      expect(result).toEqual({
        totalCount: 5,
        page: 1,
        pageSize: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        startIndex: 1,
        endIndex: 5
      });
    });

    it('should handle empty result set', () => {
      const result = PropertyUtils.createPaginationInfo(0, 1, 10);
      
      expect(result).toEqual({
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        startIndex: 1,
        endIndex: 0
      });
    });
  });
});