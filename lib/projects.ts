import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const projectsDirectory = path.join(process.cwd(), 'content/projects')

export interface ProjectMetadata {
  title: string
  description: string
  date: string
  tags: string[]
  image: string
  github?: string | null
  demo?: string | null
  featured?: boolean
}

export interface Project extends ProjectMetadata {
  slug: string
  content: string
}

export function getAllProjects(): Project[] {
  const fileNames = fs.readdirSync(projectsDirectory)
  const projects = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(projectsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        content,
        ...(data as ProjectMetadata),
      }
    })

  // Sort by date (newest first)
  return projects.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getFeaturedProjects(limit?: number): Project[] {
  const allProjects = getAllProjects()
  const featured = allProjects.filter(project => project.featured)
  
  if (limit) {
    return featured.slice(0, limit)
  }
  
  return featured
}

export function getProjectBySlug(slug: string): Project | undefined {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      ...(data as ProjectMetadata),
    }
  } catch {
    return undefined
  }
}
