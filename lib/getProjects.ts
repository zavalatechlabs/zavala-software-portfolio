import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const projectsDirectory = path.join(process.cwd(), 'content/projects')

export type ProjectMetadata = {
  title: string
  description: string
  date: string
  tags: string[]
  image?: string
  github?: string
  demo?: string
  featured?: boolean
}

export type Project = {
  slug: string
  metadata: ProjectMetadata
  content: string
}

/**
 * Get all project slugs from the content/projects directory
 */
export function getAllProjectSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(projectsDirectory)
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => fileName.replace(/\.mdx$/, ''))
  } catch {
    // If directory doesn't exist or is empty, return empty array
    return []
  }
}

/**
 * Get a single project by slug
 */
export function getProjectBySlug(slug: string): Project | null {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      metadata: data as ProjectMetadata,
      content,
    }
  } catch {
    return null
  }
}

/**
 * Get all projects sorted by date (newest first)
 */
export function getAllProjects(): Project[] {
  const slugs = getAllProjectSlugs()
  const projects = slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is Project => project !== null)
    .sort((a, b) => {
      // Sort by date, newest first
      return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    })

  return projects
}

/**
 * Get featured projects
 */
export function getFeaturedProjects(): Project[] {
  const allProjects = getAllProjects()
  return allProjects.filter((project) => project.metadata.featured === true)
}
