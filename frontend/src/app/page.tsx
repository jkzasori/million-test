'use client';

import { useState, useEffect } from 'react';
import PropertyFilter from '@/components/PropertyFilter';
import PropertyList from '@/components/PropertyList';
import Pagination from '@/components/Pagination';
import { PropertyDto, PropertyFilterDto, PropertyListResponseDto } from '@/types/property';
import { propertyService } from '@/services/api';

export default function Home() {
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<PropertyFilterDto>({
    page: 1,
    pageSize: 12,
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
      
      setProperties(response.properties);
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

  const handleFilterChange = (filter: PropertyFilterDto) => {
    const newFilter = { ...filter, page: 1 };
    setCurrentFilter(newFilter);
    fetchProperties(newFilter);
  };

  const handlePageChange = (page: number) => {
    const newFilter = { ...currentFilter, page };
    setCurrentFilter(newFilter);
    fetchProperties(newFilter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Million Test Properties
            </h1>
            <p className="mt-2 text-gray-600">
              Discover your perfect property from our extensive collection
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <PropertyFilter onFilterChange={handleFilterChange} loading={loading} />

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-gray-600">
              {pagination.totalCount === 0
                ? 'No properties found'
                : `Found ${pagination.totalCount} ${
                    pagination.totalCount === 1 ? 'property' : 'properties'
                  }`}
            </p>
          </div>
        )}

        {/* Property List */}
        <PropertyList
          properties={properties}
          loading={loading}
          error={error}
        />

        {/* Pagination */}
        {!loading && !error && properties.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Million Test Properties. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}