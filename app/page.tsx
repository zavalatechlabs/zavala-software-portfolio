import { HeroNameReveal, DecipherText, FadeInView } from '@/components/animations'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { ProjectCard } from '@/components/ProjectCard'
import { getFeaturedProjects } from '@/lib/projects'
import Link from 'next/link'

export default function Home() {
  const featuredProjects = getFeaturedProjects(4)

  return (
    <div>
      {/* Hero Section with Name Reveal Animation */}
      <section>
        <HeroNameReveal 
          name="Maximiliano Zavala"
          tagline="Software Engineer | AI Enthusiast"
        />
      </section>

      {/* About Brief Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInView>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
              <DecipherText text="About Me" />
            </h2>
          </FadeInView>

          <FadeInView delay={0.1}>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-lg md:text-xl text-zavala-text-primary leading-relaxed mb-6">
                I&apos;m a software engineer passionate about building intelligent systems and exploring 
                the intersection of full-stack development and AI. I focus on designing cloud-native 
                applications, AI-powered tools, and the platforms that keep them reliable in production.
              </p>
              <p className="text-base md:text-lg text-zavala-text-secondary leading-relaxed">
                I love turning complex systems and ambiguous problems into clear, practical solutions.
              </p>
            </div>
          </FadeInView>

          <FadeInView>
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              <DecipherText text="What I Do" />
            </h2>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <FadeInView delay={0.1}>
              <Card className="p-6 transition-all duration-200 hover:border-zavala-accent-secondary/50 hover:shadow-lg hover:shadow-black/20">
                <div className="w-12 h-12 bg-zavala-accent-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary">
                  Full-Stack & Platform Engineering
                </h3>
                <p className="text-zavala-text-secondary">
                  Building end-to-end systems across frontends, APIs, and backend services, with a focus on clean architecture, maintainability, and reliability.
                </p>
              </Card>
            </FadeInView>

            <FadeInView delay={0.2}>
              <Card className="p-6 transition-all duration-200 hover:border-zavala-accent-primary/50 hover:shadow-lg hover:shadow-black/20">
                <div className="w-12 h-12 bg-zavala-accent-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary">
                  Artificial Intelligence Engineering
                </h3>
                <p className="text-zavala-text-secondary">
                  AI-powered systems and agents, from custom MCP servers to multi-agent workflows that tackle real operational problems.
                </p>
              </Card>
            </FadeInView>

            <FadeInView delay={0.3}>
              <Card className="p-6 transition-all duration-200 hover:border-zavala-accent-code/50 hover:shadow-lg hover:shadow-black/20">
                <div className="w-12 h-12 bg-zavala-accent-code/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">☁️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary">
                  Cloud Infrastructure & Security
                </h3>
                <p className="text-zavala-text-secondary">
                  Designing and operating secure cloud-native systems with an emphasis on reliability, security, and infrastructure as code.
                </p>
              </Card>
            </FadeInView>
          </div>

          {/* Learn More CTA */}
          <FadeInView delay={0.4}>
            <div className="text-center">
              <Link href="/about">
                <Button variant="secondary" size="lg">
                  View My Resume
                </Button>
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 md:py-24 px-6 bg-zavala-bg-surface">
        <div className="max-w-7xl mx-auto">
          <FadeInView>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">
              <DecipherText text="Featured Projects" duration={1200} />
            </h2>
          </FadeInView>

          <FadeInView delay={0.1}>
            <p className="text-center text-zavala-text-secondary text-lg mb-12 max-w-2xl mx-auto">
              A selection of recent projects showcasing full-stack development, AI integration, 
              and cloud infrastructure.
            </p>
          </FadeInView>

          {featuredProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {featuredProjects.map((project, index) => (
                  <FadeInView key={project.slug} delay={0.1 * (index + 1)}>
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      tags={project.tags}
                      slug={project.slug}
                      demo={project.demo}
                      github={project.github}
                    />
                  </FadeInView>
                ))}
              </div>

              {/* View All Projects CTA */}
              <FadeInView delay={0.5}>
                <div className="text-center">
                  <Link href="/projects">
                    <Button variant="primary" size="lg">
                      View All Projects
                    </Button>
                  </Link>
                </div>
              </FadeInView>
            </>
          ) : (
            <FadeInView delay={0.2}>
              <div className="text-center">
                <p className="text-zavala-text-secondary text-lg mb-8">
                  Project showcases coming soon! Check back for updates.
                </p>
              </div>
            </FadeInView>
          )}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInView>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <DecipherText text="Let's Build Something Together" duration={1500} />
            </h2>
          </FadeInView>

          <FadeInView delay={0.2}>
            <p className="text-lg md:text-xl text-zavala-text-secondary mb-8 leading-relaxed">
              Have an interesting project in mind? Whether it&apos;s a web application, AI integration, 
              or cloud infrastructure challenge, I&apos;d love to hear about it.
            </p>
          </FadeInView>

          <FadeInView delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Get in Touch
                </Button>
              </Link>
              <a 
                href="https://github.com/zavalatechlabs" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg">
                  View GitHub
                </Button>
              </a>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  )
}
