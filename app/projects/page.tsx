import type { Metadata } from 'next'
import { ProjectCard } from '@/components/ProjectCard'
import { getAllProjects } from '@/lib/projects'

const PAGE_TITLE = 'Projects'
const PAGE_DESCRIPTION = 'Browse my portfolio of web development projects'

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: '/projects',
  },
}

export default function ProjectsPage() {
  const projects = getAllProjects()
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
        <p className="text-xl text-zavala-text-secondary">
          A collection of projects I&apos;ve built using modern web technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            description={project.description}
            tags={project.tags}
            slug={project.slug}
            image={project.image}
            demo={project.demo}
            github={project.github}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-zavala-text-tertiary">No projects yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
