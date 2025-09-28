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
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock the fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

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
      tax: 25000
    }
  ]
};

const { useParams, useRouter } = require('next/navigation');

describe('PropertyDetail Integration Tests', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockFetch.mockClear();
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
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPropertyDetail,
    });

    // Act
    render(<PropertyDetailPage />);

    // Assert - Property Information
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Beautiful House' })).toBeInTheDocument();
    });

    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('$500,000')).toBeInTheDocument();
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
    expect(screen.getByText('$25,000')).toBeInTheDocument(); // Latest tax
  });

  it('handles property not found error', async () => {
    // Arrange
    (useParams as jest.Mock).mockReturnValue({ id: '999' });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Property not found' }),
    });

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/propiedad no encontrada/i)).toBeInTheDocument();
    });
  });

  it('handles server errors gracefully', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' }),
    });

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/error al cargar/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching property details', async () => {
    // Arrange
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockReturnValueOnce(delayedPromise);

    // Act
    render(<PropertyDetailPage />);

    // Assert loading state
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: async () => mockPropertyDetail,
    });

    // Assert loaded state
    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    });
  });

  it('displays property without images correctly', async () => {
    // Arrange
    const propertyWithoutImages = {
      ...mockPropertyDetail,
      images: []
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => propertyWithoutImages,
    });

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    });

    // Should show placeholder or default image
    expect(screen.getByText(/sin imágenes disponibles/i)).toBeInTheDocument();
  });

  it('displays property without transaction history correctly', async () => {
    // Arrange
    const propertyWithoutTraces = {
      ...mockPropertyDetail,
      traces: []
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => propertyWithoutTraces,
    });

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    });

    // Should show empty state for transaction history
    expect(screen.getByText(/sin historial de transacciones/i)).toBeInTheDocument();
  });

  it('formats transaction dates correctly', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPropertyDetail,
    });

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    });

    // Check for formatted dates (exact format depends on implementation)
    expect(screen.getByText(/15.*enero.*2023|15.*01.*2023|2023.*01.*15/i)).toBeInTheDocument();
    expect(screen.getByText(/20.*junio.*2023|20.*06.*2023|2023.*06.*20/i)).toBeInTheDocument();
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => propertyWithOwnerNoPhoto,
    });

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
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPropertyDetail,
    });

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    });

    // Should show tax calculations
    expect(screen.getByText('$24,000')).toBeInTheDocument(); // First transaction tax
    expect(screen.getByText('$25,000')).toBeInTheDocument(); // Second transaction tax
  });

  it('makes correct API call with property ID', async () => {
    // Arrange
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPropertyDetail,
    });

    // Act
    render(<PropertyDetailPage />);

    // Assert
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/properties/123'),
        expect.any(Object)
      );
    });
  });
});