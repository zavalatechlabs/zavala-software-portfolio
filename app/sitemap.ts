import { MetadataRoute } from 'next'
import { getAllProjects } from '@/lib/projects'
import { SITE_URL as baseUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = getAllProjects()

  // Use the most recent project date for pages that change when projects are added
  const newestProject = projects[0]
  const latestProjectDate = newestProject ? new Date(newestProject.date) : new Date('2026-04-12')

  // Static pages — use fixed dates to avoid telling search engines every page
  // changed on every build. Update these when page content actually changes.
  const staticPages = [
    {
      url: baseUrl,
      lastModified: latestProjectDate, // Changes when featured projects change
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-04-12'), // Update when page content changes
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: latestProjectDate, // Changes when new projects are added
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-04-12'), // Update when page content changes
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic project pages
  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...projectPages]
}
