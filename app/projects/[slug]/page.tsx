import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/getProjects'

type ProjectPageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: project.metadata.title,
    description: project.metadata.description,
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Back Link */}
      <Link
        href="/projects"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </Link>

      {/* Project Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.metadata.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{project.metadata.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.metadata.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          {project.metadata.github && (
            <a
              href={project.metadata.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              View on GitHub
            </a>
          )}
          {project.metadata.demo && (
            <a
              href={project.metadata.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Live Demo
            </a>
          )}
        </div>
      </header>

      {/* Project Content from MDX */}
      <article className="prose prose-lg max-w-none">
        <MDXRemote source={project.content} />
      </article>
    </div>
  )
}

// Generate static paths for all projects
export async function generateStaticParams() {
  const slugs = getAllProjectSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}
