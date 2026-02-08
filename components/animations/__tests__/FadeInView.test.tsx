import { render, screen } from '@testing-library/react'
import { FadeInView } from '../FadeInView'
import { motion } from 'framer-motion'

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: {
      div: React.forwardRef(({ children, initial, whileInView, viewport, transition, className, ...props }: any, ref: any) => (
        <div 
          ref={ref}
          data-initial={JSON.stringify(initial)}
          data-while-in-view={JSON.stringify(whileInView)}
          data-viewport={JSON.stringify(viewport)}
          data-transition={JSON.stringify(transition)}
          className={className}
          {...props}
        >
          {children}
        </div>
      )),
    },
  }
})

describe('FadeInView', () => {
  it('renders children correctly', () => {
    render(
      <FadeInView>
        <span>Test Content</span>
      </FadeInView>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders multiple children', () => {
    render(
      <FadeInView>
        <p>First child</p>
        <p>Second child</p>
      </FadeInView>
    )
    
    expect(screen.getByText('First child')).toBeInTheDocument()
    expect(screen.getByText('Second child')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <FadeInView className="custom-class">
        <span>Content</span>
      </FadeInView>
    )
    
    const wrapper = container.querySelector('.custom-class')
    expect(wrapper).toBeInTheDocument()
  })

  it('fades in when in view with default direction (up)', () => {
    const { container } = render(
      <FadeInView>
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-initial]')
    expect(motionDiv).toBeInTheDocument()
    
    const initial = JSON.parse(motionDiv?.getAttribute('data-initial') || '{}')
    expect(initial.opacity).toBe(0)
    expect(initial.y).toBe(50)
  })

  it('respects delay prop', () => {
    const { container } = render(
      <FadeInView delay={0.5}>
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-transition]')
    const transition = JSON.parse(motionDiv?.getAttribute('data-transition') || '{}')
    
    expect(transition.delay).toBe(0.5)
  })

  it('uses default delay of 0 when not specified', () => {
    const { container } = render(
      <FadeInView>
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-transition]')
    const transition = JSON.parse(motionDiv?.getAttribute('data-transition') || '{}')
    
    expect(transition.delay).toBe(0)
  })

  it('only animates once by default', () => {
    const { container } = render(
      <FadeInView>
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-viewport]')
    const viewport = JSON.parse(motionDiv?.getAttribute('data-viewport') || '{}')
    
    expect(viewport.once).toBe(true)
  })

  it('respects once prop when set to false', () => {
    const { container } = render(
      <FadeInView once={false}>
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-viewport]')
    const viewport = JSON.parse(motionDiv?.getAttribute('data-viewport') || '{}')
    
    expect(viewport.once).toBe(false)
  })

  it('handles direction prop: up', () => {
    const { container } = render(
      <FadeInView direction="up">
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-initial]')
    const initial = JSON.parse(motionDiv?.getAttribute('data-initial') || '{}')
    
    expect(initial.y).toBe(50)
    expect(initial.x).toBeUndefined()
  })

  it('handles direction prop: down', () => {
    const { container } = render(
      <FadeInView direction="down">
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-initial]')
    const initial = JSON.parse(motionDiv?.getAttribute('data-initial') || '{}')
    
    expect(initial.y).toBe(-50)
    expect(initial.x).toBeUndefined()
  })

  it('handles direction prop: left', () => {
    const { container } = render(
      <FadeInView direction="left">
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-initial]')
    const initial = JSON.parse(motionDiv?.getAttribute('data-initial') || '{}')
    
    expect(initial.x).toBe(50)
    expect(initial.y).toBeUndefined()
  })

  it('handles direction prop: right', () => {
    const { container } = render(
      <FadeInView direction="right">
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-initial]')
    const initial = JSON.parse(motionDiv?.getAttribute('data-initial') || '{}')
    
    expect(initial.x).toBe(-50)
    expect(initial.y).toBeUndefined()
  })

  it('animates to final state when in view', () => {
    const { container } = render(
      <FadeInView>
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-while-in-view]')
    const whileInView = JSON.parse(motionDiv?.getAttribute('data-while-in-view') || '{}')
    
    expect(whileInView.opacity).toBe(1)
    expect(whileInView.x).toBe(0)
    expect(whileInView.y).toBe(0)
  })

  it('uses correct animation duration', () => {
    const { container } = render(
      <FadeInView>
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-transition]')
    const transition = JSON.parse(motionDiv?.getAttribute('data-transition') || '{}')
    
    expect(transition.duration).toBe(0.6)
  })

  it('uses easeOut easing', () => {
    const { container } = render(
      <FadeInView>
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-transition]')
    const transition = JSON.parse(motionDiv?.getAttribute('data-transition') || '{}')
    
    expect(transition.ease).toBe('easeOut')
  })

  it('sets correct viewport amount threshold', () => {
    const { container } = render(
      <FadeInView>
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-viewport]')
    const viewport = JSON.parse(motionDiv?.getAttribute('data-viewport') || '{}')
    
    expect(viewport.amount).toBe(0.3)
  })

  it('combines all props correctly', () => {
    const { container } = render(
      <FadeInView 
        className="test-class" 
        delay={1.5} 
        direction="left" 
        once={false}
      >
        <span>Content</span>
      </FadeInView>
    )
    
    const motionDiv = container.querySelector('div[data-initial]')
    
    expect(motionDiv).toHaveClass('test-class')
    
    const initial = JSON.parse(motionDiv?.getAttribute('data-initial') || '{}')
    expect(initial.x).toBe(50)
    
    const transition = JSON.parse(motionDiv?.getAttribute('data-transition') || '{}')
    expect(transition.delay).toBe(1.5)
    
    const viewport = JSON.parse(motionDiv?.getAttribute('data-viewport') || '{}')
    expect(viewport.once).toBe(false)
  })

  it('handles complex nested children', () => {
    render(
      <FadeInView>
        <div>
          <h2>Title</h2>
          <p>Paragraph</p>
          <button>Button</button>
        </div>
      </FadeInView>
    )
    
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Paragraph')).toBeInTheDocument()
    expect(screen.getByText('Button')).toBeInTheDocument()
  })

  it('preserves child component props', () => {
    render(
      <FadeInView>
        <button data-testid="test-button" onClick={() => {}}>
          Click me
        </button>
      </FadeInView>
    )
    
    const button = screen.getByTestId('test-button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('data-testid', 'test-button')
  })
})
