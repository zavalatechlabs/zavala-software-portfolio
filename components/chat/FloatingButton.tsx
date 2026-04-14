'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface FloatingButtonProps {
  onClick: () => void
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-40
        w-14 h-14
        bg-zavala-accent-primary
        rounded-full
        flex items-center justify-center
        shadow-lg shadow-zavala-accent-primary/30
        cursor-pointer
        no-print
        focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary focus-visible:outline-none
      "
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              scale: 1.1,
              transition: { duration: 0.2 },
            }
      }
      whileTap={
        prefersReducedMotion
          ? {}
          : {
              scale: 0.95,
              transition: { duration: 0.1 },
            }
      }
      animate={
        prefersReducedMotion
          ? {}
          : {
              boxShadow: [
                '0 4px 20px rgba(59, 130, 246, 0.3)',
                '0 4px 30px rgba(59, 130, 246, 0.5)',
                '0 4px 20px rgba(59, 130, 246, 0.3)',
              ],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }
      }
      aria-label="Open AI assistant"
    >
      {/* Animated sparkles icon */}
      <motion.div
        animate={prefersReducedMotion ? { rotate: 0 } : { rotate: [0, 180, 360] }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }
        }
      >
        <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
      </motion.div>
    </motion.button>
  )
}
