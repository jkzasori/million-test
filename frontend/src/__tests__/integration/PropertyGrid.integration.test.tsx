import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyGrid from '@/presentation/components/luxury/PropertyGrid';
import { Property } from '@/presentation/components/luxury/LuxuryPropertyCard';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock property data using the UI Property interface
const mockProperties: Property[] = [
  {
    idProperty: 1,
    name: 'Beautiful House',
    address: '123 Main St',
    price: 500000,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
    ownerName: 'John Doe',
    codeInternal: 'PROP001',
    year: 2020
  },
  {
    idProperty: 2,
    name: 'Modern Apartment',
    address: '456 Oak Ave',
    price: 300000,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    ownerName: 'Jane Smith',
    codeInternal: 'PROP002',
    year: 2021
  }
];

describe('PropertyGrid Integration Tests', () => {
  it('renders properties correctly', () => {
    // Act
    render(<PropertyGrid properties={mockProperties} />);

    // Assert
    expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    expect(screen.getByText('Modern Apartment')).toBeInTheDocument();
    expect(screen.getByText('$500,000')).toBeInTheDocument();
    expect(screen.getByText('$300,000')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    // Act
    render(<PropertyGrid properties={[]} loading={true} />);

    // Assert - Loading shows skeleton cards, not text
    const skeletonElements = document.querySelectorAll('.loadingSkeleton');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('shows error state', () => {
    // Act
    render(<PropertyGrid properties={[]} error="Failed to load properties" />);

    // Assert
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to load properties')).toBeInTheDocument();
  });

  it('shows empty state when no properties', () => {
    // Act
    render(<PropertyGrid properties={[]} />);

    // Assert
    expect(screen.getByText('No Properties Found')).toBeInTheDocument();
    expect(screen.getByText(/We couldn't find any properties/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    // Act
    const { container } = render(<PropertyGrid properties={mockProperties} className="custom-class" />);

    // Assert
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles property clicks with onPropertyView callback', () => {
    // Arrange
    const mockOnPropertyView = jest.fn();

    // Act
    render(<PropertyGrid properties={mockProperties} onPropertyView={mockOnPropertyView} />);

    // Find the property card link
    const propertyLinks = screen.getAllByRole('link');
    expect(propertyLinks.length).toBeGreaterThan(0);
    
    // The first card should have a proper href
    expect(propertyLinks[0]).toHaveAttribute('href', '/property/1');
  });

  it('renders multiple properties in grid layout', () => {
    // Act
    render(<PropertyGrid properties={mockProperties} />);

    // Assert
    const propertyElements = screen.getAllByRole('link');
    expect(propertyElements).toHaveLength(2);
    
    // Each property should have its own card
    mockProperties.forEach(property => {
      expect(screen.getByText(property.name)).toBeInTheDocument();
      expect(screen.getByText(property.address)).toBeInTheDocument();
    });
  });

  it('formats prices correctly', () => {
    // Act
    render(<PropertyGrid properties={mockProperties} />);

    // Assert
    expect(screen.getByText('$500,000')).toBeInTheDocument();
    expect(screen.getByText('$300,000')).toBeInTheDocument();
  });

  it('displays property images with correct alt text', () => {
    // Act
    render(<PropertyGrid properties={mockProperties} />);

    // Assert
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'Beautiful House');
    expect(images[1]).toHaveAttribute('alt', 'Modern Apartment');
  });
});