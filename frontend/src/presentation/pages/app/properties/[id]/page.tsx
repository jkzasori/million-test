'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PropertyDetailDto } from '@/types/property';
import { propertyService } from '@/services/api';

export default function PropertyDetail() {
  const params = useParams();
  const [property, setProperty] = useState<PropertyDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const propertyId = typeof params.id === 'string' ? parseInt(params.id) : null;

  useEffect(() => {
    if (!propertyId) {
      setError('Invalid property ID');
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await propertyService.getProperty(propertyId);
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

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
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600">
              <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
              <p className="mb-4">{error || 'The requested property could not be found.'}</p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                ← Back to Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayImages = property.images?.filter(img => img.enabled) || [];
  const currentImage = displayImages[selectedImageIndex]?.file || property.image;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-blue-600 hover:text-blue-500">
                Properties
              </Link>
            </li>
            <li>
              <svg
                className="flex-shrink-0 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">{property.name}</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="relative">
            <div className="relative h-96 bg-gray-200">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={property.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400 text-center">
                    <svg
                      className="mx-auto h-16 w-16 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Image thumbnails */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {displayImages.map((image, index) => (
                    <button
                      key={image.idPropertyImage}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                        index === selectedImageIndex
                          ? 'border-white'
                          : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image.file}
                        alt={`${property.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.name}
                </h1>
                <p className="text-gray-600 mb-4 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {property.address}
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Property ID</p>
                      <p className="font-semibold">{property.codeInternal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year Built</p>
                      <p className="font-semibold">{property.year}</p>
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                {property.owner && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-3">Owner Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold">{property.owner.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold">{property.owner.address}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Birthday</p>
                        <p className="font-semibold">
                          {formatDate(property.owner.birthday)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction History */}
                {property.traces && property.traces.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Transaction History</h3>
                    <div className="space-y-4">
                      {property.traces.map((trace) => (
                        <div key={trace.idPropertyTrace} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{trace.name}</p>
                              <p className="text-sm text-gray-600">
                                {formatDate(trace.dateSale)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                {formatPrice(trace.value)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Tax: {formatPrice(trace.tax)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price and Actions */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-green-600">
                      {formatPrice(property.price)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors">
                      Contact Agent
                    </button>
                    <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors">
                      Schedule Visit
                    </button>
                    <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors">
                      Save Property
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}