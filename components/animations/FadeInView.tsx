'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInViewProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  once?: boolean
}

export function FadeInView({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
}: FadeInViewProps) {
  const directions = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 },
  }
  
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{ 
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
