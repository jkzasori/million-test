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
    return address.length > 45 ? `${address.substring(0, 45)}...` : address;
  };

  const formatName = (name: string) => {
    return name.length > 25 ? `${name.substring(0, 25)}...` : name;
  };

  const getPriceCategory = (price: number) => {
    if (price >= 2000000) return { icon: '👑', label: 'Ultra Luxury', color: 'text-purple-400' };
    if (price >= 1000000) return { icon: '💎', label: 'Luxury', color: 'text-blue-400' };
    if (price >= 500000) return { icon: '⭐', label: 'Premium', color: 'text-yellow-400' };
    return { icon: '🏠', label: 'Quality', color: 'text-green-400' };
  };

  const category = getPriceCategory(property.price);

  return (
    <div className="card-luxury p-0 overflow-hidden group animate-slide-up hover:scale-[1.02] transition-all duration-500">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        {property.image ? (
          <div className="relative w-full h-full">
            <Image
              src={property.image}
              alt={property.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Featured Badge */}
            <div className="absolute top-4 right-4">
              <div className="glass px-3 py-1 rounded-full flex items-center space-x-2">
                <span className="text-lg">{category.icon}</span>
                <span className={`text-xs font-semibold ${category.color}`}>
                  {category.label}
                </span>
              </div>
            </div>

            {/* Property Code */}
            <div className="absolute top-4 left-4">
              <div className="glass px-3 py-1 rounded-full">
                <span className="text-white/80 text-xs font-mono">
                  #{property.codeInternal}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-white/10 to-white/5">
            <div className="text-white/40 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full glass-dark flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <p className="text-sm">No Image Available</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Property Details */}
        <div className="space-y-3">
          <div>
            <h3 
              className="text-xl font-bold text-white mb-2 group-hover:text-luxury transition-colors duration-300" 
              title={property.name}
            >
              {formatName(property.name)}
            </h3>
            <div className="flex items-center text-white/70 text-sm">
              <span className="mr-2">📍</span>
              <span title={property.address}>
                {formatAddress(property.address)}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="price-luxury">
            {formatPrice(property.price)}
          </div>

          {/* Property Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-white/60">
              <span>📅</span>
              <span>Built {property.year}</span>
            </div>
            {property.ownerName && (
              <div className="flex items-center space-x-1 text-white/60 text-xs">
                <span>👤</span>
                <span className="max-w-20 truncate" title={property.ownerName}>
                  {property.ownerName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href={`/properties/${property.idProperty}`}
            className="btn-luxury w-full flex items-center justify-center space-x-2 text-center group/btn"
          >
            <span>View Details</span>
            <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">
              →
            </span>
          </Link>
        </div>

        {/* Luxury Features Hint */}
        <div className="flex justify-center pt-2 border-t border-white/10">
          <div className="flex items-center space-x-3 text-xs text-white/50">
            <span title="Professional Photography">📸</span>
            <span title="Virtual Tour Available">🥽</span>
            <span title="Premium Location">🌟</span>
            <span title="Investment Grade">📈</span>
          </div>
        </div>
      </div>
    </div>
  );
}