'use client';

import { useState, useEffect, useCallback } from 'react';
import { Property } from '../../domain/entities/Property';
import { DependencyContainer } from '../../infrastructure/config/DependencyContainer';
import { ErrorHandler } from '../../infrastructure/errors/ErrorHandler';

interface UsePropertyState {
  property: Property | null;
  loading: boolean;
  error: string | null;
  errorDetails: ReturnType<typeof ErrorHandler.handle> | null;
}

interface UsePropertyResult extends UsePropertyState {
  loadProperty: (id: number) => Promise<void>;
  clearError: () => void;
  refetch: () => Promise<void>;
}

export const useProperty = (propertyId?: number): UsePropertyResult => {
  const [state, setState] = useState<UsePropertyState>({
    property: null,
    loading: Boolean(propertyId),
    error: null,
    errorDetails: null,
  });

  const [currentId, setCurrentId] = useState<number | undefined>(propertyId);

  const propertyService = DependencyContainer.getInstance().getPropertyService();

  const loadProperty = useCallback(
    async (id: number) => {
      setState(prev => ({ ...prev, loading: true, error: null, errorDetails: null }));
      setCurrentId(id);

      try {
        const property = await propertyService.getPropertyById(id);
        setState(prev => ({
          ...prev,
          property,
          loading: false,
        }));
      } catch (error) {
        const errorDetails = ErrorHandler.handle(error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorDetails.userFriendlyMessage,
          errorDetails,
          property: null,
        }));

        console.error('Failed to load property:', error);
      }
    },
    [propertyService]
  );

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null, errorDetails: null }));
  }, []);

  const refetch = useCallback(async () => {
    if (currentId) {
      await loadProperty(currentId);
    }
  }, [currentId, loadProperty]);

  useEffect(() => {
    if (propertyId) {
      loadProperty(propertyId);
    }
  }, [propertyId, loadProperty]);

  return {
    ...state,
    loadProperty,
    clearError,
    refetch,
  };
};