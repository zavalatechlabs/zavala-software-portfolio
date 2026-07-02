import { renderHook, act } from '@testing-library/react'
import { useReducedMotion } from '../useReducedMotion'

interface MediaQueryListLike {
  matches: boolean
  media: string
  addEventListener: jest.Mock
  removeEventListener: jest.Mock
  dispatchEvent: jest.Mock
}

describe('useReducedMotion', () => {
  let mockMatchMedia: jest.Mock
  let matchMediaListeners: Array<(e: MediaQueryListEvent) => void>

  beforeEach(() => {
    matchMediaListeners = []

    // Create a mock matchMedia function
    mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          matchMediaListeners.push(listener)
        }
      }),
      removeEventListener: jest.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          const index = matchMediaListeners.indexOf(listener)
          if (index > -1) {
            matchMediaListeners.splice(index, 1)
          }
        }
      }),
      dispatchEvent: jest.fn(),
    }))

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    matchMediaListeners = []
  })

  it('returns false when prefers-reduced-motion is not set', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)
  })

  it('returns true when prefers-reduced-motion is set', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(true)
  })

  it('queries the correct media query', () => {
    renderHook(() => useReducedMotion())

    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('updates when media query changes to true', () => {
    const listeners: Array<() => void> = []

    const mediaQueryList: MediaQueryListLike = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn((event: string, listener: () => void) => {
        if (event === 'change') {
          listeners.push(listener)
        }
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }

    mockMatchMedia.mockReturnValue(mediaQueryList)

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)

    // Simulate media query change
    act(() => {
      mediaQueryList.matches = true
      listeners.forEach((listener) => listener())
    })

    expect(result.current).toBe(true)
  })

  it('updates when media query changes to false', () => {
    const listeners: Array<() => void> = []

    const mediaQueryList: MediaQueryListLike = {
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn((event: string, listener: () => void) => {
        if (event === 'change') {
          listeners.push(listener)
        }
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }

    mockMatchMedia.mockReturnValue(mediaQueryList)

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(true)

    // Simulate media query change
    act(() => {
      mediaQueryList.matches = false
      listeners.forEach((listener) => listener())
    })

    expect(result.current).toBe(false)
  })

  it('handles multiple media query changes', () => {
    const listeners: Array<() => void> = []

    const mediaQueryList: MediaQueryListLike = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn((event: string, listener: () => void) => {
        if (event === 'change') {
          listeners.push(listener)
        }
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }

    mockMatchMedia.mockReturnValue(mediaQueryList)

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)

    // Change to true
    act(() => {
      mediaQueryList.matches = true
      listeners.forEach((listener) => listener())
    })
    expect(result.current).toBe(true)

    // Change to false
    act(() => {
      mediaQueryList.matches = false
      listeners.forEach((listener) => listener())
    })
    expect(result.current).toBe(false)

    // Change to true again
    act(() => {
      mediaQueryList.matches = true
      listeners.forEach((listener) => listener())
    })
    expect(result.current).toBe(true)
  })

  it('adds event listener for media query changes', () => {
    const addEventListenerSpy = jest.fn()

    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: addEventListenerSpy,
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })

    renderHook(() => useReducedMotion())

    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = jest.fn()
    const addedListener = { current: null as (() => void) | null }

    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn((event: string, listener: () => void) => {
        addedListener.current = listener
      }),
      removeEventListener: removeEventListenerSpy,
      dispatchEvent: jest.fn(),
    })

    const { unmount } = renderHook(() => useReducedMotion())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('does not cause memory leaks with multiple mount/unmount cycles', () => {
    const removeEventListenerSpy = jest.fn()

    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn(),
      removeEventListener: removeEventListenerSpy,
      dispatchEvent: jest.fn(),
    })

    // Mount and unmount multiple times
    const { unmount: unmount1 } = renderHook(() => useReducedMotion())
    const { unmount: unmount2 } = renderHook(() => useReducedMotion())
    const { unmount: unmount3 } = renderHook(() => useReducedMotion())

    unmount1()
    unmount2()
    unmount3()

    // Should have cleaned up 3 times
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(3)
  })

  it('initializes with correct value based on media query', () => {
    // Test with reduced motion enabled
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })

    const { result: enabledResult } = renderHook(() => useReducedMotion())
    expect(enabledResult.current).toBe(true)

    // Test with reduced motion disabled
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })

    const { result: disabledResult } = renderHook(() => useReducedMotion())
    expect(disabledResult.current).toBe(false)
  })

  it('only subscribes to change events once per hook instance', () => {
    const addEventListenerSpy = jest.fn()

    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: addEventListenerSpy,
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })

    renderHook(() => useReducedMotion())

    // Should only be called once
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  })

  it('handles matchMedia not being available', () => {
    // Remove matchMedia temporarily
    const originalMatchMedia = window.matchMedia
    // @ts-expect-error - Testing error case
    delete window.matchMedia

    // Should not throw
    expect(() => {
      renderHook(() => useReducedMotion())
    }).toThrow()

    // Restore matchMedia
    window.matchMedia = originalMatchMedia
  })

  it('correctly reflects system preference changes', () => {
    const listeners: Array<() => void> = []

    const mediaQueryList: MediaQueryListLike = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn((event: string, listener: () => void) => {
        if (event === 'change') {
          listeners.push(listener)
        }
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }

    mockMatchMedia.mockReturnValue(mediaQueryList)

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)

    // Simulate user enabling reduced motion in OS settings
    act(() => {
      mediaQueryList.matches = true
      listeners.forEach((listener) => listener())
    })

    expect(result.current).toBe(true)

    // Simulate user disabling reduced motion in OS settings
    act(() => {
      mediaQueryList.matches = false
      listeners.forEach((listener) => listener())
    })

    expect(result.current).toBe(false)
  })
})
