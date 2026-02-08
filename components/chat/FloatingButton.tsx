'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface FloatingButtonProps {
  onClick: () => void
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
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
      "
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      animate={{
        boxShadow: [
          '0 4px 20px rgba(59, 130, 246, 0.3)',
          '0 4px 30px rgba(59, 130, 246, 0.5)',
          '0 4px 20px rgba(59, 130, 246, 0.3)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-label="Open AI assistant"
    >
      {/* Animated sparkles icon */}
      <motion.div
        animate={{ rotate: [0, 180, 360] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.div>
    </motion.button>
  )
}
