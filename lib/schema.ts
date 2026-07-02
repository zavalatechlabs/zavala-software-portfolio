/**
 * Serialize a JSON-LD object for injection via dangerouslySetInnerHTML.
 * Escapes `<` so user- or content-derived strings can never close the
 * script tag and break out into HTML context.
 */
export function serializeJsonLd(schema: object): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

export function getPersonSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Maximiliano Zavala',
    url: baseUrl,
    jobTitle: 'Full-Stack Developer',
    description: 'Full-stack developer specializing in Next.js, TypeScript, and React',
    sameAs: ['https://github.com/zavalatechlabs'],
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
