/**
 * Site-wide constants shared by metadata, sitemap, robots, and JSON-LD.
 *
 * Client-safe: only reads a NEXT_PUBLIC_ variable, which Next.js inlines at
 * build time for both server and client bundles.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://zavalatechlabs.com'

export const SITE_NAME = 'Maximiliano Zavala'

export const SITE_TITLE = 'Maximiliano Zavala - Full-Stack Developer & Software Engineer'

export const SITE_DESCRIPTION =
  'Full-stack developer specializing in Next.js, TypeScript, and React. Building modern web applications with clean code and exceptional user experiences.'
