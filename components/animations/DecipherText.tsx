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
  duration = 600,
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
      const iterationsPerFrame = totalIterations / (duration / 20) // 20ms per frame
      
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
      }, 20)
      
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
