'use client';

import { useState, useCallback, useMemo } from 'react';
import Header from '@/presentation/components/luxury/Header';
import HeroSection from '@/presentation/components/luxury/HeroSection';
import FilterBar, { FilterState } from '@/presentation/components/luxury/FilterBar';
import PropertyGrid from '@/presentation/components/luxury/PropertyGrid';
import LuxuryPagination from '@/presentation/components/luxury/LuxuryPagination';
import Footer from '@/presentation/components/luxury/Footer';
import { Property } from '@/presentation/components/luxury/LuxuryPropertyCard';
import { useProperties } from '@/presentation/hooks/useProperties';
import { FilterUtils } from '@/presentation/utils/filterUtils';
import { PropertyUtils } from '@/presentation/utils/propertyUtils';

/**
 * Configuration constants for the home page
 */
const PAGE_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  INITIAL_PAGE: 1,
  SALES_AMOUNT: '$2.1 BILLION'
} as const;

/**
 * Home page component that displays property listings with filtering and pagination
 * Implements Clean Code principles with clear separation of concerns
 */
export default function Home() {
  // Local state for UI filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    address: '',
    minPrice: '',
    maxPrice: ''
  });

  // Custom hook for property data management
  const {
    properties,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    loadProperties
  } = useProperties(PAGE_CONFIG.INITIAL_PAGE, PAGE_CONFIG.DEFAULT_PAGE_SIZE);

  /**
   * Handles filter changes from the FilterBar component
   * Converts UI filters to domain filters and triggers property loading
   */
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    
    const domainFilters = FilterUtils.createCleanFilters(newFilters);
    loadProperties(PAGE_CONFIG.INITIAL_PAGE, PAGE_CONFIG.DEFAULT_PAGE_SIZE, domainFilters);
  }, [loadProperties]);

  /**
   * Handles page navigation while preserving current filters
   */
  const handlePageChange = useCallback((page: number) => {
    const domainFilters = FilterUtils.createCleanFilters(filters);
    loadProperties(page, pageSize, domainFilters);
  }, [filters, loadProperties, pageSize]);

  /**
   * Handles property view action - currently logs for demonstration
   * In a real application, this would navigate to property details
   */
  const handlePropertyView = useCallback((property: Property) => {
    console.log('Viewing property:', property.name, `(ID: ${property.idProperty})`);
    window.location.href = `/property/${property.idProperty}`;
  }, []);

  /**
   * Transforms domain properties to UI format using utility functions
   */
  const transformedProperties = useMemo(() => 
    PropertyUtils.transformToUIProperties(properties),
    [properties]
  );

  /**
   * Creates pagination configuration object
   */
  const paginationConfig = useMemo(() => 
    PropertyUtils.createPaginationInfo(totalCount, currentPage, pageSize),
    [totalCount, currentPage, pageSize]
  );

  /**
   * Generates hero section statistics with current data
   */
  const heroStats = useMemo(() => [
    { 
      label: "PREMIUM", 
      value: paginationConfig.totalCount.toLocaleString(), 
      description: "PROPERTIES AVAILABLE" 
    },
    { 
      label: "MORE THAN", 
      value: PAGE_CONFIG.SALES_AMOUNT, 
      description: "IN SALES" 
    }
  ], [paginationConfig.totalCount]);

  /**
   * Determines if pagination should be displayed
   */
  const shouldShowPagination = useMemo(() => 
    !loading && !error && transformedProperties.length > 0 && paginationConfig.totalPages > 1,
    [loading, error, transformedProperties.length, paginationConfig.totalPages]
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation Header */}
      <Header />
      
      {/* Hero Section with Dynamic Stats */}
      <HeroSection stats={heroStats} />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Property Filtering */}
        <FilterBar 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />

        {/* Property Display Grid */}
        <PropertyGrid
          properties={transformedProperties}
          loading={loading}
          error={error}
          onPropertyView={handlePropertyView}
        />

        {/* Pagination Controls */}
        {shouldShowPagination && (
          <LuxuryPagination
            pagination={paginationConfig}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}