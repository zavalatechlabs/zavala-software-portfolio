import { render, screen } from '@testing-library/react'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('@/lib/projects', () => ({
  getProjectBySlug: jest.fn(),
  getAllProjectSlugs: jest.fn(() => []),
}))

// next/navigation — mock notFound so we can detect 404 calls
const mockNotFound = jest.fn()
jest.mock('next/navigation', () => ({
  notFound: () => {
    mockNotFound()
    // Throw to stop component execution, matching Next.js runtime behaviour
    throw new Error('NEXT_NOT_FOUND')
  },
}))

// next-mdx-remote/rsc — render the raw MDX source as plain text
jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => <div data-testid="mdx-content">{source}</div>,
}))

// ---------------------------------------------------------------------------
import { getProjectBySlug } from '@/lib/projects'

const mockGetBySlug = getProjectBySlug as jest.MockedFunction<typeof getProjectBySlug>

function makeFakeProject(overrides: Record<string, unknown> = {}) {
  return {
    slug: 'test-project',
    title: 'Test Project',
    description: 'A detailed description of the test project.',
    date: '2025-03-15',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    content: '## Overview\nSome MDX content here.',
    featured: true,
    github: 'https://github.com/example/test-project',
    demo: 'https://test-project.example.com',
    ...overrides,
  }
}

/**
 * Helper: call the async server component and render the resolved JSX.
 * Next 15 page components are async and receive params as a Promise.
 */
async function renderProjectPage(slug: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ProjectPage = require('../../[slug]/page').default
  const jsx = await ProjectPage({ params: Promise.resolve({ slug }) })
  render(jsx)
}

describe('Project detail page (app/projects/[slug]/page.tsx)', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('renders the project title and description', async () => {
    mockGetBySlug.mockReturnValue(makeFakeProject())

    await renderProjectPage('test-project')

    expect(screen.getByRole('heading', { level: 1, name: /Test Project/i })).toBeInTheDocument()
    expect(screen.getByText(/A detailed description of the test project/i)).toBeInTheDocument()
  })

  it('renders technology tags', async () => {
    mockGetBySlug.mockReturnValue(makeFakeProject())

    await renderProjectPage('test-project')

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument()
  })

  it('renders MDX content section', async () => {
    mockGetBySlug.mockReturnValue(makeFakeProject())

    await renderProjectPage('test-project')

    const mdx = screen.getByTestId('mdx-content')
    expect(mdx).toBeInTheDocument()
    expect(mdx.textContent).toContain('Overview')
  })

  it('renders GitHub and demo links when provided', async () => {
    mockGetBySlug.mockReturnValue(makeFakeProject())

    await renderProjectPage('test-project')

    const githubLink = screen.getByText('View on GitHub').closest('a')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/example/test-project')

    const demoLink = screen.getByText('Live Demo').closest('a')
    expect(demoLink).toHaveAttribute('href', 'https://test-project.example.com')
  })

  it('calls notFound() when the project does not exist', async () => {
    mockGetBySlug.mockReturnValue(undefined)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ProjectPage = require('../../[slug]/page').default

    await expect(ProjectPage({ params: Promise.resolve({ slug: 'nonexistent' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND'
    )

    expect(mockNotFound).toHaveBeenCalled()
  })
})
