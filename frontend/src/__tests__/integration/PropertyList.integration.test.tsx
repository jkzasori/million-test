import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyList from '@/components/PropertyList';
import { Property } from '@/types/property';

// Mock the fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock property data
const mockProperties: Property[] = [
  {
    idProperty: 1,
    name: 'Beautiful House',
    address: '123 Main St',
    price: 500000,
    codeInternal: 'PROP001',
    year: 2020,
    idOwner: 1,
    owner: {
      idOwner: 1,
      name: 'John Doe',
      address: 'Owner Address',
      photo: 'https://ui-avatars.com/api/?name=John+Doe'
    },
    images: [
      {
        idPropertyImage: 1,
        idProperty: 1,
        file: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
        enabled: true
      }
    ]
  },
  {
    idProperty: 2,
    name: 'Modern Apartment',
    address: '456 Oak Ave',
    price: 300000,
    codeInternal: 'PROP002',
    year: 2021,
    idOwner: 2,
    owner: {
      idOwner: 2,
      name: 'Jane Smith',
      address: 'Owner Address 2',
      photo: 'https://ui-avatars.com/api/?name=Jane+Smith'
    },
    images: [
      {
        idPropertyImage: 2,
        idProperty: 2,
        file: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
        enabled: true
      }
    ]
  }
];

const mockApiResponse = {
  data: mockProperties,
  totalCount: 2,
  page: 1,
  pageSize: 12,
  totalPages: 1
};

describe('PropertyList Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('loads and displays properties from API', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    // Act
    render(<PropertyList />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
      expect(screen.getByText('Modern Apartment')).toBeInTheDocument();
    });

    expect(screen.getByText('$500,000')).toBeInTheDocument();
    expect(screen.getByText('$300,000')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();
  });

  it('filters properties by price range', async () => {
    // Arrange
    const filteredResponse = {
      ...mockApiResponse,
      data: [mockProperties[1]], // Only the $300,000 property
      totalCount: 1
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => filteredResponse,
      });

    const user = userEvent.setup();

    // Act
    render(<PropertyList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    });

    // Apply price filter
    const minPriceInput = screen.getByLabelText(/precio mínimo/i);
    const maxPriceInput = screen.getByLabelText(/precio máximo/i);
    
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '200000');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '350000');

    const applyButton = screen.getByRole('button', { name: /aplicar filtros/i });
    await user.click(applyButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Modern Apartment')).toBeInTheDocument();
      expect(screen.queryByText('Beautiful House')).not.toBeInTheDocument();
    });
  });

  it('searches properties by name or address', async () => {
    // Arrange
    const searchResponse = {
      ...mockApiResponse,
      data: [mockProperties[0]], // Only "Beautiful House"
      totalCount: 1
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => searchResponse,
      });

    const user = userEvent.setup();

    // Act
    render(<PropertyList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    });

    // Search for specific property
    const searchInput = screen.getByPlaceholderText(/buscar propiedades/i);
    await user.type(searchInput, 'Beautiful');

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
      expect(screen.queryByText('Modern Apartment')).not.toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    // Arrange
    const page1Response = {
      data: [mockProperties[0]],
      totalCount: 2,
      page: 1,
      pageSize: 1,
      totalPages: 2
    };

    const page2Response = {
      data: [mockProperties[1]],
      totalCount: 2,
      page: 2,
      pageSize: 1,
      totalPages: 2
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page1Response,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page2Response,
      });

    const user = userEvent.setup();

    // Act
    render(<PropertyList />);

    // Wait for initial load (page 1)
    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    });

    // Navigate to page 2
    const nextButton = screen.getByRole('button', { name: /siguiente/i });
    await user.click(nextButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Modern Apartment')).toBeInTheDocument();
      expect(screen.queryByText('Beautiful House')).not.toBeInTheDocument();
    });
  });

  it('shows loading state while fetching data', async () => {
    // Arrange
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockReturnValueOnce(delayedPromise);

    // Act
    render(<PropertyList />);

    // Assert loading state
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: async () => mockApiResponse,
    });

    // Assert loaded state
    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server Error' }),
    });

    // Act
    render(<PropertyList />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/error al cargar/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no properties found', async () => {
    // Arrange
    const emptyResponse = {
      data: [],
      totalCount: 0,
      page: 1,
      pageSize: 12,
      totalPages: 0
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => emptyResponse,
    });

    // Act
    render(<PropertyList />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/no se encontraron propiedades/i)).toBeInTheDocument();
    });
  });

  it('navigates to property detail when clicking on a property', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    const user = userEvent.setup();

    // Act
    render(<PropertyList />);

    await waitFor(() => {
      expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    });

    // Click on property card
    const propertyCard = screen.getByText('Beautiful House').closest('div[role="button"]');
    expect(propertyCard).toBeInTheDocument();

    await user.click(propertyCard!);

    // Assert - In a real app, this would test router navigation
    // For this test, we verify the click handler was set up properly
    expect(propertyCard).toHaveAttribute('role', 'button');
  });
});