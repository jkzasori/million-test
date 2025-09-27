import { renderHook, act } from '@testing-library/react'
import { useDebounce, useDebouncedCallback } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should delay value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })
    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(250)
    })
    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(250)
    })
    expect(result.current).toBe('updated')
  })

  it('should reset timer on new value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    rerender({ value: 'first', delay: 500 })
    act(() => {
      jest.advanceTimersByTime(250)
    })

    rerender({ value: 'second', delay: 500 })
    act(() => {
      jest.advanceTimersByTime(250)
    })
    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(250)
    })
    expect(result.current).toBe('second')
  })
})

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should delay callback execution', () => {
    const mockCallback = jest.fn()
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 500))

    act(() => {
      result.current('test')
    })

    expect(mockCallback).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(mockCallback).toHaveBeenCalledWith('test')
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should cancel previous timer on new calls', () => {
    const mockCallback = jest.fn()
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 500))

    act(() => {
      result.current('first')
    })

    act(() => {
      jest.advanceTimersByTime(250)
    })

    act(() => {
      result.current('second')
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(mockCallback).toHaveBeenCalledWith('second')
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple arguments', () => {
    const mockCallback = jest.fn()
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 500))

    act(() => {
      result.current('arg1', 'arg2', 123)
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2', 123)
  })
})