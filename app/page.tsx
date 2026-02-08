import { HeroNameReveal, DecipherText, FadeInView } from '@/components/animations'
import { Card } from '@/components/ui'

export default function Home() {
  return (
    <div>
      {/* Hero Section with Name Reveal Animation */}
      <section>
        <HeroNameReveal 
          name="Max Zavala"
          tagline="Software Engineer | AI Enthusiast"
        />
      </section>

      {/* About Section with Decipher Effect */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInView>
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              <DecipherText text="What I Do" />
            </h2>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInView delay={0.1}>
              <Card className="p-6 transition-all duration-200 hover:border-zavala-accent-secondary/50 hover:shadow-lg hover:shadow-black/20">
                <div className="w-12 h-12 bg-zavala-accent-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary">
                  Full-Stack Development
                </h3>
                <p className="text-zavala-text-secondary">
                  Building scalable web applications with modern frameworks and best practices.
                </p>
              </Card>
            </FadeInView>

            <FadeInView delay={0.2}>
              <Card className="p-6 transition-all duration-200 hover:border-zavala-accent-primary/50 hover:shadow-lg hover:shadow-black/20">
                <div className="w-12 h-12 bg-zavala-accent-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary">
                  AI & Automation
                </h3>
                <p className="text-zavala-text-secondary">
                  Exploring intelligent systems and conversational AI to solve real problems.
                </p>
              </Card>
            </FadeInView>

            <FadeInView delay={0.3}>
              <Card className="p-6 transition-all duration-200 hover:border-zavala-accent-code/50 hover:shadow-lg hover:shadow-black/20">
                <div className="w-12 h-12 bg-zavala-accent-code/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">☁️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary">
                  Cloud Infrastructure
                </h3>
                <p className="text-zavala-text-secondary">
                  Designing and deploying reliable, scalable systems on modern cloud platforms.
                </p>
              </Card>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 md:py-24 px-6 bg-zavala-bg-surface">
        <div className="max-w-7xl mx-auto">
          <FadeInView>
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              <DecipherText text="Featured Projects" duration={1200} />
            </h2>
          </FadeInView>

          <FadeInView delay={0.2}>
            <div className="text-center">
              <p className="text-zavala-text-secondary text-lg mb-8">
                Coming soon! Check back for project showcases.
              </p>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  )
}
