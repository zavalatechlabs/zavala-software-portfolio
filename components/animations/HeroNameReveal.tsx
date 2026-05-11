'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.05, 0.01, 0.9], // Custom ease-out
    },
  },
}

const taglineVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 2,
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const staticVariant = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

interface HeroNameRevealProps {
  name?: string
  tagline?: string
}

export function HeroNameReveal({
  name = 'Maximiliano Zavala',
  tagline = 'Software Engineer | AI Enthusiast',
}: HeroNameRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  // Split name into words to prevent breaking within last name
  const words = name.split(' ')

  const activeContainerVariants = prefersReducedMotion ? staticVariant : containerVariants
  const activeLetterVariants = prefersReducedMotion ? staticVariant : letterVariants
  const activeTaglineVariants = prefersReducedMotion ? staticVariant : taglineVariants

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        {/* Name with letter-by-letter reveal */}
        <motion.h1
          variants={activeContainerVariants}
          initial="hidden"
          animate="visible"
          className="text-6xl md:text-8xl font-bold tracking-tight text-zavala-text-primary"
        >
          {words.map((word, wordIndex) => (
            <span
              key={`word-${wordIndex}`}
              className="inline-block whitespace-nowrap"
              style={{ marginRight: wordIndex < words.length - 1 ? '0.25em' : '0' }}
            >
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={`${char}-${wordIndex}-${charIndex}`}
                  variants={activeLetterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        {/* Tagline fades in after name */}
        <motion.p
          variants={activeTaglineVariants}
          initial="hidden"
          animate="visible"
          className="text-xl md:text-2xl font-medium text-zavala-text-secondary mt-6"
        >
          {tagline}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { delay: 3, duration: 0.8 }}
          className="mt-16"
          aria-hidden="true"
        >
          <motion.div
            animate={prefersReducedMotion ? { y: 0 } : { y: [0, 8, 0] }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
            className="text-zavala-text-tertiary"
          >
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
