import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Browse my portfolio of web development projects',
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
          <Link key={project.slug} href={`/projects/${project.slug}`} className="group">
            <article className="border border-zavala-border-default rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Placeholder Image */}
              <div className="bg-zavala-accent-primary h-48 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">{project.title.charAt(0)}</span>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-zavala-accent-primary transition-colors">
                  {project.title}
                </h2>
                <p className="text-zavala-text-secondary mb-4">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-zavala-bg-surface text-zavala-accent-primary text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Empty State (hidden when projects exist) */}
      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-zavala-text-tertiary">No projects yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
