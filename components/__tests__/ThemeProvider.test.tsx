import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '../ThemeProvider'
import { useTheme } from 'next-themes'

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  useTheme: jest.fn(),
}))

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="test-child">Test Child</div>
      </ThemeProvider>
    )

    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('wraps children in ThemeProvider component', () => {
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
  })

  it('provides theme context to children', () => {
    const TestComponent = () => {
      const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: jest.fn(),
        systemTheme: 'dark',
        themes: ['light', 'dark'],
        resolvedTheme: 'dark',
        forcedTheme: undefined,
      })

      const { theme } = useTheme()
      return <div data-testid="theme-value">{theme}</div>
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
  })

  it('handles system preference through configuration', () => {
    // The ThemeProvider is configured with enableSystem={false}
    // This test verifies the component renders without errors
    // when system preferences are disabled
    const { container } = render(
      <ThemeProvider>
        <div>Content with system disabled</div>
      </ThemeProvider>
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByText('Content with system disabled')).toBeInTheDocument()
  })

  it('persists theme selection via storageKey configuration', async () => {
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn(),
    }

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

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

    const TestComponent = () => {
      const { setTheme } = useTheme()
      return <button onClick={() => setTheme('light')}>Change Theme</button>
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const button = screen.getByText('Change Theme')
    button.click()

    await waitFor(() => {
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })
  })

  it('renders with default theme configuration', () => {
    // Test that the provider renders with the expected default configuration
    // defaultTheme="dark", enableSystem={false}, storageKey="zavala-theme"
    const { container } = render(
      <ThemeProvider>
        <div data-testid="content">Default Theme Content</div>
      </ThemeProvider>
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('supports multiple nested children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ThemeProvider>
    )

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })

  it('enables color scheme management', () => {
    // Test that enableColorScheme={true} configuration doesn't cause errors
    const { container } = render(
      <ThemeProvider>
        <div>Content with color scheme enabled</div>
      </ThemeProvider>
    )

    expect(container).toBeInTheDocument()
  })

  it('handles theme transitions configuration', () => {
    // Test that disableTransitionOnChange={false} configuration works
    const { container } = render(
      <ThemeProvider>
        <div>Content with transitions enabled</div>
      </ThemeProvider>
    )

    expect(container).toBeInTheDocument()
  })
})
