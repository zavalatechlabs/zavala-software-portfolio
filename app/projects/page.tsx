import type { Metadata } from 'next'
import { getAllProjects } from '@/lib/projects'
import { ProjectCard } from '@/components/ProjectCard'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zavalatechlabs.com'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Production web apps, AI integrations, and cloud infrastructure work by Maximiliano Zavala. Each project includes the architecture decisions and tech stack.',
  alternates: {
    canonical: `${baseUrl}/projects`,
  },
  openGraph: {
    title: 'Projects',
    description:
      'Production web apps, AI integrations, and cloud infrastructure work by Maximiliano Zavala.',
    url: `${baseUrl}/projects`,
    type: 'website',
  },
}

export default function ProjectsPage() {
  const projects = getAllProjects()
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-zavala-text-primary">Projects</h1>
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
