import { render, screen } from '@testing-library/react'
import { FadeInView } from '../FadeInView'
import { useInView } from '@/hooks/useInView'

// Mock the in-view hook so tests can control visibility deterministically
jest.mock('@/hooks/useInView', () => ({
  useInView: jest.fn(),
}))

const mockUseInView = useInView as jest.MockedFunction<typeof useInView>

function setInView(isInView: boolean) {
  mockUseInView.mockReturnValue([{ current: null }, isInView])
}

beforeEach(() => {
  jest.clearAllMocks()
  setInView(false)
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

  it('applies custom className alongside the fade classes', () => {
    const { container } = render(
      <FadeInView className="custom-class">
        <span>Content</span>
      </FadeInView>
    )

    const wrapper = container.firstElementChild
    expect(wrapper).toHaveClass('custom-class')
    expect(wrapper).toHaveClass('fade-in-view')
  })

  it('does not have the is-in-view class before intersecting', () => {
    const { container } = render(
      <FadeInView>
        <span>Content</span>
      </FadeInView>
    )

    expect(container.firstElementChild).not.toHaveClass('is-in-view')
  })

  it('adds the is-in-view class once the element intersects', () => {
    setInView(true)

    const { container } = render(
      <FadeInView>
        <span>Content</span>
      </FadeInView>
    )

    expect(container.firstElementChild).toHaveClass('is-in-view')
  })

  it.each([
    ['up', 'translateY(50px)'],
    ['down', 'translateY(-50px)'],
    ['left', 'translateX(50px)'],
    ['right', 'translateX(-50px)'],
  ] as const)('offsets direction %s before intersecting', (direction, transform) => {
    const { container } = render(
      <FadeInView direction={direction}>
        <span>Content</span>
      </FadeInView>
    )

    expect((container.firstElementChild as HTMLElement).style.transform).toBe(transform)
  })

  it('clears the inline transform once in view (CSS transitions to final state)', () => {
    setInView(true)

    const { container } = render(
      <FadeInView direction="left">
        <span>Content</span>
      </FadeInView>
    )

    expect((container.firstElementChild as HTMLElement).style.transform).toBe('')
  })

  it('applies the delay as a transition-delay style', () => {
    const { container } = render(
      <FadeInView delay={0.5}>
        <span>Content</span>
      </FadeInView>
    )

    expect((container.firstElementChild as HTMLElement).style.transitionDelay).toBe('0.5s')
  })

  it('omits transition-delay when delay is 0', () => {
    const { container } = render(
      <FadeInView>
        <span>Content</span>
      </FadeInView>
    )

    expect((container.firstElementChild as HTMLElement).style.transitionDelay).toBe('')
  })

  it('passes the once option through to useInView', () => {
    render(
      <FadeInView once={false}>
        <span>Content</span>
      </FadeInView>
    )

    expect(mockUseInView).toHaveBeenCalledWith({ amount: 0.3, once: false })
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
})
