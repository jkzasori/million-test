import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyDetailPage from '@/app/properties/[id]/page';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, fill, priority, sizes, ...props }: any) {
    // Don't pass Next.js specific props to img element
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock the property service
jest.mock('@/services/api', () => ({
  propertyService: {
    getProperty: jest.fn(),
  },
}));

// Mock property detail data
const mockPropertyDetail = {
  idProperty: 1,
  idOwner: 1,
  name: 'Beautiful House',
  address: '123 Main St',
  price: 500000,
  codeInternal: 'PROP001',
  year: 2020,
  image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
  owner: {
    idOwner: 1,
    name: 'John Doe',
    address: '123 Owner St',
    photo: 'https://ui-avatars.com/api/?name=John+Doe',
    birthday: '1980-01-01'
  },
  images: [
    {
      idPropertyImage: 1,
      idProperty: 1,
      file: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
      enabled: true
    },
    {
      idPropertyImage: 2,
      idProperty: 1,
      file: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      enabled: true
    }
  ],
  traces: [
    {
      idPropertyTrace: 1,
      idProperty: 1,
      dateSale: '2023-01-15T00:00:00Z',
      name: 'Venta inicial',
      value: 480000,
      tax: 24000
    },
    {
      idPropertyTrace: 2,
      idProperty: 1,
      dateSale: '2023-06-20T00:00:00Z',
      name: 'Actualización de precio',
      value: 500000,
      tax: 25001
    }
  ]
};

const { useParams, useRouter } = require('next/navigation');
const { propertyService } = require('@/services/api');

describe('PropertyDetail Integration Tests', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: jest.fn(),
    });
    (useParams as jest.Mock).mockReturnValue({
      id: '1'
    });
  });

  it('loads and displays complete property details from API', async () => {
    // Arrange
    (propertyService.getProperty as jest.Mock).mockResolvedValueOnce(mockPropertyDetail);

    // Act
    render(<PropertyDetailPage />);

    // Assert - Property Information
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Beautiful House' })).toBeInTheDocument();
    });

    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getAllByText('$500,000')).toHaveLength(2); // Main price + transaction history
    expect(screen.getByText('PROP001')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();

    // Assert - Owner Information
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('123 Owner St')).toBeInTheDocument();
    
    // Assert - Images
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(2);

    // Assert - Transaction History
    expect(screen.getByText('Venta inicial')).toBeInTheDocument();
    expect(screen.getByText('Actualización de precio')).toBeInTheDocument();
    expect(screen.getByText('$480,000')).toBeInTheDocument();
    expect(screen.getByText((content, node) => {
      return node?.textContent === 'Tax: $25,001'
    })).toBeInTheDocument(); // Latest tax
  });

  it('handles property not found error', async () => {
    // Arrange
    (useParams as jest.Mock).mockReturnValue({ id: '999' });
    (propertyService.getProperty as jest.Mock).mockRejectedValueOnce(
      new Error('Property not found')
    );

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Property Not Found/i })).toBeInTheDocument();
    });
  });

  it('handles server errors gracefully', async () => {
    // Arrange
    (propertyService.getProperty as jest.Mock).mockRejectedValueOnce(
      new Error('Internal server error')
    );

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Internal server error/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching property details', async () => {
    // Arrange
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (propertyService.getProperty as jest.Mock).mockReturnValueOnce(delayedPromise);

    // Act
    render(<PropertyDetailPage />);

    // Assert loading state - look for skeleton loading state
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!(mockPropertyDetail);

    // Assert loaded state
    await waitFor(() => {
      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Beautiful House' })).toBeInTheDocument();
    });
  });

  it('displays property without images correctly', async () => {
    // Arrange
    const propertyWithoutImages = {
      ...mockPropertyDetail,
      images: [],
      image: null // Remove fallback image too
    };

    (propertyService.getProperty as jest.Mock).mockResolvedValueOnce(propertyWithoutImages);

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Beautiful House' })).toBeInTheDocument();
    });

    // Should show placeholder when no images and no fallback image
    expect(screen.getByText(/No Image Available/i)).toBeInTheDocument();
  });

  it('displays property without transaction history correctly', async () => {
    // Arrange
    const propertyWithoutTraces = {
      ...mockPropertyDetail,
      traces: []
    };

    (propertyService.getProperty as jest.Mock).mockResolvedValueOnce(propertyWithoutTraces);

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Beautiful House' })).toBeInTheDocument();
    });

    // Transaction history section should not be rendered when traces is empty
    expect(screen.queryByText(/Transaction History/i)).not.toBeInTheDocument();
  });

  it('formats transaction dates correctly', async () => {
    // Arrange
    (propertyService.getProperty as jest.Mock).mockResolvedValueOnce(mockPropertyDetail);

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Beautiful House' })).toBeInTheDocument();
    });

    // Check for formatted dates - note timezone differences
    expect(screen.getByText(/January 14, 2023/i)).toBeInTheDocument();
    expect(screen.getByText(/June 19, 2023/i)).toBeInTheDocument();
  });

  it('displays owner information with avatar fallback', async () => {
    // Arrange
    const propertyWithOwnerNoPhoto = {
      ...mockPropertyDetail,
      owner: {
        ...mockPropertyDetail.owner,
        photo: null
      }
    };

    (propertyService.getProperty as jest.Mock).mockResolvedValueOnce(propertyWithOwnerNoPhoto);

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Should still show owner name even without photo
    expect(screen.getByText('123 Owner St')).toBeInTheDocument();
  });

  it('calculates and displays correct tax information', async () => {
    // Arrange
    (propertyService.getProperty as jest.Mock).mockResolvedValueOnce(mockPropertyDetail);

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Beautiful House' })).toBeInTheDocument();
    });

    // Should show tax calculations using flexible text matching
    expect(screen.getByText((content, node) => {
      return node?.textContent === 'Tax: $24,000'
    })).toBeInTheDocument(); // First transaction tax
    expect(screen.getByText((content, node) => {
      return node?.textContent === 'Tax: $25,001'
    })).toBeInTheDocument(); // Second transaction tax (exact amount)
  });

  it('makes correct API call with property ID', async () => {
    // Arrange
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    (propertyService.getProperty as jest.Mock).mockResolvedValueOnce(mockPropertyDetail);

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(propertyService.getProperty).toHaveBeenCalledWith(123);
    });
  });
});