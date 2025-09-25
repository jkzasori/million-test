'use client';

import PropertyCard from './PropertyCard';
import { PropertyDto } from '@/types/property';

interface PropertyListProps {
  properties: PropertyDto[];
  loading?: boolean;
  error?: string | null;
}

export default function PropertyList({ properties, loading = false, error }: PropertyListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card-luxury p-0 overflow-hidden animate-pulse" style={{animationDelay: `${index * 150}ms`}}>
            <div className="h-64 bg-gradient-to-br from-white/10 to-white/5 shimmer"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-white/20 rounded-lg shimmer"></div>
              <div className="h-4 bg-white/15 rounded-lg w-3/4 shimmer"></div>
              <div className="h-8 bg-white/20 rounded-lg w-1/2 shimmer"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-white/15 rounded w-20 shimmer"></div>
                <div className="h-10 bg-white/20 rounded-lg w-24 shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass card-luxury p-12 text-center animate-fade-scale">
        <div className="text-red-400 mb-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full glass-dark flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Error Loading Properties</h3>
          <p className="text-white/70 text-lg leading-relaxed max-w-md mx-auto">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-luxury mt-6"
        >
          <span>🔄</span>
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="glass card-luxury p-16 text-center animate-fade-scale">
        <div className="text-white/60">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full glass-dark flex items-center justify-center">
            <span className="text-5xl">🏠</span>
          </div>
          <h3 className="text-3xl font-bold text-luxury mb-4">No Properties Found</h3>
          <p className="text-white/70 text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            We couldn't find any properties matching your refined criteria. 
            Try adjusting your filters to discover more exceptional opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-secondary">
              <span>🔍</span>
              <span>Broaden Search</span>
            </button>
            <button className="btn-secondary">
              <span>📧</span>
              <span>Get Notified</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {properties.map((property, index) => (
        <div key={property.idProperty} style={{animationDelay: `${index * 100}ms`}}>
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
}