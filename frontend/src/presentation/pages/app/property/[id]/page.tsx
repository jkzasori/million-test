'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/presentation/components/luxury/Header';
import Footer from '@/presentation/components/luxury/Footer';
import PropertyDetail from '@/presentation/components/luxury/PropertyDetail';
import { PropertyDetailDto } from '@/types/property';
import { propertyService, ApiError } from '@/services/api';
import styles from './page.module.css';

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
            <div className={styles.errorContainer}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                className={styles.errorIcon}
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
              <h1 className={styles.errorTitle}>Something went wrong</h1>
              <p className={styles.errorMessage}>{error}</p>
              <Link href="/" className="btn-primary">
                Back to Properties
              </Link>
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
      
    </div>
  );
}