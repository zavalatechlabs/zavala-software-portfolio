/**
 * JSON-LD schema builders.
 *
 * These produce schema.org-flavored structured data used in `<script type="application/ld+json">`
 * tags. All builders are pure and take their base URL explicitly so the same module works in
 * Server Components, route handlers, and metadata generators without reading env vars directly.
 */

const CONTACT_EMAIL = 'zavala.techlabs@gmail.com'
const GITHUB_URL = 'https://github.com/zavalatechlabs'

export function getPersonSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Maximiliano Zavala',
    url: baseUrl,
    jobTitle: 'Full-Stack Developer',
    description: 'Full-stack developer specializing in Next.js, TypeScript, and React',
    email: `mailto:${CONTACT_EMAIL}`,
    image: `${baseUrl}/opengraph-image.png`,
    sameAs: [GITHUB_URL],
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Web Development',
      'Software Engineering',
    ],
  }
}

export function getWebSiteSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Maximiliano Zavala - Portfolio',
    url: baseUrl,
    description: 'Full-stack developer specializing in Next.js, TypeScript, and React',
    author: {
      '@type': 'Person',
      name: 'Maximiliano Zavala',
      url: baseUrl,
    },
  }
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

type CreativeWorkInput = {
  baseUrl: string
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  image?: string
}

export function getCreativeWorkSchema({
  baseUrl,
  slug,
  title,
  description,
  date,
  tags,
  image,
}: CreativeWorkInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    url: `${baseUrl}/projects/${slug}`,
    dateCreated: date,
    keywords: tags.join(', '),
    author: {
      '@type': 'Person',
      name: 'Maximiliano Zavala',
      url: baseUrl,
    },
    ...(image ? { image: image.startsWith('http') ? image : `${baseUrl}${image}` } : {}),
  }
}
