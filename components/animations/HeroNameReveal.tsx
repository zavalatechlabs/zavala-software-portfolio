import type { CSSProperties } from 'react'

interface HeroNameRevealProps {
  name?: string
  tagline?: string
}

const LETTER_STAGGER_S = 0.08
const LETTER_BASE_DELAY_S = 0.2

/**
 * Letter-by-letter hero reveal, implemented as a Server Component with pure
 * CSS animations (see `rise-in` / `fade-in-up` in globals.css).
 *
 * The heading ships visible in the server HTML — first paint never waits on
 * a JavaScript bundle — and `prefers-reduced-motion` collapses the animation
 * to its final frame via the global media query. Screen readers get the
 * intact name through `aria-label`; the per-letter spans are decorative.
 */
export function HeroNameReveal({
  name = 'Maximiliano Zavala',
  tagline = 'Software Engineer | AI Enthusiast',
}: HeroNameRevealProps) {
  // Split into words so wrapping never breaks mid-name
  const words = name.split(' ')
  let letterIndex = 0

  const letterCount = name.replace(/ /g, '').length
  const taglineDelayS = LETTER_BASE_DELAY_S + letterCount * LETTER_STAGGER_S + 0.4
  const scrollHintDelayS = taglineDelayS + 0.8

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        {/* Name with letter-by-letter reveal */}
        <h1
          aria-label={name}
          className="text-6xl md:text-8xl font-bold tracking-tight text-zavala-text-primary"
        >
          {words.map((word, wordIndex) => (
            <span
              key={`word-${wordIndex}`}
              aria-hidden="true"
              className="inline-block whitespace-nowrap"
              style={{ marginRight: wordIndex < words.length - 1 ? '0.25em' : '0' }}
            >
              {word.split('').map((char, charIndex) => {
                const style: CSSProperties = {
                  animationDelay: `${LETTER_BASE_DELAY_S + letterIndex * LETTER_STAGGER_S}s`,
                }
                letterIndex += 1
                return (
                  <span
                    key={`${char}-${wordIndex}-${charIndex}`}
                    className="inline-block animate-rise-in"
                    style={style}
                  >
                    {char}
                  </span>
                )
              })}
            </span>
          ))}
        </h1>

        {/* Tagline fades in after name */}
        <p
          className="text-xl md:text-2xl font-medium text-zavala-text-secondary mt-6 animate-fade-in-up"
          style={{ animationDelay: `${taglineDelayS}s`, animationDuration: '0.8s' }}
        >
          {tagline}
        </p>

        {/* Scroll indicator */}
        <div
          aria-hidden="true"
          className="mt-16 animate-fade-in-up"
          style={{ animationDelay: `${scrollHintDelayS}s`, animationDuration: '0.8s' }}
        >
          <div className="text-zavala-text-tertiary motion-safe:animate-bounce">
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
