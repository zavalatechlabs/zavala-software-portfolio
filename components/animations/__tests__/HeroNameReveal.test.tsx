import { render, screen } from '@testing-library/react'
import { HeroNameReveal } from '../HeroNameReveal'
import { motion } from 'framer-motion'

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: {
      h1: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <h1 ref={ref} {...props}>{children}</h1>
      )),
      p: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <p ref={ref} {...props}>{children}</p>
      )),
      div: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <div ref={ref} {...props}>{children}</div>
      )),
      span: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <span ref={ref} {...props}>{children}</span>
      )),
    },
  }
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
