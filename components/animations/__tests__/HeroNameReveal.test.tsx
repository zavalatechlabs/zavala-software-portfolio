import React from 'react'
import { render, screen } from '@testing-library/react'
import { HeroNameReveal } from '../HeroNameReveal'

// Mock useReducedMotion hook — controllable per test
const mockUseReducedMotion = jest.fn(() => false)
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}))

// Mock framer-motion — forward motion props as data attributes for inspection
jest.mock('framer-motion', () => {
  const ReactMod = jest.requireActual<typeof import('react')>('react')

  /* eslint-disable @typescript-eslint/no-explicit-any */
  function extractMotionProps(props: Record<string, any>) {
    const { variants, initial, animate, transition, children, ...rest } = props
    const dataAttrs: Record<string, string> = {}
    if (variants !== undefined) dataAttrs['data-variants'] = JSON.stringify(variants)
    if (initial !== undefined) dataAttrs['data-initial'] = JSON.stringify(initial)
    if (animate !== undefined) dataAttrs['data-animate'] = JSON.stringify(animate)
    if (transition !== undefined) dataAttrs['data-transition'] = JSON.stringify(transition)
    return { dataAttrs, rest, children }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const MotionH1 = ReactMod.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
  >((props, ref) => {
    const { dataAttrs, rest, children } = extractMotionProps(props as Record<string, unknown>)
    return (
      <h1 ref={ref} {...dataAttrs} {...rest}>
        {children}
      </h1>
    )
  })
  MotionH1.displayName = 'MockMotionH1'

  const MotionP = ReactMod.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
  >((props, ref) => {
    const { dataAttrs, rest, children } = extractMotionProps(props as Record<string, unknown>)
    return (
      <p ref={ref} {...dataAttrs} {...rest}>
        {children}
      </p>
    )
  })
  MotionP.displayName = 'MockMotionP'

  const MotionDiv = ReactMod.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    (props, ref) => {
      const { dataAttrs, rest, children } = extractMotionProps(props as Record<string, unknown>)
      return (
        <div ref={ref} {...dataAttrs} {...rest}>
          {children}
        </div>
      )
    }
  )
  MotionDiv.displayName = 'MockMotionDiv'

  const MotionSpan = ReactMod.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    (props, ref) => {
      const { dataAttrs, rest, children } = extractMotionProps(props as Record<string, unknown>)
      return (
        <span ref={ref} {...dataAttrs} {...rest}>
          {children}
        </span>
      )
    }
  )
  MotionSpan.displayName = 'MockMotionSpan'

  return {
    motion: {
      h1: MotionH1,
      p: MotionP,
      div: MotionDiv,
      span: MotionSpan,
    },
  }
})

beforeEach(() => {
  mockUseReducedMotion.mockReturnValue(false)
})

describe('HeroNameReveal', () => {
  it('renders name correctly with default props', () => {
    const { container } = render(<HeroNameReveal />)

    const h1 = container.querySelector('h1')
    expect(h1).toBeInTheDocument()
    expect(h1?.textContent).toContain('Maximiliano')
    expect(h1?.textContent).toContain('Zavala')
  })

  it('renders custom name when provided', () => {
    const { container } = render(<HeroNameReveal name="John Doe" />)

    const h1 = container.querySelector('h1')
    expect(h1).toBeInTheDocument()
    expect(h1?.textContent).toContain('John')
    expect(h1?.textContent).toContain('Doe')
  })

  it('splits words for proper wrapping', () => {
    const { container } = render(<HeroNameReveal name="First Second Third" />)

    // Each word should be in its own span with whitespace-nowrap
    const wordSpans = container.querySelectorAll('span.whitespace-nowrap')
    expect(wordSpans.length).toBe(3)
  })

  it('renders each letter as individual span for animation', () => {
    const { container } = render(<HeroNameReveal name="Test" />)

    // Count individual letter spans (4 letters in "Test")
    const letterSpans = container.querySelectorAll('span.inline-block')

    // Should have at least 4 letter spans
    expect(letterSpans.length).toBeGreaterThanOrEqual(4)
  })

  it('applies correct spacing between words', () => {
    const { container } = render(<HeroNameReveal name="First Second" />)

    const wordSpans = container.querySelectorAll('span.whitespace-nowrap')

    // First word should have margin
    const firstWord = wordSpans[0] as HTMLElement
    expect(firstWord.style.marginRight).toBe('0.25em')

    // Last word should not have margin
    const lastWord = wordSpans[1] as HTMLElement
    expect(lastWord.style.marginRight).toBe('0px')
  })

  it('shows default tagline when not provided', () => {
    render(<HeroNameReveal />)

    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument()
    expect(screen.getByText(/AI Enthusiast/i)).toBeInTheDocument()
  })

  it('shows custom tagline when provided', () => {
    render(<HeroNameReveal tagline="Full Stack Developer" />)

    expect(screen.getByText(/Full Stack Developer/i)).toBeInTheDocument()
  })

  it('renders scroll indicator svg', () => {
    const { container } = render(<HeroNameReveal />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-6', 'h-6', 'mx-auto')
  })

  it('scroll indicator has correct path element', () => {
    const { container } = render(<HeroNameReveal />)

    const path = container.querySelector('svg path')
    expect(path).toBeInTheDocument()
    expect(path).toHaveAttribute('d', 'M19 14l-7 7m0 0l-7-7m7 7V3')
  })

  it('renders with correct layout structure', () => {
    const { container } = render(<HeroNameReveal />)

    // Check for main container classes
    const mainDiv = container.querySelector('.min-h-screen')
    expect(mainDiv).toBeInTheDocument()
    expect(mainDiv).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('applies text-center class to content wrapper', () => {
    const { container } = render(<HeroNameReveal />)

    const textCenter = container.querySelector('.text-center')
    expect(textCenter).toBeInTheDocument()
  })

  it('h1 has correct styling classes', () => {
    const { container } = render(<HeroNameReveal />)

    const h1 = container.querySelector('h1')
    expect(h1).toHaveClass('text-6xl', 'md:text-8xl', 'font-bold', 'tracking-tight')
  })

  it('tagline has correct styling classes', () => {
    const { container } = render(<HeroNameReveal />)

    const tagline = container.querySelector('p')
    expect(tagline).toHaveClass('text-xl', 'md:text-2xl', 'font-medium', 'mt-6')
  })

  it('handles single word name', () => {
    const { container } = render(<HeroNameReveal name="Madonna" />)

    const h1 = container.querySelector('h1')
    expect(h1).toBeInTheDocument()
    expect(h1?.textContent).toBe('Madonna')
  })

  it('handles multi-word names (3+ words)', () => {
    const { container } = render(<HeroNameReveal name="John Paul Jones" />)

    const wordSpans = container.querySelectorAll('span.whitespace-nowrap')
    expect(wordSpans.length).toBe(3)
  })

  it('handles empty tagline', () => {
    const { container } = render(<HeroNameReveal tagline="" />)

    const tagline = container.querySelector('p')
    expect(tagline).toBeInTheDocument()
    expect(tagline?.textContent).toBe('')
  })

  it('renders motion components for animation capability', () => {
    const { container } = render(<HeroNameReveal />)

    // motion.h1, motion.p, and motion.div elements should be rendered
    const h1 = container.querySelector('h1')
    const p = container.querySelector('p')
    const motionDivs = container.querySelectorAll('div')

    expect(h1).toBeInTheDocument()
    expect(p).toBeInTheDocument()
    expect(motionDivs.length).toBeGreaterThan(0)
  })
})

describe('HeroNameReveal with reduced motion', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(true)
  })

  it('still renders name and tagline visibly', () => {
    render(<HeroNameReveal />)

    const h1 = document.querySelector('h1')
    expect(h1?.textContent).toContain('Maximiliano')
    expect(h1?.textContent).toContain('Zavala')
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument()
  })

  it('uses static variants (no opacity/y/scale changes) for letters', () => {
    const { container } = render(<HeroNameReveal name="AB" />)

    // Letter spans should use the staticVariant
    const letterSpans = container.querySelectorAll('span.inline-block[data-variants]')
    expect(letterSpans.length).toBeGreaterThanOrEqual(2)

    const variants = JSON.parse(letterSpans[0].getAttribute('data-variants') || '{}')
    // staticVariant: hidden and visible are both { opacity: 1, y: 0, scale: 1 }
    expect(variants.hidden).toEqual({ opacity: 1, y: 0, scale: 1 })
    expect(variants.visible).toEqual({ opacity: 1, y: 0, scale: 1 })
  })

  it('scroll indicator skips animation (duration 0)', () => {
    const { container } = render(<HeroNameReveal />)

    // Find the motion.div with a data-transition that has duration: 0
    const motionDivs = container.querySelectorAll('div[data-transition]')
    const hasZeroDuration = Array.from(motionDivs).some((div) => {
      const transition = JSON.parse(div.getAttribute('data-transition') || '{}')
      return transition.duration === 0
    })
    expect(hasZeroDuration).toBe(true)
  })
})
