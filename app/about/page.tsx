import type { Metadata } from 'next'
import { Download, Code2, Brain, Cloud } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Max Zavala',
  description: 'Learn more about Max Zavala - Software Engineer | AI Enthusiast',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Bio */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16">
          {/* Professional Photo Placeholder */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-zavala-bg-surface border-2 border-zavala-border flex items-center justify-center">
              <div className="text-6xl font-bold text-zavala-text-tertiary">MZ</div>
            </div>
          </div>

          {/* Bio Content */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-zavala-text-primary">
              Max Zavala
            </h1>
            <p className="text-xl text-zavala-accent-primary font-medium mb-8">
              Software Engineer | AI Enthusiast
            </p>

            <div className="space-y-4 text-zavala-text-secondary leading-relaxed">
              <p>
                I&apos;m Max, a software engineer passionate about building intelligent systems and
                exploring the intersection of full-stack development and AI. My journey in tech is
                driven by curiosity and a love for solving complex problems with elegant solutions.
              </p>
              <p>
                With expertise spanning modern web frameworks, cloud infrastructure, and AI
                automation, I specialize in creating scalable applications that push the boundaries
                of what&apos;s possible. I believe in writing clean, maintainable code and building
                systems that stand the test of time.
              </p>
              <p>
                Whether it&apos;s architecting a full-stack application from the ground up, training AI
                models to solve real-world problems, or optimizing cloud deployments for maximum
                efficiency, I bring both technical depth and creative problem-solving to every
                project.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me diving deep into the latest AI research papers,
                contributing to open-source projects, or exploring new technologies that reshape how
                we build software.
              </p>
            </div>
          </div>
        </div>

        {/* What I Do Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-zavala-text-primary text-center">
            What I Do
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Full-Stack Development */}
            <div className="bg-zavala-bg-surface border border-zavala-border rounded-lg p-6 transition-all duration-200 hover:border-zavala-accent-primary/50 hover:shadow-lg hover:shadow-black/20 group">
              <div className="w-12 h-12 bg-zavala-accent-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-zavala-accent-primary/20 transition-colors">
                <Code2 className="w-6 h-6 text-zavala-accent-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zavala-text-primary">
                Full-Stack Development
              </h3>
              <p className="text-zavala-text-secondary">
                Building modern web applications with React, Next.js, TypeScript, and Node.js.
                From responsive frontends to scalable APIs, I craft end-to-end solutions that
                deliver exceptional user experiences.
              </p>
            </div>

            {/* AI & Automation */}
            <div className="bg-zavala-bg-surface border border-zavala-border rounded-lg p-6 transition-all duration-200 hover:border-zavala-accent-secondary/50 hover:shadow-lg hover:shadow-black/20 group">
              <div className="w-12 h-12 bg-zavala-accent-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-zavala-accent-secondary/20 transition-colors">
                <Brain className="w-6 h-6 text-zavala-accent-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zavala-text-primary">
                AI & Automation
              </h3>
              <p className="text-zavala-text-secondary">
                Leveraging cutting-edge AI technologies and LLMs to build intelligent systems.
                From conversational agents to automated workflows, I create solutions that augment
                human capabilities and drive efficiency.
              </p>
            </div>

            {/* Cloud Infrastructure */}
            <div className="bg-zavala-bg-surface border border-zavala-border rounded-lg p-6 transition-all duration-200 hover:border-zavala-accent-code/50 hover:shadow-lg hover:shadow-black/20 group">
              <div className="w-12 h-12 bg-zavala-accent-code/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-zavala-accent-code/20 transition-colors">
                <Cloud className="w-6 h-6 text-zavala-accent-code" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zavala-text-primary">
                Cloud Infrastructure
              </h3>
              <p className="text-zavala-text-secondary">
                Designing and deploying robust cloud architectures on AWS, Vercel, and Docker.
                I ensure applications are secure, performant, and ready to scale from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section className="bg-zavala-bg-surface border-t border-b border-zavala-border py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-zavala-text-primary">
            Resume
          </h2>

          {/* Work Experience */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-8 text-zavala-text-primary flex items-center gap-2">
              <span className="w-1 h-6 bg-zavala-accent-primary rounded-full" />
              Work Experience
            </h3>

            <div className="space-y-8">
              {/* Position 1 */}
              <div className="border-l-2 border-zavala-border pl-6 pb-8 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-xl font-semibold text-zavala-text-primary">
                    Senior Software Engineer
                  </h4>
                  <span className="text-sm text-zavala-text-tertiary font-mono">
                    2024 - Present
                  </span>
                </div>
                <p className="text-zavala-accent-primary font-medium mb-3">
                  Tech Innovations Inc.
                </p>
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
                    <span>
                      Implemented CI/CD pipelines reducing deployment time by 60%
                    </span>
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
                      className="px-3 py-1 text-xs font-mono bg-zavala-bg-elevated border border-zavala-border rounded-full text-zavala-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Position 2 */}
              <div className="border-l-2 border-zavala-border pl-6 pb-8 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-xl font-semibold text-zavala-text-primary">
                    Full-Stack Developer
                  </h4>
                  <span className="text-sm text-zavala-text-tertiary font-mono">
                    2022 - 2024
                  </span>
                </div>
                <p className="text-zavala-accent-primary font-medium mb-3">
                  Digital Solutions Co.
                </p>
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
                    <span>
                      Optimized database queries improving application performance by 40%
                    </span>
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
                      className="px-3 py-1 text-xs font-mono bg-zavala-bg-elevated border border-zavala-border rounded-full text-zavala-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Position 3 */}
              <div className="border-l-2 border-zavala-border pl-6 pb-8 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-xl font-semibold text-zavala-text-primary">
                    Software Engineer
                  </h4>
                  <span className="text-sm text-zavala-text-tertiary font-mono">
                    2020 - 2022
                  </span>
                </div>
                <p className="text-zavala-accent-primary font-medium mb-3">StartupXYZ</p>
                <ul className="space-y-2 text-zavala-text-secondary mb-4">
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>
                      Developed features for early-stage product from MVP to production
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>
                      Implemented automated testing reducing bug reports by 50%
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-zavala-accent-primary mt-1.5">•</span>
                    <span>
                      Worked in agile environment with 2-week sprint cycles
                    </span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'Vue.js', 'Python', 'Django', 'PostgreSQL'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono bg-zavala-bg-elevated border border-zavala-border rounded-full text-zavala-text-secondary"
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

            <div className="border-l-2 border-zavala-border pl-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h4 className="text-xl font-semibold text-zavala-text-primary">
                  Bachelor of Science in Computer Science
                </h4>
                <span className="text-sm text-zavala-text-tertiary font-mono">
                  2016 - 2020
                </span>
              </div>
              <p className="text-zavala-accent-secondary font-medium mb-2">
                Tech University
              </p>
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
                  {[
                    'TypeScript',
                    'JavaScript',
                    'Python',
                    'SQL',
                    'Go',
                    'Bash',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-zavala-bg-elevated border border-zavala-border rounded-lg text-zavala-text-primary font-mono text-sm hover:border-zavala-accent-primary/50 transition-colors"
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
                      className="px-4 py-2 bg-zavala-bg-elevated border border-zavala-border rounded-lg text-zavala-text-primary font-mono text-sm hover:border-zavala-accent-primary/50 transition-colors"
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
                      className="px-4 py-2 bg-zavala-bg-elevated border border-zavala-border rounded-lg text-zavala-text-primary font-mono text-sm hover:border-zavala-accent-primary/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Download Resume Button */}
          <div className="text-center pt-8 border-t border-zavala-border">
            <h3 className="text-xl font-semibold mb-4 text-zavala-text-primary">
              Want the Full Details?
            </h3>
            <p className="text-zavala-text-secondary mb-6">
              Download my complete resume for detailed experience, education, and certifications.
            </p>
            <a
              href="/resume.pdf"
              download="Max_Zavala_Resume.pdf"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zavala-accent-primary text-white font-semibold rounded-lg transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:shadow-zavala-accent-primary/20 hover:-translate-y-0.5 active:translate-y-0"
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
