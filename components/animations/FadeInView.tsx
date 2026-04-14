'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

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
  const prefersReducedMotion = useReducedMotion()

  const directions = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 },
  }

  const staticState = { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? staticState
          : {
              opacity: 0,
              ...directions[direction],
            }
      }
      whileInView={staticState}
      viewport={{ once, amount: 0.3 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              duration: 0.6,
              delay,
              ease: 'easeOut',
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}
