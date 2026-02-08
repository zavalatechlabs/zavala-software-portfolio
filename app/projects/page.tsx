import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Browse my portfolio of web development projects',
}

// Placeholder projects data
const projects = [
  {
    slug: 'sample-project',
    title: 'Sample Project',
    description:
      'A sample project demonstrating the MDX content structure and project showcase capabilities.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    image: '/images/projects/sample-project.jpg',
    featured: true,
  },
  {
    slug: 'project-two',
    title: 'Project Two',
    description: 'Another example project to demonstrate the projects list page layout.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    image: '/images/projects/project-two.jpg',
    featured: false,
  },
  {
    slug: 'project-three',
    title: 'Project Three',
    description: 'Third project placeholder showcasing different tech stack.',
    tags: ['Next.js', 'Tailwind', 'Vercel'],
    image: '/images/projects/project-three.jpg',
    featured: false,
  },
]

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
        <p className="text-xl text-gray-600">
          A collection of projects I've built using modern web technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group"
          >
            <article className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Placeholder Image */}
              <div className="bg-gradient-to-br from-primary-400 to-primary-600 h-48 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {project.title.charAt(0)}
                </span>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                  {project.title}
                </h2>
                <p className="text-gray-600 mb-4">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
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
          <p className="text-xl text-gray-500">
            No projects yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}
