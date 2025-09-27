import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './LuxuryPropertyCard.module.css';

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
    <div className={`${styles.professionalPropertyCard} ${className}`} style={style} onClick={handleView}>
      {/* Image Section */}
      <div className={styles.cardImageContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src={property.image}
            alt={property.name}
            fill
            className={styles.propertyImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Category Badge */}
        <div className={`${styles.categoryBadge} ${styles[categoryBadge.color]}`}>
          {categoryBadge.label}
        </div>
        
        {/* Year Badge */}
        <div className={styles.yearBadge}>
          {property.year}
        </div>
        
        {/* Action Buttons */}
        <div className={styles.cardActions}>
          <button 
            className={`${styles.actionBtn} ${styles.favoriteBtn}`} 
            onClick={handleFavorite}
            title="Add to favorites"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button 
            className={`${styles.actionBtn} ${styles.shareBtn}`} 
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
      <div className={styles.cardContent}>
        {/* Property Header */}
        <div className={styles.propertyHeader}>
          <h3 className={styles.propertyName} title={property.name}>{property.name}</h3>
          <span className={styles.propertyCode}>#{property.codeInternal}</span>
        </div>

        {/* Property Address */}
        <div className={styles.propertyAddress}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={styles.locationIcon}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className={styles.addressText} title={property.address}>{property.address}</span>
        </div>

        {/* Property Owner */}
        <div className={styles.propertyOwner}>
          <span className={styles.ownerLabel}>Listed by:</span>
          <span className={styles.ownerName}>{property.ownerName}</span>
        </div>

        {/* Price Section */}
        <div className={styles.priceSection}>
          <div className={styles.priceMain}>
            <span className={styles.priceValue}>{formatPrice(property.price)}</span>
            <span className={styles.priceFull}>${property.price.toLocaleString()}</span>
          </div>
        </div>

        {/* View Button */}
        <Link href={`/property/${property.idProperty}`} className={styles.viewDetailsBtn}>
          View Details
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

    </div>
  );
};

export default LuxuryPropertyCard;