'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  slug: string
  demo?: string | null
  github?: string | null
}

export function ProjectCard({ title, description, tags, slug, demo, github }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              y: -8,
              transition: { duration: 0.2, ease: 'easeOut' },
            }
      }
      className="group h-full"
    >
      <Link href={`/projects/${slug}`} className="block h-full">
        <div
          className="
          h-full
          bg-zavala-bg-surface 
          border border-zavala-border 
          rounded-lg 
          overflow-hidden
          transition-all duration-200
          group-hover:border-zavala-accent-primary/50
          group-hover:shadow-xl group-hover:shadow-black/30
          flex flex-col
        "
        >
          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-zavala-bg-elevated">
            {/* Placeholder gradient if no image */}
            <div className="absolute inset-0 bg-gradient-to-br from-zavala-accent-primary/20 via-zavala-bg-elevated to-zavala-accent-secondary/20" />

            {/* Overlay that appears on hover */}
            <motion.div
              className="absolute inset-0 bg-zavala-accent-primary/10"
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              whileHover={{ opacity: 1 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
            />

            {/* Project icon/emoji in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl opacity-40 group-hover:opacity-60 transition-opacity">
                {title.includes('AI')
                  ? '🤖'
                  : title.includes('E-Commerce')
                    ? '🛒'
                    : title.includes('Task')
                      ? '📋'
                      : title.includes('Cloud')
                        ? '☁️'
                        : '💻'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary group-hover:text-zavala-accent-primary transition-colors">
              {title}
            </h3>
            <p className="text-zavala-text-secondary text-sm mb-4 line-clamp-2 flex-1">
              {description}
            </p>

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

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-zavala-accent-primary font-medium text-sm inline-flex items-center gap-2">
                View Project
                <motion.span
                  animate={prefersReducedMotion ? { x: 0 } : { x: [0, 4, 0] }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          repeat: Infinity,
                          duration: 1.5,
                          ease: 'easeInOut',
                        }
                  }
                >
                  →
                </motion.span>
              </span>

              {/* Optional: Quick links */}
              {(demo || github) && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {demo && (
                    <a
                      href={demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-zavala-text-tertiary hover:text-zavala-accent-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-surface focus-visible:rounded-sm"
                      title="Live Demo"
                      aria-label={`${title} — live demo (opens in new tab)`}
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
                      onClick={(e) => e.stopPropagation()}
                      className="text-zavala-text-tertiary hover:text-zavala-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-surface focus-visible:rounded-sm"
                      title="GitHub Repository"
                      aria-label={`${title} — GitHub repository (opens in new tab)`}
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
        </div>
      </Link>
    </motion.article>
  )
}
