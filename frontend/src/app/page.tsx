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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Floating Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-yellow-400/30 to-orange-600/20 rounded-full blur-3xl floating opacity-80"></div>
        <div className="absolute -bottom-40 -left-40 w-[120%] h-[120%] bg-gradient-to-tr from-purple-600/15 to-blue-500/20 rounded-full blur-3xl floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-500/15 to-red-500/10 rounded-full blur-3xl floating" style={{animationDelay: '3s'}}></div>
        
        {/* Smaller Accent Orbs */}
        <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-600/15 rounded-full blur-2xl floating" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-gradient-to-br from-emerald-400/15 to-teal-600/10 rounded-full blur-2xl floating" style={{animationDelay: '4s'}}></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-yellow-400/20 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-purple-400/20 rotate-45 animate-pulse"></div>
        
        {/* Particle System */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-yellow-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Luxury Header */}
      <header className="relative z-10 glass-strong border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 relative">
            {/* Floating Icons */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 text-2xl opacity-30 animate-bounce" style={{animationDelay: '0.5s'}}>🏰</div>
              <div className="absolute top-8 right-8 text-2xl opacity-30 animate-bounce" style={{animationDelay: '1.5s'}}>💎</div>
              <div className="absolute bottom-4 left-1/4 text-2xl opacity-30 animate-bounce" style={{animationDelay: '2.5s'}}>👑</div>
              <div className="absolute bottom-8 right-1/3 text-2xl opacity-30 animate-bounce" style={{animationDelay: '3.5s'}}>🏛️</div>
            </div>

            <div className="text-center relative">
              {/* Premium Badge */}
              <div className="inline-flex items-center px-6 py-3 glass-strong rounded-full mb-8 animate-fade-scale">
                <span className="text-yellow-400 text-lg mr-2">✨</span>
                <span className="text-white/90 font-semibold tracking-wider text-sm uppercase">Ultra Premium Collection</span>
                <span className="text-yellow-400 text-lg ml-2">✨</span>
              </div>

              {/* Main Title */}
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-luxury mb-6 animate-fade-scale relative">
                <span className="relative">
                  Million Properties
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-xl -z-10"></div>
                </span>
              </h1>
              
              {/* Decorative Line */}
              <div className="flex items-center justify-center mb-8">
                <div className="w-8 h-0.5 bg-yellow-400/40"></div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 mx-2"></div>
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 mx-2"></div>
                <div className="w-8 h-0.5 bg-yellow-400/40"></div>
              </div>
              
              {/* Subtitle */}
              <p className="text-2xl md:text-3xl text-white/90 font-light tracking-wide animate-slide-up mb-4">
                Discover extraordinary luxury properties that redefine
              </p>
              <p className="text-2xl md:text-3xl text-luxury font-bold animate-slide-up" style={{animationDelay: '0.2s'}}>
                ELEGANCE & SOPHISTICATION
              </p>
              
              {/* Stats Cards */}
              <div className="mt-12 flex flex-wrap justify-center gap-6">
                <div className="glass-strong px-8 py-4 rounded-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px]">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-3xl">🏘️</span>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-yellow-400">{pagination.totalCount.toLocaleString()}</div>
                      <div className="text-white/70 text-sm">Premium Properties</div>
                    </div>
                  </div>
                </div>
                <div className="glass-strong px-8 py-4 rounded-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px]">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-3xl">👥</span>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-green-400">1,000+</div>
                      <div className="text-white/70 text-sm">Satisfied Clients</div>
                    </div>
                  </div>
                </div>
                <div className="glass-strong px-8 py-4 rounded-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px]">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-3xl">🌍</span>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-blue-400">50+</div>
                      <div className="text-white/70 text-sm">Prime Locations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Find Your Dream Property
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Use our advanced filters to discover properties that match your lifestyle and preferences
            </p>
          </div>
          <PropertyFilter onFilterChange={handleFilterChange} loading={loading} />
        </div>

        {/* Results Section */}
        <div className="mb-12">
          {!loading && !error && (
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 glass rounded-2xl">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {pagination.totalCount === 0
                    ? 'No Properties Found'
                    : `${pagination.totalCount.toLocaleString()} Exceptional ${
                        pagination.totalCount === 1 ? 'Property' : 'Properties'
                      }`}
                </h3>
                {pagination.totalCount > 0 && (
                  <p className="text-white/60">
                    Showing {((pagination.page - 1) * pagination.pageSize) + 1}-{Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} results
                  </p>
                )}
              </div>
              {pagination.totalCount > 0 && (
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center space-x-4">
                    <div className="text-white/60">Sort by:</div>
                    <select className="input-luxury text-sm py-2">
                      <option value="featured">Featured</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Property Grid */}
        <div className="mb-16">
          <PropertyList
            properties={properties}
            loading={loading}
            error={error}
          />
        </div>

        {/* Pagination */}
        {!loading && !error && properties.length > 0 && (
          <div className="mb-16">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass-dark border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-luxury mb-4">Million Properties</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Curating the world's most exceptional properties for discerning clients. 
                Experience luxury redefined through our exclusive collection of premium real estate.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <span className="text-white">📘</span>
                </button>
                <button className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <span className="text-white">📷</span>
                </button>
                <button className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <span className="text-white">🐦</span>
                </button>
                <button className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <span className="text-white">💼</span>
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Property Search</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Market Analysis</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Investment Advisory</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Concierge Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-white/70">
                <li>📞 +1 (555) 123-4567</li>
                <li>✉️ luxury@millionproperties.com</li>
                <li>📍 Beverly Hills, CA 90210</li>
                <li>🕒 Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 mb-4 md:mb-0">
              &copy; 2024 Million Properties. All rights reserved. Luxury redefined.
            </p>
            <div className="flex space-x-6 text-white/60">
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Careers</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}