import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropertyDetailDto } from '@/types/property';

interface PropertyDetailProps {
  property: PropertyDetailDto;
  loading?: boolean;
  className?: string;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({
  property,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`property-detail-loading ${className}`}>
        <div className="loading-shimmer"></div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const mainImage = property.images?.find(img => img.enabled) || property.images?.[0];
  const additionalImages = property.images?.filter(img => img.enabled && img !== mainImage) || [];

  return (
    <div className={`luxury-property-detail ${className}`}>
      {/* Header Section */}
      <div className="property-header">
        <div className="header-content">
          <div className="breadcrumb">
            <Link href="/" className="breadcrumb-link">Properties</Link>
            <span className="breadcrumb-separator"></span>
            <span className="breadcrumb-current">{property.name}</span>
          </div>
          
          <h1 className="property-title">{property.name}</h1>
          
          <div className="property-meta">
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="meta-icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{property.address}</span>
            </div>
            
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="meta-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Built in {property.year}</span>
            </div>
            
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="meta-icon">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Code: {property.codeInternal}</span>
            </div>
          </div>
          
          <div className="property-price">
            <span className="price-label">Price</span>
            <span className="price-value">{formatPrice(property.price)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="property-content">
        {/* Images Section */}
        <div className="images-section">
          {mainImage && (
            <div className="main-image-container">
              <Image
                src={mainImage.file || '/placeholder-property.jpg'}
                alt={property.name}
                width={800}
                height={500}
                className="main-image"
                priority
              />
            </div>
          )}
          
          {additionalImages.length > 0 && (
            <div className="image-gallery">
              <h3 className="gallery-title">Additional Images</h3>
              <div className="gallery-grid">
                {additionalImages.slice(0, 6).map((image) => (
                  <div key={image.idPropertyImage} className="gallery-item">
                    <Image
                      src={image.file || '/placeholder-property.jpg'}
                      alt={`${property.name} - Image ${image.idPropertyImage}`}
                      width={200}
                      height={150}
                      className="gallery-image"
                    />
                  </div>
                ))}
                {additionalImages.length > 6 && (
                  <div className="gallery-item gallery-more">
                    <span>+{additionalImages.length - 6} more</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="details-section">
          <div className="details-grid">
            {/* Owner Information */}
            {property.owner && (
              <div className="detail-card">
                <h3 className="detail-title">Property Owner</h3>
                <div className="owner-info">
                  {property.owner.photo && (
                    <div className="owner-photo">
                      <Image
                        src={property.owner.photo}
                        alt={property.owner.name}
                        width={60}
                        height={60}
                        className="owner-image"
                      />
                    </div>
                  )}
                  <div className="owner-details">
                    <h4 className="owner-name">{property.owner.name}</h4>
                    <p className="owner-address">{property.owner.address}</p>
                    {property.owner.birthday && (
                      <p className="owner-birthday">
                        Born: {formatDate(property.owner.birthday)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Property Traces */}
            {property.traces && property.traces.length > 0 && (
              <div className="detail-card">
                <h3 className="detail-title">Transaction History</h3>
                <div className="traces-list">
                  {property.traces.map((trace) => (
                    <div key={trace.idPropertyTrace} className="trace-item">
                      <div className="trace-header">
                        <h4 className="trace-name">{trace.name}</h4>
                        <span className="trace-date">{formatDate(trace.dateSale)}</span>
                      </div>
                      <div className="trace-details">
                        <div className="trace-value">
                          <span className="label">Value:</span>
                          <span className="value">{formatPrice(trace.value)}</span>
                        </div>
                        <div className="trace-tax">
                          <span className="label">Tax:</span>
                          <span className="value">{formatPrice(trace.tax)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="property-actions">
        <Link href="/" className="btn-secondary">
          Back to Properties
        </Link>
        <button className="btn-primary" onClick={() => window.print()}>
          Print Details
        </button>
      </div>
    </div>
  );
};

export default PropertyDetail;