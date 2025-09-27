import React, { memo, useMemo } from 'react';
import LuxuryPropertyCard, { Property } from './LuxuryPropertyCard';
import { VirtualizedList } from '../VirtualizedList';
import styles from './PropertyGrid.module.css';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  error?: string | null;
  className?: string;
  onPropertyView?: (property: Property) => void;
  useVirtualization?: boolean;
  itemHeight?: number;
  containerHeight?: number;
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
      className={`${styles.loadingSkeleton} card-luxury animate-pulse`} 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`${styles.skeletonImage} shimmer`}></div>
      <div className={styles.skeletonContent}>
        <div className={`${styles.skeletonLine} ${styles.skeletonTitle} shimmer`}></div>
        <div className={`${styles.skeletonLine} ${styles.skeletonSubtitle} shimmer`}></div>
        <div className={`${styles.skeletonLine} ${styles.skeletonPrice} shimmer`}></div>
        <div className={styles.skeletonActions}>
          <div className={`${styles.skeletonLine} ${styles.skeletonAction} shimmer`}></div>
          <div className={`${styles.skeletonLine} ${styles.skeletonButton} shimmer`}></div>
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className={styles.errorState}>
      <div className={`${styles.errorContent} glass-strong`}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3 className={styles.errorTitle}>Something went wrong</h3>
        <p className={styles.errorMessage}>{error}</p>
        <button className={`btn-secondary ${styles.retryBtn}`} onClick={() => window.location.reload()}>
          🔄 Try Again
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className={styles.emptyState}>
      <div className={`${styles.emptyContent} glass-strong`}>
        <div className={styles.emptyIcon}>🏘️</div>
        <h3 className={`${styles.emptyTitle} text-luxury`}>No Properties Found</h3>
        <p className={styles.emptyMessage}>
          We couldn't find any properties matching your search criteria. 
          Try adjusting your filters or search terms.
        </p>
        <div className={styles.emptySuggestions}>
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
      <div className={`${styles.propertyGrid} ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <LoadingSkeleton key={index} delay={index * 150} />
        ))}
        
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className={styles.gridContainer}>
        <EmptyState />
        
      </div>
    );
  }

  return (
    <div className={`${styles.propertyGrid} ${className}`}>
      {properties.map((property, index) => (
        <LuxuryPropertyCard
          key={property.idProperty}
          property={property}
          onView={onPropertyView}
          className={`animate-fade-scale`}
          style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;