'use client';

import { useState } from 'react';
import { PropertyFilterDto } from '@/types/property';

interface PropertyFilterProps {
  onFilterChange: (filter: PropertyFilterDto) => void;
  loading?: boolean;
}

export default function PropertyFilter({ onFilterChange, loading = false }: PropertyFilterProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filter: PropertyFilterDto = {
      name: name.trim() || undefined,
      address: address.trim() || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      page: 1,
      pageSize: 12,
    };

    onFilterChange(filter);
  };

  const handleClear = () => {
    setName('');
    setAddress('');
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({ page: 1, pageSize: 12 });
  };

  const formatPrice = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value.replace(/[^\d]/g, ''));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="glass card-luxury p-8 mb-8 animate-slide-up">
      {/* Premium Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-6 py-2 glass rounded-full mb-4">
          <span className="text-yellow-400 mr-2">🔍</span>
          <span className="text-white/90 font-medium">Advanced Search</span>
        </div>
        <h2 className="text-3xl font-bold text-luxury mb-2">
          Find Your Perfect Property
        </h2>
        <p className="text-white/70">
          Discover exceptional properties tailored to your refined taste
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Fields Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Name */}
          <div className="group">
            <label htmlFor="name" className="block text-sm font-semibold text-white/80 mb-3 flex items-center">
              <span className="mr-2">🏛️</span>
              Property Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Villa, Penthouse, Estate..."
                className="input-luxury group-hover:bg-white/15 transition-all duration-300 pl-12"
                disabled={loading}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40">
                🏠
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="group">
            <label htmlFor="address" className="block text-sm font-semibold text-white/80 mb-3 flex items-center">
              <span className="mr-2">📍</span>
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, neighborhood, street..."
                className="input-luxury group-hover:bg-white/15 transition-all duration-300 pl-12"
                disabled={loading}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40">
                🌍
              </div>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center px-4 py-2 glass rounded-full">
              <span className="text-yellow-400 mr-2">💎</span>
              <span className="text-white/90 font-medium">Price Range</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Min Price */}
            <div className="group">
              <label htmlFor="minPrice" className="block text-sm font-semibold text-white/80 mb-3">
                Minimum Investment
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="minPrice"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="10000"
                  className="input-luxury group-hover:bg-white/15 transition-all duration-300 pl-12"
                  disabled={loading}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 font-semibold">
                  $
                </div>
                {minPrice && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">
                    {formatPrice(minPrice)}
                  </div>
                )}
              </div>
            </div>

            {/* Max Price */}
            <div className="group">
              <label htmlFor="maxPrice" className="block text-sm font-semibold text-white/80 mb-3">
                Maximum Investment
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="maxPrice"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="No limit"
                  min="0"
                  step="10000"
                  className="input-luxury group-hover:bg-white/15 transition-all duration-300 pl-12"
                  disabled={loading}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 font-semibold">
                  $
                </div>
                {maxPrice && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">
                    {formatPrice(maxPrice)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
          <button
            type="submit"
            disabled={loading}
            className="btn-luxury flex-1 md:flex-initial min-w-[200px] flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="loader-luxury w-5 h-5"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Discover Properties</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="btn-secondary flex-1 md:flex-initial min-w-[150px] flex items-center justify-center space-x-2"
          >
            <span>🔄</span>
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Quick Filters */}
        <div className="border-t border-white/10 pt-6">
          <div className="text-center mb-4">
            <span className="text-white/60 text-sm">Quick Filters</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Luxury Villas', minPrice: '1000000', name: 'Villa' },
              { label: 'Penthouses', minPrice: '500000', name: 'Penthouse' },
              { label: 'Under $500K', maxPrice: '500000' },
              { label: 'Mansions', minPrice: '2000000', name: 'Mansion' },
            ].map((filter, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setName(filter.name || '');
                  setMinPrice(filter.minPrice || '');
                  setMaxPrice(filter.maxPrice || '');
                }}
                className="px-4 py-2 glass rounded-full text-sm text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
                disabled={loading}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}