import React from 'react';
import Image from 'next/image';

export interface Property {
  idProperty: number;
  name: string;
  address: string;
  price: number;
  image: string;
  ownerName: string;
  codeInternal: string;
  year: number;
}

interface LuxuryPropertyCardProps {
  property: Property;
  className?: string;
  onView?: (property: Property) => void;
  style?: React.CSSProperties;
}

const LuxuryPropertyCard: React.FC<LuxuryPropertyCardProps> = ({
  property,
  className = '',
  onView,
  style
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getPriceCategory = (price: number) => {
    if (price >= 5000000) return 'ultra-luxury';
    if (price >= 2000000) return 'luxury';
    if (price >= 1000000) return 'premium';
    return 'standard';
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      'ultra-luxury': { label: 'Ultra Luxury', color: 'ultra' },
      'luxury': { label: 'Luxury', color: 'luxury' },
      'premium': { label: 'Premium', color: 'premium' },
      'standard': { label: 'Featured', color: 'standard' }
    };
    return badges[category as keyof typeof badges] || { label: 'Property', color: 'standard' };
  };

  const category = getPriceCategory(property.price);
  const categoryBadge = getCategoryBadge(category);

  const handleView = () => {
    onView?.(property);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement favorite functionality
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement share functionality
  };

  return (
    <div className={`professional-property-card ${className}`} style={style} onClick={handleView}>
      {/* Image Section */}
      <div className="card-image-container">
        <div className="image-wrapper">
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="property-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Category Badge */}
        <div className={`category-badge ${categoryBadge.color}`}>
          {categoryBadge.label}
        </div>
        
        {/* Year Badge */}
        <div className="year-badge">
          {property.year}
        </div>
        
        {/* Action Buttons */}
        <div className="card-actions">
          <button 
            className="action-btn favorite-btn" 
            onClick={handleFavorite}
            title="Add to favorites"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button 
            className="action-btn share-btn" 
            onClick={handleShare}
            title="Share property"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 8a3 3 0 1 0-6 0v7.9a3 3 0 1 0 6 0V8zM12 2l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="card-content">
        {/* Property Header */}
        <div className="property-header">
          <h3 className="property-name" title={property.name}>{property.name}</h3>
          <span className="property-code">#{property.codeInternal}</span>
        </div>

        {/* Property Address */}
        <div className="property-address">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="location-icon">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="address-text" title={property.address}>{property.address}</span>
        </div>

        {/* Property Owner */}
        <div className="property-owner">
          <span className="owner-label">Listed by:</span>
          <span className="owner-name">{property.ownerName}</span>
        </div>

        {/* Price Section */}
        <div className="price-section">
          <div className="price-main">
            <span className="price-value">{formatPrice(property.price)}</span>
            <span className="price-full">${property.price.toLocaleString()}</span>
          </div>
        </div>

        {/* View Button */}
        <button className="view-details-btn" onClick={handleView}>
          View Details
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <style jsx>{`
        .professional-property-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: var(--transition-normal);
          cursor: pointer;
          border: 1px solid var(--color-border);
          position: relative;
        }

        .professional-property-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--color-accent);
        }

        .card-image-container {
          position: relative;
          height: 240px;
          overflow: hidden;
          background: var(--color-surface);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .property-image {
          object-fit: cover;
          transition: var(--transition-slow);
        }

        .professional-property-card:hover .property-image {
          transform: scale(1.05);
        }

        .category-badge {
          position: absolute;
          top: var(--spacing-md);
          left: var(--spacing-md);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .category-badge.ultra {
          background: var(--color-accent);
          color: white;
        }

        .category-badge.luxury {
          background: var(--color-primary);
          color: white;
        }

        .category-badge.premium {
          background: var(--color-success);
          color: white;
        }

        .category-badge.standard {
          background: var(--color-text-secondary);
          color: white;
        }

        .year-badge {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          background: rgba(255, 255, 255, 0.9);
          color: var(--color-text-primary);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-actions {
          position: absolute;
          bottom: var(--spacing-md);
          right: var(--spacing-md);
          display: flex;
          gap: var(--spacing-xs);
          opacity: 0;
          transform: translateY(10px);
          transition: var(--transition-normal);
        }

        .professional-property-card:hover .card-actions {
          opacity: 1;
          transform: translateY(0);
        }

        .action-btn {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }

        .action-btn:hover {
          background: white;
          color: var(--color-accent);
          transform: scale(1.1);
        }

        .card-content {
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          height: 300px; /* Increased height for better spacing */
        }

        .property-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-md);
          gap: var(--spacing-sm);
        }

        .property-name {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-primary);
          line-height: 1.3;
          flex: 1;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: help;
        }

        .property-code {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 500;
          background: var(--color-surface);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          white-space: nowrap;
        }

        .property-address {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
          color: var(--color-text-secondary);
          font-size: 0.875rem;
          min-height: 1.5rem; /* Fixed height to prevent layout shifts */
        }

        .address-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: help;
          flex: 1;
        }

        .location-icon {
          color: var(--color-accent);
          flex-shrink: 0;
        }

        .property-owner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
          font-size: 0.875rem;
          min-height: 1.25rem; /* Fixed height */
        }

        .owner-label {
          color: var(--color-text-secondary);
        }

        .owner-name {
          color: var(--color-text-primary);
          font-weight: 500;
        }

        .price-section {
          margin-bottom: auto; /* This will push the button to the bottom */
          padding: var(--spacing-md) 0;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .price-main {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .price-value {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-accent);
        }

        .price-full {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .view-details-btn {
          width: 100%;
          padding: var(--spacing-md);
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: var(--transition-normal);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
        }

        .view-details-btn:hover {
          background: var(--color-accent);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .view-details-btn svg {
          transition: var(--transition-fast);
        }

        .view-details-btn:hover svg {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .card-image-container {
            height: 200px;
          }

          .card-content {
            padding: var(--spacing-md);
          }

          .property-name {
            font-size: 1.125rem;
          }

          .price-value {
            font-size: 1.25rem;
          }

          .card-actions {
            opacity: 1;
            transform: translateY(0);
            position: static;
            justify-content: flex-end;
            margin-top: var(--spacing-sm);
          }
        }
      `}</style>
    </div>
  );
};

export default LuxuryPropertyCard;