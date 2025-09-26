import React, { useState, useEffect } from 'react';

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
    <div className={`professional-filter-bar ${className}`}>
      <div className="filter-container">
        <div className="filter-header">
          <h2 className="filter-title">Find Your Perfect Property</h2>
          <p className="filter-subtitle">
            Search through our premium collection of properties
          </p>
        </div>

        <form onSubmit={handleSubmit} className="filter-form">
          <div className="filter-grid">
            {/* Property Name/Type Search */}
            <div className="form-group">
              <label htmlFor="search" className="form-label">
                Property Name or Type
              </label>
              <input
                type="text"
                id="search"
                placeholder="e.g., Villa, Penthouse, Modern House..."
                className={`form-input ${focusedField === 'search' ? 'focused' : ''}`}
                disabled={loading}
                value={localFilters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                onFocus={() => setFocusedField('search')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Location Search */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Location
              </label>
              <input
                type="text"
                id="address"
                placeholder="City, neighborhood, or address..."
                className={`form-input ${focusedField === 'address' ? 'focused' : ''}`}
                disabled={loading}
                value={localFilters.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Min Price */}
            <div className="form-group">
              <label htmlFor="minPrice" className="form-label">
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                placeholder="0"
                min="0"
                step="10000"
                className={`form-input ${focusedField === 'minPrice' ? 'focused' : ''}`}
                disabled={loading}
                value={localFilters.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                onFocus={() => setFocusedField('minPrice')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Max Price */}
            <div className="form-group">
              <label htmlFor="maxPrice" className="form-label">
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                placeholder="No limit"
                min="0"
                step="10000"
                className={`form-input ${focusedField === 'maxPrice' ? 'focused' : ''}`}
                disabled={loading}
                value={localFilters.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                onFocus={() => setFocusedField('maxPrice')}
                onBlur={() => setFocusedField('null')}
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="quick-filters">
            <h3 className="quick-filters-title">Quick Price Filters</h3>
            <div className="quick-filters-grid">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  type="button"
                  className="quick-filter-btn"
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
          <div className="filter-actions">
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary search-btn"
            >
              {loading ? (
                <>
                  <div className="loading"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <span>Search Properties</span>
              )}
            </button>
            
            <button 
              type="button" 
              disabled={loading} 
              className="btn-secondary reset-btn"
              onClick={handleReset}
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .professional-filter-bar {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-border);
          margin-bottom: var(--spacing-xxl);
        }

        .filter-container {
          padding: var(--spacing-xxl);
        }

        .filter-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
          padding-bottom: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
        }

        .filter-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--spacing-sm);
          font-family: var(--font-display);
        }

        .filter-subtitle {
          color: var(--color-text-secondary);
          font-size: 1rem;
          margin: 0;
        }

        .filter-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          margin-bottom: var(--spacing-sm);
          font-weight: 600;
          color: var(--color-primary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          padding: var(--spacing-md);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          transition: var(--transition-normal);
          background: white;
          color: var(--color-text-primary);
        }

        .form-input:focus,
        .form-input.focused {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.1);
          outline: none;
        }

        .form-input:disabled {
          background: var(--color-surface);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .quick-filters {
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
        }

        .quick-filters-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--spacing-md);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .quick-filters-grid {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .quick-filter-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--color-border);
          background: white;
          color: var(--color-text-secondary);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-normal);
          white-space: nowrap;
        }

        .quick-filter-btn:hover:not(:disabled) {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: rgba(201, 169, 110, 0.05);
        }

        .quick-filter-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .filter-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          align-items: center;
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
        }

        .search-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          min-width: 160px;
          justify-content: center;
          padding: var(--spacing-md) var(--spacing-xl);
        }

        .reset-btn {
          min-width: 140px;
          padding: var(--spacing-md) var(--spacing-xl);
        }

        .loading {
          width: 16px;
          height: 16px;
        }

        @media (max-width: 768px) {
          .filter-container {
            padding: var(--spacing-xl) var(--spacing-lg);
          }

          .filter-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }

          .filter-title {
            font-size: 1.5rem;
          }

          .filter-actions {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .search-btn,
          .reset-btn {
            width: 100%;
            max-width: 280px;
          }

          .quick-filters-grid {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .filter-container {
            padding: var(--spacing-lg);
          }

          .quick-filter-btn {
            flex: 1;
            min-width: 120px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default FilterBar;