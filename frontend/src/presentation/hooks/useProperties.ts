'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PropertyListItem, PropertyFilters, PaginatedPropertyResult } from '../../domain/entities/Property';
import { DependencyContainer } from '../../infrastructure/config/DependencyContainer';
import { ErrorHandler } from '../../infrastructure/errors/ErrorHandler';
import { useDebounce } from './useDebounce';

interface UsePropertiesState {
  properties: PropertyListItem[];
  loading: boolean;
  error: string | null;
  errorDetails: ReturnType<typeof ErrorHandler.handle> | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface UsePropertiesResult extends UsePropertiesState {
  loadProperties: (page?: number, size?: number, filters?: PropertyFilters) => Promise<void>;
  searchProperties: (query: string, page?: number, size?: number) => Promise<void>;
  clearError: () => void;
  refetch: () => Promise<void>;
}

export const useProperties = (
  initialPage: number = 1,
  initialSize: number = 10,
  initialFilters?: PropertyFilters
): UsePropertiesResult => {
  const [state, setState] = useState<UsePropertiesState>({
    properties: [],
    loading: true,
    error: null,
    errorDetails: null,
    totalCount: 0,
    totalPages: 0,
    currentPage: initialPage,
    pageSize: initialSize,
  });

  const [lastRequest, setLastRequest] = useState<{
    page: number;
    size: number;
    filters?: PropertyFilters;
    searchQuery?: string;
  }>({
    page: initialPage,
    size: initialSize,
    filters: initialFilters,
  });

  const propertyService = useMemo(
    () => DependencyContainer.getInstance().getPropertyService(),
    []
  );

  // Debounce search filters to avoid excessive API calls
  const debouncedFilters = useDebounce(initialFilters, 300);

  const loadProperties = useCallback(
    async (page: number = 1, size: number = 10, filters?: PropertyFilters) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      setLastRequest({ page, size, filters });

      try {
        const result: PaginatedPropertyResult = await propertyService.getProperties(page, size, filters);
        
        setState(prev => ({
          ...prev,
          properties: result.properties,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.page,
          pageSize: result.size,
          loading: false,
        }));
      } catch (error) {
        const errorDetails = ErrorHandler.handle(error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorDetails.userFriendlyMessage,
          errorDetails,
        }));

        // Log error for monitoring
        console.error('Failed to load properties:', error);
      }
    },
    [propertyService]
  );

  const searchProperties = useCallback(
    async (query: string, page: number = 1, size: number = 10) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      setLastRequest({ page, size, searchQuery: query });

      try {
        const result: PaginatedPropertyResult = await propertyService.searchProperties(query, page, size);
        
        setState(prev => ({
          ...prev,
          properties: result.properties,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.page,
          pageSize: result.size,
          loading: false,
        }));
      } catch (error) {
        const errorDetails = ErrorHandler.handle(error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorDetails.userFriendlyMessage,
          errorDetails,
        }));

        // Log error for monitoring
        console.error('Failed to search properties:', error);
      }
    },
    [propertyService]
  );

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null, errorDetails: null }));
  }, []);

  const refetch = useCallback(async () => {
    const { page, size, filters, searchQuery } = lastRequest;
    if (searchQuery) {
      await searchProperties(searchQuery, page, size);
    } else {
      await loadProperties(page, size, filters);
    }
  }, [lastRequest, loadProperties, searchProperties]);

  useEffect(() => {
    loadProperties(initialPage, initialSize, initialFilters);
  }, []); // Only run on mount

  return {
    ...state,
    loadProperties,
    searchProperties,
    clearError,
    refetch,
  };
};