'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/luxury/Header';
import HeroSection from '@/components/luxury/HeroSection';
import FilterBar, { FilterState } from '@/components/luxury/FilterBar';
import PropertyGrid from '@/components/luxury/PropertyGrid';
import LuxuryPagination from '@/components/luxury/LuxuryPagination';
import Footer from '@/components/luxury/Footer';
import { Property } from '@/components/luxury/LuxuryPropertyCard';
import { PropertyFilterDto, PropertyListResponseDto } from '@/types/property';
import { propertyService } from '@/services/api';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<PropertyFilterDto>({
    page: 1,
    pageSize: 12,
  });
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    address: '',
    minPrice: '',
    maxPrice: ''
  });
  const [pagination, setPagination] = useState({
    totalCount: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
  });

  const fetchProperties = async (filter: PropertyFilterDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PropertyListResponseDto = await propertyService.getProperties(filter);
      
      // Transform PropertyDto to Property format
      const transformedProperties: Property[] = response.properties.map(prop => ({
        idProperty: prop.idProperty,
        name: prop.name,
        address: prop.address,
        price: prop.price,
        image: prop.image || '/placeholder-property.jpg',
        ownerName: prop.ownerName || 'Private Owner',
        codeInternal: prop.codeInternal,
        year: prop.year
      }));
      
      setProperties(transformedProperties);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(currentFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    // Convert FilterState to PropertyFilterDto
    const filter: PropertyFilterDto = {
      page: 1,
      pageSize: currentFilter.pageSize,
      ...(newFilters.search && { name: newFilters.search }),
      ...(newFilters.address && { address: newFilters.address }),
      ...(newFilters.minPrice && { minPrice: parseInt(newFilters.minPrice) }),
      ...(newFilters.maxPrice && { maxPrice: parseInt(newFilters.maxPrice) })
    };
    
    setCurrentFilter(filter);
    fetchProperties(filter);
  };


  const handlePageChange = (page: number) => {
    const newFilter = { ...currentFilter, page };
    setCurrentFilter(newFilter);
    fetchProperties(newFilter);
  };

  const handlePropertyView = (property: Property) => {
    console.log('Viewing property:', property);
    // TODO: Implement property detail view
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection 
        stats={[
          { label: "PREMIUM", value: `${pagination.totalCount.toLocaleString()}`, description: "PROPERTIES AVAILABLE" },
          { label: "MORE THAN", value: "$2.1 BILLION", description: "IN SALES" }
        ]}
      />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Filter Section */}
        <FilterBar 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />

        {/* Property Grid */}
        <PropertyGrid
          properties={properties}
          loading={loading}
          error={error}
          onPropertyView={handlePropertyView}
        />

        {/* Pagination */}
        {!loading && !error && properties.length > 0 && (
          <LuxuryPagination
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}