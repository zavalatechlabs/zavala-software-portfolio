'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

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
  staggerDelay = 0
}: DecipherTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  
  useEffect(() => {
    if (!isInView || hasAnimated) return
    
    // Wait for stagger delay
    const staggerTimeout = setTimeout(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
      let iterations = 0
      const totalIterations = text.length
      
      // Smart duration scaling: shorter base, scaled by text length, capped at 600ms
      // Short text (1-5 chars): ~300ms, Medium (10 chars): ~400ms, Long (20+ chars): capped at 600ms
      const calculatedDuration = duration ?? Math.min(300 + text.length * 15, 600)
      const frameInterval = 15 // Reduced from 20ms for smoother, faster animation
      const iterationsPerFrame = totalIterations / (calculatedDuration / frameInterval)
      
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
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
          clearInterval(interval)
          setDisplayText(text)
          setHasAnimated(true)
        }
      }, frameInterval)
      
      return () => clearInterval(interval)
    }, staggerDelay)
    
    return () => clearTimeout(staggerTimeout)
  }, [isInView, text, duration, hasAnimated, staggerDelay])
  
  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  )
}
