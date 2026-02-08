'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Folder, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const router = useRouter()

  const handleAction = (action: 'projects' | 'resume' | 'contact') => {
    switch (action) {
      case 'projects':
        router.push('/projects')
        onClose()
        break
      case 'resume':
        // Trigger resume download
        window.open('/resume.pdf', '_blank')
        break
      case 'contact':
        router.push('/contact')
        onClose()
        break
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          
          {/* Chat Window */}
          <motion.div
            className="
              fixed bottom-6 right-6 z-50
              w-[400px] max-w-[calc(100vw-3rem)]
              h-[500px] max-h-[calc(100vh-3rem)]
              bg-zavala-bg-surface
              border border-zavala-border
              rounded-lg
              shadow-2xl
              flex flex-col
              overflow-hidden
            "
            initial={{ 
              y: 100, 
              opacity: 0,
              scale: 0.9,
            }}
            animate={{ 
              y: 0, 
              opacity: 1,
              scale: 1,
            }}
            exit={{ 
              y: 100, 
              opacity: 0,
              scale: 0.9,
            }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zavala-border bg-zavala-bg-elevated">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-zavala-accent-primary to-zavala-accent-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-zavala-text-primary">Portfolio Assistant</h3>
                  <p className="text-xs text-zavala-text-tertiary">Quick actions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zavala-bg-surface rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-zavala-text-secondary" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-zavala-bg-elevated rounded-lg p-4 border border-zavala-border"
              >
                <p className="text-zavala-text-secondary text-sm">
                  👋 Hi! I&apos;m your portfolio assistant. Choose a quick action below:
                </p>
              </motion.div>

              {/* Quick Action: View Projects */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => handleAction('projects')}
                className="w-full p-4 bg-zavala-bg-elevated hover:bg-zavala-bg-primary border border-zavala-border hover:border-zavala-accent-primary/50 rounded-lg text-left transition-all group"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-zavala-accent-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-zavala-accent-primary/20 transition-colors">
                    <Folder className="w-5 h-5 text-zavala-accent-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zavala-text-primary mb-1">View Projects</p>
                    <p className="text-sm text-zavala-text-secondary">
                      Browse all projects and case studies
                    </p>
                  </div>
                </div>
              </motion.button>
              
              {/* Quick Action: Download Resume */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => handleAction('resume')}
                className="w-full p-4 bg-zavala-bg-elevated hover:bg-zavala-bg-primary border border-zavala-border hover:border-zavala-accent-secondary/50 rounded-lg text-left transition-all group"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-zavala-accent-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-zavala-accent-secondary/20 transition-colors">
                    <FileText className="w-5 h-5 text-zavala-accent-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zavala-text-primary mb-1">Download Resume</p>
                    <p className="text-sm text-zavala-text-secondary">
                      Get PDF version of full resume
                    </p>
                  </div>
                </div>
              </motion.button>
              
              {/* Quick Action: Contact Me */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => handleAction('contact')}
                className="w-full p-4 bg-zavala-bg-elevated hover:bg-zavala-bg-primary border border-zavala-border hover:border-zavala-accent-code/50 rounded-lg text-left transition-all group"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-zavala-accent-code/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-zavala-accent-code/20 transition-colors">
                    <Mail className="w-5 h-5 text-zavala-accent-code" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zavala-text-primary mb-1">Contact Me</p>
                    <p className="text-sm text-zavala-text-secondary">
                      Send a message or connect on social
                    </p>
                  </div>
                </div>
              </motion.button>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-zavala-border bg-zavala-bg-elevated">
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <span className="text-xl">🚀</span>
                </motion.div>
                <p className="text-xs text-zavala-text-tertiary">
                  Full AI chat coming soon!
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
