'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface DecipherTextProps {
  text: string
  className?: string
  duration?: number // milliseconds
  staggerDelay?: number // delay before animation starts
}

export function DecipherText({
  text,
  className = '',
  duration,
  staggerDelay = 0,
}: DecipherTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const [displayText, setDisplayText] = useState(text)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView || hasAnimated || prefersReducedMotion) return

    // Wait for stagger delay
    const staggerTimeout = setTimeout(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
      const textChars = text.split('')
      let iterations = 0
      const totalIterations = text.length

      // Smart duration scaling: shorter base, scaled by text length, capped at 600ms
      // Short text (1-5 chars): ~300ms, Medium (10 chars): ~400ms, Long (20+ chars): capped at 600ms
      const calculatedDuration = duration ?? Math.min(300 + text.length * 15, 600)
      const frameInterval = 15 // Reduced from 20ms for smoother, faster animation
      const iterationsPerFrame = totalIterations / (calculatedDuration / frameInterval)

      intervalRef.current = setInterval(() => {
        setDisplayText(
          textChars
            .map((char, index) => {
              // Preserve spaces
              if (char === ' ') return ' '

              // If we've reached this character, show the real character
              if (index < iterations) return text[index]

              // Otherwise, show random character
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        )

        iterations += iterationsPerFrame

        if (iterations >= totalIterations) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null
          setDisplayText(text)
          setHasAnimated(true)
        }
      }, frameInterval)
    }, staggerDelay)

    return () => {
      clearTimeout(staggerTimeout)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isInView, text, duration, hasAnimated, staggerDelay, prefersReducedMotion])

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  )
}
