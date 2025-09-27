'use client';

import { useState, useEffect, useCallback } from 'react';
import { Property } from '../../domain/entities/Property';
import { DependencyContainer } from '../../infrastructure/config/DependencyContainer';

interface UsePropertyState {
  property: Property | null;
  loading: boolean;
  error: string | null;
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
  });

  const [currentId, setCurrentId] = useState<number | undefined>(propertyId);

  const propertyService = DependencyContainer.getInstance().getPropertyService();

  const loadProperty = useCallback(
    async (id: number) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      setCurrentId(id);

      try {
        const property = await propertyService.getPropertyById(id);
        setState(prev => ({
          ...prev,
          property,
          loading: false,
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load property';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          property: null,
        }));
      }
    },
    [propertyService]
  );

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
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