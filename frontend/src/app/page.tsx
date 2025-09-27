'use client';

import { useState } from 'react';
import Header from '@/presentation/components/luxury/Header';
import HeroSection from '@/presentation/components/luxury/HeroSection';
import FilterBar, { FilterState } from '@/presentation/components/luxury/FilterBar';
import PropertyGrid from '@/presentation/components/luxury/PropertyGrid';
import LuxuryPagination from '@/presentation/components/luxury/LuxuryPagination';
import Footer from '@/presentation/components/luxury/Footer';
import { Property } from '@/presentation/components/luxury/LuxuryPropertyCard';
import { PropertyFilters } from '@/domain/entities/Property';
import { useProperties } from '@/presentation/hooks/useProperties';

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    address: '',
    minPrice: '',
    maxPrice: ''
  });

  const {
    properties,
    loading,
    error,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    loadProperties,
    searchProperties,
    clearError
  } = useProperties(1, 12);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    // Convert FilterState to PropertyFilters
    const domainFilters: PropertyFilters = {
      ...(newFilters.search && { name: newFilters.search }),
      ...(newFilters.address && { address: newFilters.address }),
      ...(newFilters.minPrice && { minPrice: parseInt(newFilters.minPrice) }),
      ...(newFilters.maxPrice && { maxPrice: parseInt(newFilters.maxPrice) })
    };
    
    loadProperties(1, 12, domainFilters);
  };

  const handlePageChange = (page: number) => {
    const domainFilters: PropertyFilters = {
      ...(filters.search && { name: filters.search }),
      ...(filters.address && { address: filters.address }),
      ...(filters.minPrice && { minPrice: parseInt(filters.minPrice) }),
      ...(filters.maxPrice && { maxPrice: parseInt(filters.maxPrice) })
    };
    
    loadProperties(page, pageSize, domainFilters);
  };

  const handlePropertyView = (property: Property) => {
    console.log('Viewing property:', property);
    // TODO: Implement property detail view
  };

  // Transform domain entities to component props
  const transformedProperties: Property[] = properties.map(prop => ({
    idProperty: prop.idProperty,
    name: prop.name,
    address: prop.address,
    price: prop.price,
    image: prop.mainImageUrl || '/placeholder-property.jpg',
    ownerName: prop.ownerName || 'Private Owner',
    codeInternal: prop.codeInternal,
    year: prop.year
  }));

  const pagination = {
    totalCount,
    page: currentPage,
    pageSize,
    totalPages,
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
          properties={transformedProperties}
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