import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../ThemeToggle'
import { useTheme } from 'next-themes'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

describe('ThemeToggle', () => {
  const mockSetTheme = jest.fn()
  const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      systemTheme: 'dark',
      themes: ['light', 'dark'],
      resolvedTheme: 'dark',
      forcedTheme: undefined,
    })
  })

  describe('Initial Render and Hydration', () => {
    it('renders placeholder button before mounting (hydration safety)', () => {
      // Before mounting, component returns a placeholder
      const { container } = render(<ThemeToggle />)
      const button = screen.getByLabelText('Toggle theme')
      
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('p-2', 'rounded-lg', 'bg-zavala-bg-surface')
    })

    it('renders actual theme toggle after mounting', async () => {
      render(<ThemeToggle />)
      
      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).toBeInTheDocument()
      })
    })
  })

  describe('Button States', () => {
    it('displays sun icon when theme is dark', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        systemTheme: 'dark',
        themes: ['light', 'dark'],
        resolvedTheme: 'dark',
        forcedTheme: undefined,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const svg = document.querySelector('svg')
        expect(svg).toBeInTheDocument()
        // Sun icon has a circle path (M16 12a4 4 0 11-8 0)
        const path = svg?.querySelector('path')
        expect(path?.getAttribute('d')).toContain('M12 3v1m0 16v1')
      })
    })

    it('displays moon icon when theme is light', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const svg = document.querySelector('svg')
        expect(svg).toBeInTheDocument()
        // Moon icon path
        const path = svg?.querySelector('path')
        expect(path?.getAttribute('d')).toContain('M20.354 15.354A9 9 0 018.646 3.646')
      })
    })

    it('toggles from dark to light theme', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        systemTheme: 'dark',
        themes: ['light', 'dark'],
        resolvedTheme: 'dark',
        forcedTheme: undefined,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        fireEvent.click(button)
      })

      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('toggles from light to dark theme', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        fireEvent.click(button)
      })

      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })
  })

  describe('Keyboard Navigation', () => {
    it('can be focused with tab key', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <button>Previous</button>
          <ThemeToggle />
        </div>
      )

      await waitFor(() => {
        expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
      })

      await user.tab()
      await user.tab()

      const themeButton = screen.getByLabelText('Toggle theme')
      expect(themeButton).toHaveFocus()
    })

    it('responds to Enter key press', async () => {
      const user = userEvent.setup()
      
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        systemTheme: 'dark',
        themes: ['light', 'dark'],
        resolvedTheme: 'dark',
        forcedTheme: undefined,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
      })

      const button = screen.getByLabelText('Toggle theme')
      button.focus()
      await user.keyboard('{Enter}')

      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('responds to Space key press', async () => {
      const user = userEvent.setup()
      
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
      })

      const button = screen.getByLabelText('Toggle theme')
      button.focus()
      await user.keyboard(' ')

      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })
  })

  describe('ARIA Attributes', () => {
    it('has proper aria-label for accessibility', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).toHaveAttribute('aria-label', 'Toggle theme')
      })
    })

    it('is a button element with proper role', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button.tagName).toBe('BUTTON')
      })
    })

    it('button is keyboard accessible', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).not.toHaveAttribute('tabindex', '-1')
      })
    })
  })

  describe('Visual Styling', () => {
    it('applies correct CSS classes', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).toHaveClass('p-2')
        expect(button).toHaveClass('rounded-lg')
        expect(button).toHaveClass('bg-zavala-bg-surface')
        expect(button).toHaveClass('hover:bg-zavala-bg-elevated')
        expect(button).toHaveClass('transition-colors')
      })
    })

    it('icon has correct styling classes', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const svg = document.querySelector('svg')
        expect(svg).toHaveClass('w-5', 'h-5', 'text-zavala-text-secondary')
      })
    })
  })

  describe('Theme Changes', () => {
    it('reflects theme changes when toggled multiple times', async () => {
      const { rerender } = render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).toBeInTheDocument()
      })

      // First toggle: dark -> light
      fireEvent.click(screen.getByLabelText('Toggle theme'))
      expect(mockSetTheme).toHaveBeenCalledWith('light')

      // Update mock to reflect new theme
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      })

      rerender(<ThemeToggle />)

      await waitFor(() => {
        // Should now show moon icon (for light theme)
        const svg = document.querySelector('svg')
        const path = svg?.querySelector('path')
        expect(path?.getAttribute('d')).toContain('M20.354')
      })

      // Second toggle: light -> dark
      fireEvent.click(screen.getByLabelText('Toggle theme'))
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('handles rapid theme toggles', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).toBeInTheDocument()
      })

      const button = screen.getByLabelText('Toggle theme')
      
      // Rapid clicks
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      // Each click should call setTheme
      expect(mockSetTheme).toHaveBeenCalledTimes(3)
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined theme gracefully', async () => {
      mockUseTheme.mockReturnValue({
        theme: undefined,
        setTheme: mockSetTheme,
        systemTheme: undefined,
        themes: ['light', 'dark'],
        resolvedTheme: undefined,
        forcedTheme: undefined,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).toBeInTheDocument()
      })

      // Should handle click even with undefined theme
      fireEvent.click(screen.getByLabelText('Toggle theme'))
      expect(mockSetTheme).toHaveBeenCalled()
    })

    it('re-renders correctly after mounting', async () => {
      const { rerender } = render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).toBeInTheDocument()
      })

      rerender(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Features', () => {
    it('provides visual feedback on hover', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).toHaveClass('hover:bg-zavala-bg-elevated')
      })
    })

    it('has transition animations', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        expect(button).toHaveClass('transition-colors')
      })
    })

    it('maintains focus after click', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByLabelText('Toggle theme')
        button.focus()
        expect(button).toHaveFocus()
        
        fireEvent.click(button)
        expect(button).toHaveFocus()
      })
    })
  })
})
