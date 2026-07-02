import Image from 'next/image'
import Link from 'next/link'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  slug: string
  image?: string
  demo?: string | null
  github?: string | null
}

const FOCUS_RING =
  'focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary focus-visible:outline-none'

function projectIcon(title: string): string {
  if (title.includes('AI')) return '🤖'
  if (title.includes('E-Commerce')) return '🛒'
  if (title.includes('Task')) return '📋'
  if (title.includes('Cloud')) return '☁️'
  return '💻'
}

/**
 * Project summary card. Server Component — hover/entrance effects are pure
 * CSS, so no client JS ships for cards.
 *
 * Accessibility notes:
 * - The card uses the "stretched link" pattern: the title's Link covers the
 *   whole card via an ::after overlay, so there are no nested interactive
 *   elements (no <a> inside <a>).
 * - Demo/GitHub quick links sit above the overlay (relative + z-10) and are
 *   revealed on keyboard focus as well as hover.
 */
export function ProjectCard({
  title,
  description,
  tags,
  slug,
  image,
  demo,
  github,
}: ProjectCardProps) {
  return (
    <article
      className="
        group relative h-full
        bg-zavala-bg-surface
        border border-zavala-border
        rounded-lg
        overflow-hidden
        transition-all duration-200
        hover:border-zavala-accent-primary/50
        hover:shadow-xl hover:shadow-black/30
        hover:-translate-y-2
        focus-within:border-zavala-accent-primary/50
        flex flex-col
      "
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-zavala-bg-elevated">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            // Project images are local SVG illustrations; the Next.js image
            // optimizer rejects SVG sources unless dangerouslyAllowSVG is on.
            unoptimized={image.endsWith('.svg')}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-zavala-accent-primary/20 via-zavala-bg-elevated to-zavala-accent-secondary/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                aria-hidden="true"
                className="text-6xl opacity-40 group-hover:opacity-60 transition-opacity"
              >
                {projectIcon(title)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary group-hover:text-zavala-accent-primary transition-colors">
          <Link
            href={`/projects/${slug}`}
            className={`after:absolute after:inset-0 after:content-[''] ${FOCUS_RING} focus-visible:rounded-sm`}
          >
            {title}
          </Link>
        </h3>
        <p className="text-zavala-text-secondary text-sm mb-4 line-clamp-2 flex-1">{description}</p>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-mono bg-zavala-bg-elevated border border-zavala-border rounded-full group-hover:border-zavala-accent-primary/30 transition-colors"
            >
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="px-3 py-1 text-xs font-mono text-zavala-text-tertiary">
              +{tags.length - 4} more
            </span>
          )}
        </div>

        {/* CTA row */}
        <div className="flex items-center justify-between">
          <span className="text-zavala-accent-primary font-medium text-sm inline-flex items-center gap-2">
            View Project
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </span>

          {/* Quick links: revealed on hover AND keyboard focus */}
          {(demo || github) && (
            <div className="relative z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              {demo && (
                <a
                  href={demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Live demo of ${title} (opens in new tab)`}
                  className={`p-1 text-zavala-text-tertiary hover:text-zavala-accent-secondary transition-colors ${FOCUS_RING} focus-visible:rounded-sm`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${title} on GitHub (opens in new tab)`}
                  className={`p-1 text-zavala-text-tertiary hover:text-zavala-text-primary transition-colors ${FOCUS_RING} focus-visible:rounded-sm`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
