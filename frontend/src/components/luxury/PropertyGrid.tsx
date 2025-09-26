import React from 'react';
import LuxuryPropertyCard, { Property } from './LuxuryPropertyCard';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  error?: string | null;
  className?: string;
  onPropertyView?: (property: Property) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  loading = false,
  error = null,
  className = '',
  onPropertyView
}) => {
  // Loading skeleton component
  const LoadingSkeleton = ({ delay = 0 }) => (
    <div 
      className="loading-skeleton card-luxury animate-pulse" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="skeleton-image shimmer"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title shimmer"></div>
        <div className="skeleton-line skeleton-subtitle shimmer"></div>
        <div className="skeleton-line skeleton-price shimmer"></div>
        <div className="skeleton-actions">
          <div className="skeleton-line skeleton-action shimmer"></div>
          <div className="skeleton-line skeleton-button shimmer"></div>
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="error-state">
      <div className="error-content glass-strong">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-message">{error}</p>
        <button className="btn-secondary retry-btn" onClick={() => window.location.reload()}>
          🔄 Try Again
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-content glass-strong">
        <div className="empty-icon">🏘️</div>
        <h3 className="empty-title text-luxury">No Properties Found</h3>
        <p className="empty-message">
          We couldn't find any properties matching your search criteria. 
          Try adjusting your filters or search terms.
        </p>
        <div className="empty-suggestions">
          <h4>Suggestions:</h4>
          <ul>
            <li>• Clear all filters and try again</li>
            <li>• Expand your price range</li>
            <li>• Try different keywords</li>
            <li>• Browse all available properties</li>
          </ul>
        </div>
      </div>
    </div>
  );

  if (error) {
    return <ErrorState />;
  }

  if (loading) {
    return (
      <div className={`property-grid ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <LoadingSkeleton key={index} delay={index * 150} />
        ))}
        
        <style jsx>{`
          .property-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
          }

          .loading-skeleton {
            padding: 0;
            overflow: hidden;
          }

          .skeleton-image {
            height: 280px;
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 100%);
          }

          .skeleton-content {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .skeleton-line {
            height: 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
          }

          .skeleton-title {
            height: 1.5rem;
            width: 70%;
          }

          .skeleton-subtitle {
            height: 1rem;
            width: 50%;
          }

          .skeleton-price {
            height: 2rem;
            width: 60%;
            margin: 0.5rem 0;
          }

          .skeleton-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.75rem;
          }

          .skeleton-action {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 0.5rem;
          }

          .skeleton-button {
            flex: 1;
            height: 2.5rem;
          }

          @media (max-width: 1200px) {
            .property-grid {
              grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
              gap: 1.5rem;
            }
          }

          @media (max-width: 768px) {
            .property-grid {
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 1.25rem;
            }

            .skeleton-image {
              height: 240px;
            }
          }

          @media (max-width: 480px) {
            .property-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
            }

            .skeleton-image {
              height: 220px;
            }
          }
        `}</style>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="grid-container">
        <EmptyState />
        
        <style jsx>{`
          .grid-container {
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .empty-state {
            text-align: center;
            max-width: 600px;
            width: 100%;
            padding: 2rem;
          }

          .empty-content {
            padding: 3rem 2rem;
            border-radius: 1.5rem;
          }

          .empty-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
          }

          .empty-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }

          .empty-message {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .empty-suggestions {
            text-align: left;
            background: rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .empty-suggestions h4 {
            color: #ffd700;
            margin-bottom: 1rem;
            font-weight: 600;
          }

          .empty-suggestions ul {
            list-style: none;
            padding: 0;
          }

          .empty-suggestions li {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 0.5rem;
            line-height: 1.4;
          }

          .error-state {
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            max-width: 500px;
            width: 100%;
            margin: 0 auto;
            padding: 2rem;
          }

          .error-content {
            padding: 3rem 2rem;
            border-radius: 1.5rem;
          }

          .error-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
          }

          .error-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #ff6b6b;
          }

          .error-message {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .retry-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          @media (max-width: 768px) {
            .empty-content,
            .error-content {
              padding: 2rem 1.5rem;
            }

            .empty-title {
              font-size: 1.75rem;
            }

            .empty-icon,
            .error-icon {
              font-size: 3rem;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`property-grid ${className}`}>
      {properties.map((property, index) => (
        <LuxuryPropertyCard
          key={property.idProperty}
          property={property}
          onView={onPropertyView}
          className={`animate-fade-scale`}
          style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
        />
      ))}
      
      <style jsx>{`
        .property-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 1200px) {
          .property-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 900px) {
          .property-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .property-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.25rem;
          }
        }

        @media (max-width: 640px) {
          .property-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyGrid;