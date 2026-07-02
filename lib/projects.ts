import fs from 'fs'
import path from 'path'
import { cache } from 'react'
import matter from 'gray-matter'
import { z } from 'zod'

const projectsDirectory = path.join(process.cwd(), 'content/projects')

/**
 * The slug contract: file names (minus .mdx) must match this pattern.
 * `getProjectBySlug` rejects anything else, so listing functions filter with
 * the same rule — a file that can be listed can always be resolved.
 */
const SLUG_PATTERN = /^[a-z0-9-]+$/

/**
 * Zod schema for MDX project frontmatter.
 *
 * This is the single source of truth for the shape of project metadata.
 * The TypeScript type `ProjectMetadata` is derived from it via `z.infer`.
 * Using `.parse()` instead of a bare type-assertion means malformed
 * frontmatter surfaces at build time with a clear Zod error rather than
 * silently propagating bad data to the UI.
 */
export const projectMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  // A parseability check on top of z.string(): an invalid date would
  // otherwise produce NaN sort comparisons and crash sitemap generation
  // (`new Date(date).toISOString()`) far from the offending MDX file.
  date: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), 'date must be a parseable ISO date'),
  tags: z.array(z.string()),
  image: z.string().optional(),
  github: z.string().nullable().optional(),
  demo: z.string().nullable().optional(),
  featured: z.boolean().optional(),
})

export type ProjectMetadata = z.infer<typeof projectMetadataSchema>

export interface Project extends ProjectMetadata {
  slug: string
  content: string
}

/**
 * Get all project slugs from the content/projects directory.
 */
export function getAllProjectSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(projectsDirectory)
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => fileName.replace(/\.mdx$/, ''))
      .filter((slug) => SLUG_PATTERN.test(slug))
  } catch {
    return []
  }
}

/**
 * Get all projects sorted by date (newest first).
 *
 * Wrapped in React's `cache()` so repeated calls within a single render pass
 * (listing page + featured section + sitemap during one build) parse the MDX
 * files from disk only once.
 */
export const getAllProjects = cache((): Project[] => {
  const projects = getAllProjectSlugs().map((slug) => {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const metadata = projectMetadataSchema.parse(data)

    return {
      slug,
      content,
      ...metadata,
    }
  })

  return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

/**
 * Get featured projects, optionally limited to a maximum count.
 */
export function getFeaturedProjects(limit?: number): Project[] {
  const allProjects = getAllProjects()
  const featured = allProjects.filter((project) => project.featured)

  if (limit !== undefined) {
    return featured.slice(0, limit)
  }

  return featured
}

/**
 * Get a single project by slug, or undefined if not found / invalid.
 */
export function getProjectBySlug(slug: string): Project | undefined {
  // Reject slugs with dots, slashes, spaces, uppercase, etc. (defense-in-depth)
  if (!SLUG_PATTERN.test(slug)) return undefined

  try {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const metadata = projectMetadataSchema.parse(data)

    return {
      slug,
      content,
      ...metadata,
    }
  } catch {
    return undefined
  }
}
