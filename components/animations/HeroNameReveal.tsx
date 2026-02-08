'use client'

import { motion } from 'framer-motion'

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

interface HeroNameRevealProps {
  name?: string
  tagline?: string
}

export function HeroNameReveal({ 
  name = 'Maximiliano Zavala',
  tagline = 'Software Engineer | AI Enthusiast'
}: HeroNameRevealProps) {
  // Split name into words to prevent breaking within last name
  const words = name.split(' ')
  
  return (
    <div className="py-24 md:py-32 flex items-center justify-center px-6">
      <div className="text-center">
        {/* Name with letter-by-letter reveal */}
        <motion.h1
          variants={containerVariants}
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
                  variants={letterVariants}
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
          variants={taglineVariants}
          initial="hidden"
          animate="visible"
          className="text-xl md:text-2xl font-medium text-zavala-text-secondary mt-6"
        >
          {tagline}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="mt-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
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
