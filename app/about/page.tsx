import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Zavala Software and the team behind it',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">About Me</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          Software developer passionate about building modern web applications
          with cutting-edge technologies.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Background</h2>
          <p className="text-gray-700 mb-4">
            [Placeholder: Add your background, experience, and journey into software development]
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Skills & Technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Next.js',
              'React',
              'TypeScript',
              'Tailwind CSS',
              'Node.js',
              'PostgreSQL',
              'Git',
              'Vercel',
              'AWS',
            ].map((skill) => (
              <div
                key={skill}
                className="px-4 py-3 bg-primary-50 rounded-lg text-center font-medium text-primary-900"
              >
                {skill}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Interests</h2>
          <p className="text-gray-700">
            [Placeholder: Add your interests, hobbies, and what drives you in tech]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Let's Connect</h2>
          <p className="text-gray-700 mb-4">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get in Touch
          </a>
        </section>
      </div>
    </div>
  )
}
