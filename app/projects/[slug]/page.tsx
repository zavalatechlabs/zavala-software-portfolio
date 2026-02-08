import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Project = {
  title: string
  description: string
  date: string
  tags: string[]
  github?: string
  demo?: string
}

// This will be replaced with actual MDX content loading in issue #6
const mockProjects: Record<string, Project> = {
  'sample-project': {
    title: 'Sample Project',
    description: 'A sample project demonstrating the MDX content structure',
    date: '2024-01-01',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/username/project',
    demo: 'https://project-demo.vercel.app',
  },
  'project-two': {
    title: 'Project Two',
    description: 'Another example project',
    date: '2024-01-15',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    github: 'https://github.com/username/project-two',
  },
  'project-three': {
    title: 'Project Three',
    description: 'Third project placeholder',
    date: '2024-02-01',
    tags: ['Next.js', 'Tailwind', 'Vercel'],
  },
}

type ProjectPageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = mockProjects[params.slug]
  
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: project.title,
    description: project.description,
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = mockProjects[params.slug]

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
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Projects
      </Link>

      {/* Project Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
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
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              View on GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Live Demo
            </a>
          )}
        </div>
      </header>

      {/* Project Content */}
      <div className="prose prose-lg max-w-none">
        <h2>Overview</h2>
        <p>
          [Placeholder: This content will be loaded from MDX files in issue #6]
        </p>

        <h2>Features</h2>
        <ul>
          <li>Feature one</li>
          <li>Feature two</li>
          <li>Feature three</li>
        </ul>

        <h2>Tech Stack</h2>
        <p>
          This project uses: {project.tags.join(', ')}
        </p>

        <h2>Challenges & Learnings</h2>
        <p>
          [Placeholder: Details about challenges faced and solutions implemented]
        </p>
      </div>
    </div>
  )
}

// Generate static paths for all projects
export async function generateStaticParams() {
  return Object.keys(mockProjects).map((slug) => ({
    slug,
  }))
}
