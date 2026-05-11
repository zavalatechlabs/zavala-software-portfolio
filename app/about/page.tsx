import type { Metadata } from 'next'
import { Download } from 'lucide-react'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zavalatechlabs.com'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Maximiliano Zavala — full-stack engineer working at the intersection of web development and AI. Resume, work history, and a downloadable PDF.',
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: 'About — Maximiliano Zavala',
    description:
      'Maximiliano Zavala — full-stack engineer working at the intersection of web development and AI.',
    url: `${baseUrl}/about`,
    type: 'profile',
    images: [
      { url: '/about/opengraph-image', width: 1200, height: 630, alt: 'About Maximiliano Zavala' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Maximiliano Zavala',
    description:
      'Maximiliano Zavala — full-stack engineer working at the intersection of web development and AI.',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-6">
          {/* Name & Tagline */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-zavala-text-primary">
            Maximiliano Zavala
          </h1>
          <p className="text-xl text-zavala-accent-primary font-medium mb-4">
            Software Engineer | AI Enthusiast
          </p>
        </div>
      </section>

      {/* Resume Section */}
      <section className="bg-zavala-bg-surface border-t border-b border-zavala-border-default py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-zavala-text-primary">Resume</h2>

          {/* Work Experience */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-8 text-zavala-text-primary flex items-center gap-2">
              <span className="w-1 h-6 bg-zavala-accent-primary rounded-full" />
              Work Experience
            </h3>

            <div className="space-y-8">
              {/* Position 1 */}
              <div className="border-l-2 border-zavala-border-default pl-6 pb-8 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-xl font-semibold text-zavala-text-primary">
                    Senior Software Engineer
                  </h4>
                  <span className="text-sm text-zavala-text-tertiary font-mono">
                    2024 - Present
                  </span>
                </div>
                <p className="text-zavala-accent-primary font-medium mb-3">Tech Innovations Inc.</p>
                <ul className="space-y-2 text-zavala-text-secondary mb-4">
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>
                      Led development of enterprise-scale web applications serving 100K+ users
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>
                      Architected microservices infrastructure using Node.js, Docker, and AWS
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>Implemented CI/CD pipelines reducing deployment time by 60%</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>Mentored junior developers and conducted code reviews</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono bg-zavala-bg-elevated border border-zavala-border-default rounded-full text-zavala-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Position 2 */}
              <div className="border-l-2 border-zavala-border-default pl-6 pb-8 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-xl font-semibold text-zavala-text-primary">
                    Full-Stack Developer
                  </h4>
                  <span className="text-sm text-zavala-text-tertiary font-mono">2022 - 2024</span>
                </div>
                <p className="text-zavala-accent-primary font-medium mb-3">Digital Solutions Co.</p>
                <ul className="space-y-2 text-zavala-text-secondary mb-4">
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>
                      Built and maintained React-based SaaS platform with real-time features
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>
                      Designed RESTful APIs and GraphQL endpoints for mobile and web clients
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>Optimized database queries improving application performance by 40%</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>Collaborated with design team to implement pixel-perfect UIs</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Express', 'MongoDB', 'Redis'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono bg-zavala-bg-elevated border border-zavala-border-default rounded-full text-zavala-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Position 3 */}
              <div className="border-l-2 border-zavala-border-default pl-6 pb-8 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-xl font-semibold text-zavala-text-primary">
                    Software Engineer
                  </h4>
                  <span className="text-sm text-zavala-text-tertiary font-mono">2020 - 2022</span>
                </div>
                <p className="text-zavala-accent-primary font-medium mb-3">StartupXYZ</p>
                <ul className="space-y-2 text-zavala-text-secondary mb-4">
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>Developed features for early-stage product from MVP to production</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>Implemented automated testing reducing bug reports by 50%</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>Worked in agile environment with 2-week sprint cycles</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'Vue.js', 'Python', 'Django', 'PostgreSQL'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono bg-zavala-bg-elevated border border-zavala-border-default rounded-full text-zavala-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-8 text-zavala-text-primary flex items-center gap-2">
              <span className="w-1 h-6 bg-zavala-accent-secondary rounded-full" />
              Education
            </h3>

            <div className="border-l-2 border-zavala-border-default pl-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h4 className="text-xl font-semibold text-zavala-text-primary">
                  Bachelor of Science in Computer Science
                </h4>
                <span className="text-sm text-zavala-text-tertiary font-mono">2016 - 2020</span>
              </div>
              <p className="text-zavala-accent-secondary font-medium mb-2">Tech University</p>
              <p className="text-zavala-text-secondary">
                Focus: Software Engineering, Artificial Intelligence, and Algorithms
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-8 text-zavala-text-primary flex items-center gap-2">
              <span className="w-1 h-6 bg-zavala-accent-code rounded-full" />
              Skills
            </h3>

            <div className="space-y-6">
              {/* Languages */}
              <div>
                <h4 className="text-sm font-semibold text-zavala-text-tertiary uppercase tracking-wide mb-3">
                  Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['TypeScript', 'JavaScript', 'Python', 'SQL', 'Go', 'Bash'].map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-zavala-bg-elevated border border-zavala-border-default rounded-lg text-zavala-text-primary font-mono text-sm hover:border-zavala-accent-primary/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Frameworks & Libraries */}
              <div>
                <h4 className="text-sm font-semibold text-zavala-text-tertiary uppercase tracking-wide mb-3">
                  Frameworks & Libraries
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Next.js',
                    'React',
                    'Node.js',
                    'Express',
                    'FastAPI',
                    'TailwindCSS',
                    'Prisma',
                    'LangChain',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-zavala-bg-elevated border border-zavala-border-default rounded-lg text-zavala-text-primary font-mono text-sm hover:border-zavala-accent-primary/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools & Platforms */}
              <div>
                <h4 className="text-sm font-semibold text-zavala-text-tertiary uppercase tracking-wide mb-3">
                  Tools & Platforms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'AWS',
                    'Docker',
                    'Git',
                    'GitHub Actions',
                    'Vercel',
                    'PostgreSQL',
                    'MongoDB',
                    'Redis',
                    'OpenAI API',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-zavala-bg-elevated border border-zavala-border-default rounded-lg text-zavala-text-primary font-mono text-sm hover:border-zavala-accent-primary/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Download Resume Button */}
          <div className="text-center pt-8 border-t border-zavala-border-default">
            <h3 className="text-xl font-semibold mb-4 text-zavala-text-primary">
              Want the Full Details?
            </h3>
            <p className="text-zavala-text-secondary mb-6">
              Download my complete resume for detailed experience, education, and certifications.
            </p>
            <a
              href="/resume.pdf"
              download="Max_Zavala_Resume.pdf"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zavala-accent-primary text-zavala-accent-foreground font-semibold rounded-lg transition-all duration-200 hover:bg-zavala-accent-primary/90 hover:shadow-lg hover:shadow-zavala-accent-primary/20 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zavala-accent-foreground/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary"
            >
              <Download className="w-5 h-5" />
              Download Resume (PDF)
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
