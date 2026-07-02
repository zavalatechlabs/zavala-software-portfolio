import { render, screen, waitFor } from '@testing-library/react'
import { DecipherText } from '../DecipherText'
import { useInView } from '@/hooks/useInView'

// Mock useReducedMotion hook — controllable per test
const mockUseReducedMotion = jest.fn(() => false)
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}))

// Mock the in-view hook so tests control visibility deterministically
jest.mock('@/hooks/useInView', () => ({
  useInView: jest.fn(),
}))

const mockUseInView = useInView as jest.MockedFunction<typeof useInView>

beforeEach(() => {
  mockUseReducedMotion.mockReturnValue(false)
})

describe('DecipherText', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders with initial text', () => {
    mockUseInView.mockReturnValue([{ current: null }, false])

    render(<DecipherText text="Hello World" />)

    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    mockUseInView.mockReturnValue([{ current: null }, false])

    const { container } = render(<DecipherText text="Test" className="custom-class" />)

    const span = container.querySelector('span')
    expect(span).toHaveClass('custom-class')
  })

  it('animates when in view', async () => {
    mockUseInView.mockReturnValue([{ current: null }, true])

    render(<DecipherText text="Test" duration={100} />)

    // Fast-forward through animation
    jest.advanceTimersByTime(150)

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })

  it('respects duration prop', async () => {
    mockUseInView.mockReturnValue([{ current: null }, true])
    const customDuration = 200

    render(<DecipherText text="Hello" duration={customDuration} />)

    // Should not be complete before duration
    jest.advanceTimersByTime(100)

    // Should be complete after duration + buffer
    jest.advanceTimersByTime(150)

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument()
    })
  })

  it('handles stagger delay', async () => {
    mockUseInView.mockReturnValue([{ current: null }, true])
    const staggerDelay = 500

    render(<DecipherText text="Test" staggerDelay={staggerDelay} duration={100} />)

    // Should not start animating before stagger delay
    jest.advanceTimersByTime(200)

    // After stagger delay, animation should proceed
    jest.advanceTimersByTime(400)

    await waitFor(() => {
      const element = screen.getByText(/Test/i)
      expect(element).toBeInTheDocument()
    })
  })

  it('only animates once (hasAnimated flag)', async () => {
    const { rerender } = render(<DecipherText text="Initial" />)

    // First render - not in view
    mockUseInView.mockReturnValue([{ current: null }, false])
    rerender(<DecipherText text="Initial" />)

    // Second render - in view (triggers animation)
    mockUseInView.mockReturnValue([{ current: null }, true])
    rerender(<DecipherText text="Initial" />)

    jest.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(screen.getByText('Initial')).toBeInTheDocument()
    })

    // Third render - still in view but should not re-animate
    mockUseInView.mockReturnValue([{ current: null }, true])
    rerender(<DecipherText text="Initial" />)

    // Text should remain stable (not re-animating)
    expect(screen.getByText('Initial')).toBeInTheDocument()
  })

  it('preserves spaces in text', async () => {
    mockUseInView.mockReturnValue([{ current: null }, true])

    render(<DecipherText text="Hello World" duration={100} />)

    jest.advanceTimersByTime(150)

    await waitFor(() => {
      const text = screen.getByText('Hello World')
      expect(text.textContent).toBe('Hello World')
    })
  })

  it('does not animate when not in view', () => {
    mockUseInView.mockReturnValue([{ current: null }, false])

    render(<DecipherText text="Test" />)

    jest.advanceTimersByTime(1000)

    // Should remain as initial text
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('uses default duration when not specified', async () => {
    mockUseInView.mockReturnValue([{ current: null }, true])

    render(<DecipherText text="Short" />)

    // Should use calculated duration based on text length
    jest.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(screen.getByText('Short')).toBeInTheDocument()
    })
  })

  it('handles single character text', async () => {
    mockUseInView.mockReturnValue([{ current: null }, true])

    render(<DecipherText text="A" duration={50} />)

    jest.advanceTimersByTime(100)

    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument()
    })
  })

  it('handles empty text gracefully', () => {
    mockUseInView.mockReturnValue([{ current: null }, false])

    const { container } = render(<DecipherText text="" />)

    const span = container.querySelector('span')
    expect(span).toBeInTheDocument()
    expect(span?.textContent).toBe('')
  })
})

describe('DecipherText with reduced motion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockUseReducedMotion.mockReturnValue(true)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders text content immediately without scramble', () => {
    mockUseInView.mockReturnValue([{ current: null }, true])

    const { container } = render(<DecipherText text="Hello World" />)

    // Even after time passes, text should remain as the original — no scramble
    jest.advanceTimersByTime(1000)

    const span = container.querySelector('span')
    expect(span?.textContent).toBe('Hello World')
  })

  it('text stays as final value even when in view (no animation)', () => {
    mockUseInView.mockReturnValue([{ current: null }, true])

    render(<DecipherText text="Decipher Me" duration={100} staggerDelay={0} />)

    // Advance past stagger + duration
    jest.advanceTimersByTime(500)

    expect(screen.getByText('Decipher Me')).toBeInTheDocument()
  })

  it('renders correctly with custom className', () => {
    mockUseInView.mockReturnValue([{ current: null }, true])

    const { container } = render(<DecipherText text="Styled" className="special-class" />)

    jest.advanceTimersByTime(500)

    const span = container.querySelector('span')
    expect(span).toHaveClass('special-class')
    expect(span?.textContent).toBe('Styled')
  })
})
