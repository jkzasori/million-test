'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PropertyDto } from '@/types/property';

interface PropertyCardProps {
  property: PropertyDto;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatAddress = (address: string) => {
    return address.length > 50 ? `${address.substring(0, 50)}...` : address;
  };

  const formatName = (name: string) => {
    return name.length > 30 ? `${name.substring(0, 30)}...` : name;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {property.image ? (
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-gray-400 text-center">
              <svg
                className="mx-auto h-12 w-12 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                />
              </svg>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1" title={property.name}>
            {formatName(property.name)}
          </h3>
          <p className="text-gray-600 text-sm" title={property.address}>
            📍 {formatAddress(property.address)}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-2xl font-bold text-green-600">
            {formatPrice(property.price)}
          </p>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>Year: {property.year}</span>
          <span>ID: {property.codeInternal}</span>
        </div>

        {property.ownerName && (
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-medium">Owner:</span> {property.ownerName}
          </div>
        )}

        <Link
          href={`/properties/${property.idProperty}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md font-medium transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}