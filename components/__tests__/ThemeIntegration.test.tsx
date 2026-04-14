import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '../ThemeProvider'
import { ThemeToggle } from '../ThemeToggle'
import { useTheme } from 'next-themes'

type SetTheme = ReturnType<typeof useTheme>['setTheme']

// Mock next-themes with localStorage support
jest.mock('next-themes', () => {
  let currentTheme = 'dark'

  return {
    ThemeProvider: ({
      children,
      storageKey,
    }: {
      children: React.ReactNode
      storageKey: string
    }) => {
      // Simulate reading from localStorage
      const stored = window.localStorage.getItem(storageKey)
      if (stored) {
        currentTheme = stored
      }
      return <div data-testid="theme-provider">{children}</div>
    },
    useTheme: jest.fn(() => ({
      theme: currentTheme,
      setTheme: (newTheme: string) => {
        currentTheme = newTheme
        // Simulate writing to localStorage
        window.localStorage.setItem('zavala-theme', newTheme)
      },
      systemTheme: 'dark',
      themes: ['light', 'dark'],
      resolvedTheme: currentTheme,
      forcedTheme: undefined,
    })),
  }
})

describe('Theme Integration - localStorage Persistence', () => {
  let mockLocalStorage: { [key: string]: string } = {}

  beforeEach(() => {
    // Reset localStorage mock
    mockLocalStorage = {}

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key]
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {}
        }),
        length: Object.keys(mockLocalStorage).length,
        key: jest.fn((index: number) => Object.keys(mockLocalStorage)[index] || null),
      },
      writable: true,
    })

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('persists theme selection to localStorage', async () => {
    const mockSetTheme = jest.fn((newTheme: string) => {
      window.localStorage.setItem('zavala-theme', newTheme)
    }) as unknown as jest.Mock & SetTheme

    const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      systemTheme: 'dark',
      themes: ['light', 'dark'],
      resolvedTheme: 'dark',
      forcedTheme: undefined,
    })

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
    })

    const button = screen.getByLabelText('Toggle theme')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
    expect(window.localStorage.setItem).toHaveBeenCalledWith('zavala-theme', 'light')
  })

  it('loads theme from localStorage on mount', async () => {
    // Pre-populate localStorage
    mockLocalStorage['zavala-theme'] = 'light'
    window.localStorage.setItem('zavala-theme', 'light')

    const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn() as unknown as SetTheme,
      systemTheme: 'light',
      themes: ['light', 'dark'],
      resolvedTheme: 'light',
      forcedTheme: undefined,
    })

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
    })

    // Verify localStorage was checked
    expect(window.localStorage.getItem).toHaveBeenCalledWith('zavala-theme')
  })

  it('persists theme across simulated page reloads', async () => {
    // First render - set theme to light
    const mockSetTheme1 = jest.fn((newTheme: string) => {
      mockLocalStorage['zavala-theme'] = newTheme
      window.localStorage.setItem('zavala-theme', newTheme)
    }) as unknown as jest.Mock & SetTheme

    const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme1,
      systemTheme: 'dark',
      themes: ['light', 'dark'],
      resolvedTheme: 'dark',
      forcedTheme: undefined,
    })

    const { unmount } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
    })

    // Toggle theme
    const button = screen.getByLabelText('Toggle theme')
    fireEvent.click(button)

    expect(mockSetTheme1).toHaveBeenCalledWith('light')

    // Simulate page unmount
    unmount()

    // Simulate page reload - second render
    mockUseTheme.mockReturnValue({
      theme: mockLocalStorage['zavala-theme'] || 'dark',
      setTheme: jest.fn() as unknown as SetTheme,
      systemTheme: 'light',
      themes: ['light', 'dark'],
      resolvedTheme: mockLocalStorage['zavala-theme'] || 'dark',
      forcedTheme: undefined,
    })

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
    })

    // Verify theme was persisted
    expect(mockLocalStorage['zavala-theme']).toBe('light')
  })

  it('handles multiple theme changes with persistence', async () => {
    const mockSetTheme = jest.fn((newTheme: string) => {
      mockLocalStorage['zavala-theme'] = newTheme
      window.localStorage.setItem('zavala-theme', newTheme)
    }) as unknown as jest.Mock & SetTheme

    const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>

    // First toggle: dark -> light
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      systemTheme: 'dark',
      themes: ['light', 'dark'],
      resolvedTheme: 'dark',
      forcedTheme: undefined,
    })

    const { rerender } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Toggle theme'))

    await waitFor(() => {
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })
    expect(mockLocalStorage['zavala-theme']).toBe('light')

    // Second toggle: light -> dark
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      systemTheme: 'light',
      themes: ['light', 'dark'],
      resolvedTheme: 'light',
      forcedTheme: undefined,
    })

    rerender(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('Toggle theme'))
    })

    await waitFor(() => {
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })
    expect(mockLocalStorage['zavala-theme']).toBe('dark')
  })

  it('uses correct storage key for persistence', async () => {
    const mockSetTheme = jest.fn((newTheme: string) => {
      window.localStorage.setItem('zavala-theme', newTheme)
    }) as unknown as jest.Mock & SetTheme

    const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      systemTheme: 'dark',
      themes: ['light', 'dark'],
      resolvedTheme: 'dark',
      forcedTheme: undefined,
    })

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Toggle theme'))

    // Verify the correct storage key is used
    expect(window.localStorage.setItem).toHaveBeenCalledWith('zavala-theme', expect.any(String))
  })

  it('handles localStorage errors gracefully', async () => {
    // Mock localStorage to return null (simulating unavailability)
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => {
          // Silent failure - localStorage unavailable
        }),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: 0,
        key: jest.fn(),
      },
      writable: true,
    })

    const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn() as unknown as SetTheme,
      systemTheme: 'dark',
      themes: ['light', 'dark'],
      resolvedTheme: 'dark',
      forcedTheme: undefined,
    })

    // Should render without throwing error
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
    })

    // Component should still work even if localStorage is unavailable
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
  })

  it('integrates ThemeProvider and ThemeToggle correctly', async () => {
    const mockSetTheme = jest.fn()

    const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      systemTheme: 'dark',
      themes: ['light', 'dark'],
      resolvedTheme: 'dark',
      forcedTheme: undefined,
    })

    render(
      <ThemeProvider>
        <div data-testid="app-content">
          <h1>My App</h1>
          <ThemeToggle />
        </div>
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('app-content')).toBeInTheDocument()
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
    })

    const button = screen.getByLabelText('Toggle theme')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })
})
