import { render, screen } from '@testing-library/react'
import { HeroNameReveal } from '../HeroNameReveal'

describe('HeroNameReveal', () => {
  it('renders the default name as the accessible h1 name', () => {
    render(<HeroNameReveal />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAccessibleName('Maximiliano Zavala')
  })

  it('renders a custom name and tagline', () => {
    render(<HeroNameReveal name="Ada Lovelace" tagline="First Programmer" />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('Ada Lovelace')
    expect(screen.getByText('First Programmer')).toBeInTheDocument()
  })

  it('hides the per-letter animation spans from assistive technology', () => {
    const { container } = render(<HeroNameReveal name="Max Zavala" />)

    const wordSpans = container.querySelectorAll('h1 > span[aria-hidden="true"]')
    expect(wordSpans).toHaveLength(2) // one per word
  })

  it('renders every letter as an individually animated span', () => {
    const { container } = render(<HeroNameReveal name="Max Zavala" />)

    const letterSpans = container.querySelectorAll('h1 .animate-rise-in')
    expect(letterSpans).toHaveLength('MaxZavala'.length)
  })

  it('staggers letters with increasing animation delays', () => {
    const { container } = render(<HeroNameReveal name="Max" />)

    const letterSpans = Array.from(
      container.querySelectorAll<HTMLSpanElement>('h1 .animate-rise-in')
    )
    const delays = letterSpans.map((span) => parseFloat(span.style.animationDelay))

    expect(delays).toHaveLength(3)
    expect(delays[1]).toBeGreaterThan(delays[0] ?? 0)
    expect(delays[2]).toBeGreaterThan(delays[1] ?? 0)
  })

  it('renders the tagline text visibly in the server HTML', () => {
    render(<HeroNameReveal />)

    // CSS-animated content must exist in the DOM immediately (no JS gating)
    expect(screen.getByText('Software Engineer | AI Enthusiast')).toBeInTheDocument()
  })

  it('marks the scroll indicator as decorative', () => {
    const { container } = render(<HeroNameReveal />)

    const svg = container.querySelector('svg')
    expect(svg?.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
