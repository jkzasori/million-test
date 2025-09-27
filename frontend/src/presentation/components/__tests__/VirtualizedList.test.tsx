import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { VirtualizedList } from '../VirtualizedList'

const mockItems = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  value: i * 10
}))

const TestItemRenderer = (item: typeof mockItems[0], index: number) => (
  <div data-testid={`item-${index}`}>
    {item.name} - {item.value}
  </div>
)

describe('VirtualizedList', () => {
  const defaultProps = {
    items: mockItems,
    itemHeight: 50,
    containerHeight: 300,
    renderItem: TestItemRenderer
  }

  it('should render container with correct height', () => {
    render(<VirtualizedList {...defaultProps} />)
    const container = screen.getByRole('region', { hidden: true })
    expect(container).toHaveStyle({ height: '300px' })
  })

  it('should render only visible items initially', () => {
    render(<VirtualizedList {...defaultProps} />)
    
    // Should render items within viewport + overscan
    const visibleItems = screen.getAllByTestId(/^item-/)
    expect(visibleItems.length).toBeLessThan(mockItems.length)
    expect(visibleItems.length).toBeGreaterThan(0)
  })

  it('should calculate total height correctly', () => {
    render(<VirtualizedList {...defaultProps} />)
    const innerContainer = screen.getByRole('region', { hidden: true }).firstChild as HTMLElement
    expect(innerContainer).toHaveStyle({ 
      height: `${mockItems.length * defaultProps.itemHeight}px` 
    })
  })

  it('should update visible items on scroll', () => {
    render(<VirtualizedList {...defaultProps} />)
    const container = screen.getByRole('region', { hidden: true })

    // Get initial items
    const initialItems = screen.getAllByTestId(/^item-/)
    const firstInitialItem = initialItems[0].textContent

    // Scroll down
    fireEvent.scroll(container, { target: { scrollTop: 500 } })

    // Check that different items are now visible
    const afterScrollItems = screen.getAllByTestId(/^item-/)
    const firstAfterScrollItem = afterScrollItems[0].textContent

    expect(firstAfterScrollItem).not.toBe(firstInitialItem)
  })

  it('should position items absolutely at correct offsets', () => {
    render(<VirtualizedList {...defaultProps} />)
    const items = screen.getAllByTestId(/^item-/)
    
    items.forEach((item, index) => {
      const expectedTop = index * defaultProps.itemHeight
      expect(item).toHaveStyle({
        position: 'absolute',
        top: `${expectedTop}px`,
        left: '0px',
        right: '0px',
        height: `${defaultProps.itemHeight}px`
      })
    })
  })

  it('should handle custom overscan prop', () => {
    const customOverscan = 10
    render(<VirtualizedList {...defaultProps} overscan={customOverscan} />)
    
    // With higher overscan, more items should be rendered
    const items = screen.getAllByTestId(/^item-/)
    expect(items.length).toBeGreaterThan(Math.ceil(defaultProps.containerHeight / defaultProps.itemHeight))
  })

  it('should apply custom className', () => {
    const customClass = 'custom-virtualized-list'
    render(<VirtualizedList {...defaultProps} className={customClass} />)
    const container = screen.getByRole('region', { hidden: true })
    expect(container).toHaveClass(customClass)
  })

  it('should handle empty items array', () => {
    render(<VirtualizedList {...defaultProps} items={[]} />)
    const container = screen.getByRole('region', { hidden: true })
    expect(container).toBeInTheDocument()
    expect(screen.queryByTestId(/^item-/)).not.toBeInTheDocument()
  })

  it('should handle single item', () => {
    const singleItem = [mockItems[0]]
    render(<VirtualizedList {...defaultProps} items={singleItem} />)
    expect(screen.getByTestId('item-0')).toBeInTheDocument()
    expect(screen.getAllByTestId(/^item-/)).toHaveLength(1)
  })

  it('should recalculate visible range when items change', () => {
    const { rerender } = render(<VirtualizedList {...defaultProps} />)
    
    const initialItems = screen.getAllByTestId(/^item-/)
    const newItems = mockItems.slice(0, 10)
    
    rerender(<VirtualizedList {...defaultProps} items={newItems} />)
    
    const updatedItems = screen.getAllByTestId(/^item-/)
    expect(updatedItems.length).toBeLessThanOrEqual(newItems.length)
  })
})