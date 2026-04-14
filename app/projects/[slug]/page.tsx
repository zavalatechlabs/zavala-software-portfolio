import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/projects'
import { getBreadcrumbSchema } from '@/lib/schema'

type ProjectPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zavalatechlabs.com'

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${baseUrl}/projects/${slug}`,
      type: 'article',
      images: project.image
        ? [{ url: project.image, width: 1200, height: 630, alt: project.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/projects/${slug}`,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zavalatechlabs.com'

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Projects', url: `${baseUrl}/projects` },
    { name: project.title, url: `${baseUrl}/projects/${slug}` },
  ])

  return (
    <div className="min-h-screen bg-zavala-bg-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Back Link */}
        <Link
          href="/projects"
          className="
            inline-flex items-center 
            text-zavala-text-secondary 
            hover:text-zavala-text-primary 
            transition-colors 
            mb-8 
            group
          "
        >
          <ArrowLeft
            className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
          Back to Projects
        </Link>

        {/* Project Hero */}
        <header className="mb-12">
          {/* Project Image */}
          {project.image && (
            <div className="relative aspect-video mb-8 rounded-lg overflow-hidden border border-zavala-border">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Title & Description */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-zavala-text-primary leading-tight">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-zavala-text-secondary mb-6 leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="
                  px-3 py-1.5 
                  text-sm font-mono 
                  bg-zavala-bg-surface 
                  border border-zavala-border 
                  rounded-full
                  text-zavala-text-secondary
                "
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center
                  px-6 py-3 
                  bg-zavala-bg-surface 
                  text-zavala-text-primary 
                  font-semibold 
                  border border-zavala-border 
                  rounded-lg 
                  transition-all duration-200
                  hover:border-zavala-accent-primary
                  hover:bg-zavala-bg-elevated
                  hover:-translate-y-0.5
                  active:translate-y-0
                "
              >
                {/* Inline SVG kept: lucide-react's Github icon is a simplified outline,
                    not the official filled GitHub logo (octocat silhouette). */}
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                View on GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center
                  px-6 py-3 
                  bg-zavala-accent-primary 
                  text-white 
                  font-semibold 
                  rounded-lg 
                  transition-all duration-200
                  hover:bg-zavala-accent-primary/90
                  hover:shadow-lg hover:shadow-zavala-accent-primary/20
                  hover:-translate-y-0.5
                  active:translate-y-0
                "
              >
                <ExternalLink className="w-5 h-5 mr-2" aria-hidden="true" />
                Live Demo
              </a>
            )}
          </div>
        </header>

        {/* Project Content from MDX */}
        <article
          className="
          prose prose-lg 
          prose-invert
          max-w-none
          prose-headings:text-zavala-text-primary
          prose-headings:font-bold
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
          prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
          prose-p:text-zavala-text-secondary prose-p:leading-relaxed
          prose-a:text-zavala-accent-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-zavala-text-primary prose-strong:font-semibold
          prose-code:text-zavala-accent-code prose-code:bg-zavala-bg-surface prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-zavala-bg-surface prose-pre:border prose-pre:border-zavala-border prose-pre:rounded-lg
          prose-ul:text-zavala-text-secondary
          prose-ol:text-zavala-text-secondary
          prose-li:marker:text-zavala-accent-secondary
          prose-blockquote:border-l-zavala-accent-primary prose-blockquote:text-zavala-text-secondary prose-blockquote:italic
          prose-hr:border-zavala-border
        "
        >
          <MDXRemote source={project.content} />
        </article>

        {/* Back to Projects Link (Bottom) */}
        <div className="mt-16 pt-8 border-t border-zavala-border">
          <Link
            href="/projects"
            className="
              inline-flex items-center 
              text-zavala-accent-primary 
              hover:text-zavala-accent-secondary 
              font-medium
              transition-colors 
              group
            "
          >
            <ArrowLeft
              className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            Back to All Projects
          </Link>
        </div>
      </div>
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
