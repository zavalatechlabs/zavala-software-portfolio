import { render, screen } from '@testing-library/react'

// ---------------------------------------------------------------------------
// Mocks — keep every client-side / animation component simple so we can
// unit-test the *page* composition, not the sub-components.
// ---------------------------------------------------------------------------

jest.mock('@/lib/projects', () => ({
  getFeaturedProjects: jest.fn(),
}))

jest.mock('@/components/animations', () => ({
  HeroNameReveal: ({ name, tagline }: { name: string; tagline: string }) => (
    <div data-testid="hero">
      <span>{name}</span>
      <span>{tagline}</span>
    </div>
  ),
  DecipherText: ({ text }: { text: string }) => <span>{text}</span>,
  FadeInView: ({ children }: { children: React.ReactNode; delay?: number }) => (
    <div>{children}</div>
  ),
}))

jest.mock('@/components/ui', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children }: { children: React.ReactNode; variant?: string; size?: string }) => (
    <button>{children}</button>
  ),
}))

jest.mock('@/components/ProjectCard', () => ({
  ProjectCard: ({
    title,
    description,
  }: {
    title: string
    description: string
    tags: string[]
    slug: string
    demo?: string | null
    github?: string | null
  }) => (
    <article data-testid="project-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  ),
}))

// ---------------------------------------------------------------------------
import { getFeaturedProjects } from '@/lib/projects'

const mockGetFeatured = getFeaturedProjects as jest.MockedFunction<typeof getFeaturedProjects>

function makeFakeProject(overrides: Record<string, unknown> = {}) {
  return {
    slug: 'fake-project',
    title: 'Fake Project',
    description: 'A fake project for testing.',
    date: '2025-01-01',
    tags: ['React', 'TypeScript'],
    content: '# Hello',
    featured: true,
    ...overrides,
  }
}

describe('Home page (app/page.tsx)', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('renders the hero section with the user name', () => {
    mockGetFeatured.mockReturnValue([])
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Home = require('../../app/page').default
    render(<Home />)

    expect(screen.getByText('Maximiliano Zavala')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer | AI Enthusiast')).toBeInTheDocument()
  })

  it('renders featured project cards when projects exist', () => {
    const projects = [
      makeFakeProject({ slug: 'project-a', title: 'Project Alpha' }),
      makeFakeProject({ slug: 'project-b', title: 'Project Beta' }),
    ]
    mockGetFeatured.mockReturnValue(projects)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Home = require('../../app/page').default
    render(<Home />)

    const cards = screen.getAllByTestId('project-card')
    expect(cards).toHaveLength(2)
    expect(screen.getByText('Project Alpha')).toBeInTheDocument()
    expect(screen.getByText('Project Beta')).toBeInTheDocument()
  })

  it('shows a fallback message when there are no featured projects', () => {
    mockGetFeatured.mockReturnValue([])

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Home = require('../../app/page').default
    render(<Home />)

    expect(screen.getByText(/Project showcases coming soon/i)).toBeInTheDocument()
  })

  it('renders CTA links (View All Projects, View My Resume, Get in Touch)', () => {
    mockGetFeatured.mockReturnValue([makeFakeProject({ slug: 'p1', title: 'P1' })])

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Home = require('../../app/page').default
    render(<Home />)

    expect(screen.getByText('View All Projects')).toBeInTheDocument()
    expect(screen.getByText('View My Resume')).toBeInTheDocument()
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
  })
})
