import fs from 'fs'

jest.mock('fs')

import { getAllProjects, getAllProjectSlugs, getProjectBySlug } from '../projects'

const mockedFs = fs as jest.Mocked<typeof fs>

function mdx(frontmatter: Record<string, unknown>, body = '# Body'): string {
  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n')
  return `---\n${yaml}\n---\n\n${body}\n`
}

const validFrontmatter = {
  title: 'Test Project',
  description: 'A test project',
  date: '2025-06-01',
  tags: ['React'],
}

beforeEach(() => {
  jest.resetAllMocks()
})

describe('getAllProjectSlugs', () => {
  it('returns slugs for .mdx files only', () => {
    mockedFs.readdirSync.mockReturnValue([
      'alpha.mdx',
      'beta.mdx',
      'notes.txt',
    ] as unknown as ReturnType<typeof fs.readdirSync>)

    expect(getAllProjectSlugs()).toEqual(['alpha', 'beta'])
  })

  it('filters out file names that violate the slug contract', () => {
    mockedFs.readdirSync.mockReturnValue([
      'valid-slug.mdx',
      'Invalid Slug.mdx',
      'UPPER.mdx',
      'dots.in.name.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)

    // Anything getProjectBySlug would reject must not be listed
    expect(getAllProjectSlugs()).toEqual(['valid-slug'])
  })

  it('returns an empty array when the directory is missing', () => {
    mockedFs.readdirSync.mockImplementation(() => {
      throw new Error('ENOENT')
    })

    expect(getAllProjectSlugs()).toEqual([])
  })
})

describe('getAllProjects', () => {
  it('parses frontmatter and sorts newest first', () => {
    mockedFs.readdirSync.mockReturnValue(['older.mdx', 'newer.mdx'] as unknown as ReturnType<
      typeof fs.readdirSync
    >)
    mockedFs.readFileSync.mockImplementation((filePath) => {
      if (String(filePath).includes('newer')) {
        return mdx({ ...validFrontmatter, title: 'Newer', date: '2025-12-01' })
      }
      return mdx({ ...validFrontmatter, title: 'Older', date: '2025-01-01' })
    })

    const projects = getAllProjects()

    expect(projects.map((p) => p.title)).toEqual(['Newer', 'Older'])
    expect(projects[0]?.slug).toBe('newer')
    expect(projects[0]?.content).toContain('# Body')
  })

  it('throws a clear Zod error for malformed frontmatter', () => {
    mockedFs.readdirSync.mockReturnValue(['bad.mdx'] as unknown as ReturnType<
      typeof fs.readdirSync
    >)
    mockedFs.readFileSync.mockReturnValue(mdx({ title: 'Missing everything' }))

    expect(() => getAllProjects()).toThrow()
  })

  it('rejects unparseable dates at parse time (protects sitemap generation)', () => {
    mockedFs.readdirSync.mockReturnValue(['bad-date.mdx'] as unknown as ReturnType<
      typeof fs.readdirSync
    >)
    mockedFs.readFileSync.mockReturnValue(mdx({ ...validFrontmatter, date: 'not-a-date' }))

    expect(() => getAllProjects()).toThrow(/date/)
  })
})

describe('getProjectBySlug', () => {
  it('returns the parsed project for a valid slug', () => {
    mockedFs.readFileSync.mockReturnValue(mdx(validFrontmatter))

    const project = getProjectBySlug('test-project')

    expect(project?.title).toBe('Test Project')
    expect(project?.slug).toBe('test-project')
  })

  it.each(['../escape', 'has space', 'UPPER', 'dot.dot', ''])(
    'rejects invalid slug %j without touching the filesystem',
    (slug) => {
      expect(getProjectBySlug(slug)).toBeUndefined()
      expect(mockedFs.readFileSync).not.toHaveBeenCalled()
    }
  )

  it('returns undefined when the file does not exist', () => {
    mockedFs.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT')
    })

    expect(getProjectBySlug('missing')).toBeUndefined()
  })

  it('returns undefined for malformed frontmatter instead of crashing the page', () => {
    mockedFs.readFileSync.mockReturnValue(mdx({ title: 42 }))

    expect(getProjectBySlug('broken')).toBeUndefined()
  })
})
