import { render, screen } from '@testing-library/react'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('@/lib/projects', () => ({
  getAllProjects: jest.fn(),
}))

// ---------------------------------------------------------------------------
import { getAllProjects } from '@/lib/projects'

const mockGetAll = getAllProjects as jest.MockedFunction<typeof getAllProjects>

function makeFakeProject(overrides: Record<string, unknown> = {}) {
  return {
    slug: 'fake-project',
    title: 'Fake Project',
    description: 'A fake project for testing.',
    date: '2025-01-01',
    tags: ['React', 'TypeScript'],
    content: '# Hello',
    featured: false,
    ...overrides,
  }
}

describe('Projects listing page (app/projects/page.tsx)', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('renders the page title and subtitle', () => {
    mockGetAll.mockReturnValue([])

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ProjectsPage = require('../page').default
    render(<ProjectsPage />)

    expect(screen.getByRole('heading', { level: 1, name: /projects/i })).toBeInTheDocument()
    expect(screen.getByText(/A collection of projects/i)).toBeInTheDocument()
  })

  it('renders a card for each project', () => {
    const projects = [
      makeFakeProject({ slug: 'alpha', title: 'Alpha' }),
      makeFakeProject({ slug: 'beta', title: 'Beta' }),
      makeFakeProject({ slug: 'gamma', title: 'Gamma' }),
    ]
    mockGetAll.mockReturnValue(projects)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ProjectsPage = require('../page').default
    render(<ProjectsPage />)

    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('renders project tags', () => {
    mockGetAll.mockReturnValue([
      makeFakeProject({ slug: 'tagged', title: 'Tagged', tags: ['Next.js', 'Tailwind'] }),
    ])

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ProjectsPage = require('../page').default
    render(<ProjectsPage />)

    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('Tailwind')).toBeInTheDocument()
  })

  it('shows an empty-state message when there are no projects', () => {
    mockGetAll.mockReturnValue([])

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ProjectsPage = require('../page').default
    render(<ProjectsPage />)

    expect(screen.getByText(/No projects yet/i)).toBeInTheDocument()
  })
})
