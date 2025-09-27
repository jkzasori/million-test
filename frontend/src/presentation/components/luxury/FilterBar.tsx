'use client';

import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';

export interface FilterState {
  search: string;
  address: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  loading?: boolean;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  loading = false,
  className = ''
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Update local state when external filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field: keyof FilterState, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    const emptyFilters = {
      search: '',
      address: '',
      minPrice: '',
      maxPrice: ''
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange(localFilters);
  };

  const priceRanges = [
    { label: 'Under $500K', value: '500000' },
    { label: 'Under $1M', value: '1000000' },
    { label: 'Under $2M', value: '2000000' },
    { label: '$2M+', min: '2000000' }
  ];


  return (
    <div className={`${styles.professionalFilterBar} ${className}`}>
      <div className={styles.filterContainer}>
        <div className={styles.filterHeader}>
          <h2 className={styles.filterTitle}>Find Your Perfect Property</h2>
          <p className={styles.filterSubtitle}>
            Search through our premium collection of properties
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.filterForm}>
          <div className={styles.filterGrid}>
            {/* Property Name/Type Search */}
            <div className={styles.formGroup}>
              <label htmlFor="search" className={styles.formLabel}>
                Property Name or Type
              </label>
              <input
                type="text"
                id="search"
                placeholder="e.g., Villa, Penthouse, Modern House..."
                className={`${styles.formInput} ${focusedField === 'search' ? styles.focused : ''}`}
                disabled={loading}
                value={localFilters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                onFocus={() => setFocusedField('search')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Location Search */}
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.formLabel}>
                Location
              </label>
              <input
                type="text"
                id="address"
                placeholder="City, neighborhood, or address..."
                className={`${styles.formInput} ${focusedField === 'address' ? styles.focused : ''}`}
                disabled={loading}
                value={localFilters.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Min Price */}
            <div className={styles.formGroup}>
              <label htmlFor="minPrice" className={styles.formLabel}>
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                placeholder="0"
                min="0"
                step="10000"
                className={`${styles.formInput} ${focusedField === 'minPrice' ? styles.focused : ''}`}
                disabled={loading}
                value={localFilters.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                onFocus={() => setFocusedField('minPrice')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Max Price */}
            <div className={styles.formGroup}>
              <label htmlFor="maxPrice" className={styles.formLabel}>
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                placeholder="No limit"
                min="0"
                step="10000"
                className={`${styles.formInput} ${focusedField === 'maxPrice' ? styles.focused : ''}`}
                disabled={loading}
                value={localFilters.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                onFocus={() => setFocusedField('maxPrice')}
                onBlur={() => setFocusedField('null')}
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className={styles.quickFilters}>
            <h3 className={styles.quickFiltersTitle}>Quick Price Filters</h3>
            <div className={styles.quickFiltersGrid}>
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  type="button"
                  className={styles.quickFilterBtn}
                  disabled={loading}
                  onClick={() => {
                    if (range.min) {
                      handleInputChange('minPrice', range.min);
                      handleInputChange('maxPrice', '');
                    } else if (range.value) {
                      handleInputChange('minPrice', '');
                      handleInputChange('maxPrice', range.value);
                    }
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.filterActions}>
            <button 
              type="submit" 
              disabled={loading} 
              className={`btn-primary ${styles.searchBtn}`}
            >
              {loading ? (
                <>
                  <div className={styles.loading}></div>
                  <span>Searching...</span>
                </>
              ) : (
                <span>Search Properties</span>
              )}
            </button>
            
            <button 
              type="button" 
              disabled={loading} 
              className={`btn-secondary ${styles.resetBtn}`}
              onClick={handleReset}
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default FilterBar;