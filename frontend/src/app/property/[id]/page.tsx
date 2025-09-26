'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Header from '@/components/luxury/Header';
import Footer from '@/components/luxury/Footer';
import PropertyDetail from '@/components/luxury/PropertyDetail';
import { PropertyDetailDto } from '@/types/property';
import { propertyService, ApiError } from '@/services/api';

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<PropertyDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const id = parseInt(params.id as string);
        if (isNaN(id)) {
          notFound();
          return;
        }

        const propertyData = await propertyService.getProperty(id);
        setProperty(propertyData);
      } catch (err) {
        console.error('Error fetching property:', err);
        if (err instanceof ApiError && err.status === 404) {
          notFound();
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load property');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="text-center">
            <div className="error-container">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                className="error-icon"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h1 className="error-title">Something went wrong</h1>
              <p className="error-message">{error}</p>
              <a href="/" className="btn-primary">
                Back to Properties
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {loading || !property ? (
          <PropertyDetail 
            property={{} as PropertyDetailDto} 
            loading={loading} 
          />
        ) : (
          <PropertyDetail 
            property={property} 
            loading={false} 
          />
        )}
      </main>

      <Footer />
      
      <style jsx>{`
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-lg);
          padding: var(--spacing-xxl);
          max-width: 500px;
          margin: 0 auto;
        }

        .error-icon {
          color: var(--color-error);
          margin-bottom: var(--spacing-md);
        }

        .error-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0;
        }

        .error-message {
          color: var(--color-text-secondary);
          text-align: center;
          font-size: 1.125rem;
          margin: 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .error-title {
            font-size: 1.75rem;
          }
          
          .error-message {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}