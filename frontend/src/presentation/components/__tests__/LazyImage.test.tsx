import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { LazyImage } from '../LazyImage'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
})

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
})

describe('LazyImage', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
  }

  beforeEach(() => {
    mockIntersectionObserver.mockClear()
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    })
  })

  it('should render with placeholder initially', () => {
    render(<LazyImage {...defaultProps} />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Test image')
    expect(img).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'))
  })

  it('should set up IntersectionObserver on mount', () => {
    render(<LazyImage {...defaultProps} />)
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.1,
        rootMargin: '50px'
      })
    )
  })

  it('should observe the image element', () => {
    const mockObserve = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    })

    render(<LazyImage {...defaultProps} />)
    
    expect(mockObserve).toHaveBeenCalled()
  })

  it('should load actual image when in view', async () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      }
    })

    render(<LazyImage {...defaultProps} />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'))

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
    } as IntersectionObserverEntry

    intersectionCallback!([mockEntry])

    await waitFor(() => {
      expect(img).toHaveAttribute('src', defaultProps.src)
    })
  })

  it('should call onLoad when image loads successfully', async () => {
    const mockOnLoad = jest.fn()
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      }
    })

    render(<LazyImage {...defaultProps} onLoad={mockOnLoad} />)
    
    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
    } as IntersectionObserverEntry

    intersectionCallback!([mockEntry])

    const img = screen.getByRole('img')
    
    // Simulate image load
    img.dispatchEvent(new Event('load'))

    expect(mockOnLoad).toHaveBeenCalled()
  })

  it('should call onError when image fails to load', async () => {
    const mockOnError = jest.fn()
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      }
    })

    render(<LazyImage {...defaultProps} onError={mockOnError} />)
    
    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
    } as IntersectionObserverEntry

    intersectionCallback!([mockEntry])

    const img = screen.getByRole('img')
    
    // Simulate image error
    img.dispatchEvent(new Event('error'))

    expect(mockOnError).toHaveBeenCalled()
  })

  it('should show loading spinner when image is loading', async () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      }
    })

    render(<LazyImage {...defaultProps} />)
    
    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
    } as IntersectionObserverEntry

    intersectionCallback!([mockEntry])

    // Loading spinner should appear
    await waitFor(() => {
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
    })
  })

  it('should show error state when image fails to load', async () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      }
    })

    render(<LazyImage {...defaultProps} />)
    
    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
    } as IntersectionObserverEntry

    intersectionCallback!([mockEntry])

    const img = screen.getByRole('img')
    
    // Simulate image error
    img.dispatchEvent(new Event('error'))

    await waitFor(() => {
      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
    })
  })

  it('should apply custom className', () => {
    const customClass = 'custom-image-class'
    render(<LazyImage {...defaultProps} className={customClass} />)
    
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass(customClass)
  })

  it('should use custom placeholder', () => {
    const customPlaceholder = 'custom-placeholder.jpg'
    render(<LazyImage {...defaultProps} placeholder={customPlaceholder} />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', customPlaceholder)
  })

  it('should cleanup observer on unmount', () => {
    const mockDisconnect = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
    })

    const { unmount } = render(<LazyImage {...defaultProps} />)
    
    unmount()
    
    expect(mockDisconnect).toHaveBeenCalled()
  })
})