'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/presentation/components/luxury/Header';
import Footer from '@/presentation/components/luxury/Footer';
import PropertyDetail from '@/presentation/components/luxury/PropertyDetail';
import { useProperty } from '@/presentation/hooks/useProperty';
import { Property } from '@/domain/entities/Property';
import styles from './page.module.css';

export default function PropertyDetailPage() {
  const params = useParams();
  
  const id = parseInt(params.id as string);
  if (isNaN(id)) {
    notFound();
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { property, loading, error } = useProperty(id);

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
            property={{} as Property} 
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