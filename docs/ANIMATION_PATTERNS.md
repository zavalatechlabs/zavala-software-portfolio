# Animation Patterns and Interactions

**Project:** Zavala Software Portfolio  
**Version:** 1.0  
**Last Updated:** 2026-02-08  
**Status:** Active

---

## Overview

This document defines all animation patterns, timing specifications, and interaction behaviors for the Zavala Software Portfolio. Animations should feel premium, purposeful, and performant.

**Animation Philosophy:** Subtle sophistication over flashy gimmicks. Animations should enhance usability, guide attention, and create delight without overwhelming the user.

**Reference:** See [`DESIGN_DIRECTION.md`](./DESIGN_DIRECTION.md) for design decisions and feature priorities.

---

## Core Animation Library

### Framer Motion Setup

**Installation:**
```bash
npm install framer-motion
```

**Configuration:**
```tsx
// app/layout.tsx
import { LazyMotion, domAnimation } from 'framer-motion'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </body>
    </html>
  )
}
```

**Why Framer Motion:**
- Declarative animation API
- Excellent TypeScript support
- Built-in gesture handlers
- Optimized for React Server Components
- Easy orchestration and sequencing

---

## Must-Have Animations

### 1. Name Reveal Animation (Hero Load) 🌟

**Priority:** CRITICAL — This is the signature animation that sets the tone for the entire site.

#### Specifications

**Trigger:** Page load (homepage hero section)  
**Duration:** 2.5 seconds total  
**Effect:** Letters appear sequentially with staggered timing  
**Easing:** Custom ease-out curve  

#### Animation Breakdown

1. **Initial State:** Letters invisible and slightly below position
2. **Animation:** Each letter fades in and slides up into position
3. **Stagger Delay:** 0.08s between each letter
4. **Final State:** Full name visible with tagline fade-in

#### Desktop Implementation

```tsx
// components/HeroNameReveal.tsx
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

export function HeroNameReveal() {
  const name = 'Max Zavala'
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Name with letter-by-letter reveal */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-6xl md:text-8xl font-bold tracking-tight text-zavala-text-primary"
        >
          {name.split('').map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              variants={letterVariants}
              className="inline-block"
              style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>
        
        {/* Tagline fades in after name */}
        <motion.p
          variants={taglineVariants}
          initial="hidden"
          animate="visible"
          className="text-xl md:text-2xl font-medium text-zavala-text-secondary mt-6"
        >
          Software Engineer | AI Enthusiast
        </motion.p>
      </div>
    </div>
  )
}
```

#### Mobile Optimization

Mobile devices get a slightly faster, simpler animation:

```tsx
// hooks/useIsMobile.ts
import { useState, useEffect } from 'react'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}
```

```tsx
// Mobile-optimized variant
const mobileLetterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export function HeroNameReveal() {
  const isMobile = useIsMobile()
  const name = 'Max Zavala'
  
  const variants = isMobile ? mobileLetterVariants : letterVariants
  const staggerDelay = isMobile ? 0.05 : 0.08
  
  return (
    <motion.h1
      variants={{
        visible: {
          transition: { staggerChildren: staggerDelay }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      {name.split('').map((char, i) => (
        <motion.span key={i} variants={variants}>
          {char}
        </motion.span>
      ))}
    </motion.h1>
  )
}
```

#### Alternative: Glitch/Matrix Effect

For a more techy feel, letters can cycle through random characters:

```tsx
'use client'

import { useState, useEffect } from 'react'

export function HeroNameGlitch() {
  const finalText = 'Max Zavala'
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let iterations = 0
    const maxIterations = finalText.length
    
    const interval = setInterval(() => {
      setDisplayText(
        finalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iterations) return finalText[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      
      iterations += 1 / 3
      
      if (iterations >= maxIterations) {
        clearInterval(interval)
        setDisplayText(finalText)
        setIsComplete(true)
      }
    }, 30)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <h1 className="text-6xl md:text-8xl font-bold font-mono tracking-tight text-zavala-text-primary">
      {displayText}
    </h1>
  )
}
```

---

### 2. Text Decipher Effect (Scroll-Triggered) 🌟

**Priority:** CRITICAL — Creates mystery and engagement as users explore the site.

#### Specifications

**Trigger:** Intersection Observer (element enters viewport)  
**Duration:** 0.8-1.2 seconds  
**Effect:** Scrambled characters resolve to real text  
**Elements:** Section headings, project titles  

#### Implementation

```tsx
// components/DecipherText.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

interface DecipherTextProps {
  text: string
  className?: string
  duration?: number // milliseconds
}

export function DecipherText({ 
  text, 
  className = '', 
  duration = 1000 
}: DecipherTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  
  useEffect(() => {
    if (!isInView || hasAnimated) return
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let iterations = 0
    const totalIterations = text.length
    const iterationsPerFrame = totalIterations / (duration / 30) // 30ms per frame
    
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
    }, 30)
    
    return () => clearInterval(interval)
  }, [isInView, text, duration, hasAnimated])
  
  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  )
}
```

#### Usage Example

```tsx
// Apply to section headings
<h2 className="text-3xl md:text-5xl font-bold">
  <DecipherText text="Selected Projects" />
</h2>

// Apply to project titles on hover
<h3 className="text-xl font-semibold group-hover:animate-decipher">
  <DecipherText text="E-commerce Platform" duration={800} />
</h3>
```

#### Alternative: Library-Based Implementation

Using `react-text-scramble`:

```tsx
import { TextScramble } from 'react-text-scramble'

<TextScramble 
  text="Selected Projects"
  className="text-3xl md:text-5xl font-bold"
  scramble={6}
  speed={50}
/>
```

#### Performance Optimization

For multiple decipher elements on one page:

```tsx
// Use Intersection Observer ratio to stagger animations
const DecipherText = ({ text, staggerDelay = 0 }) => {
  // ... (add delay before starting animation)
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Start animation
    }, staggerDelay)
    
    return () => clearTimeout(timeout)
  }, [staggerDelay])
}

// Usage
<DecipherText text="About Me" staggerDelay={0} />
<DecipherText text="My Projects" staggerDelay={200} />
<DecipherText text="Contact" staggerDelay={400} />
```

---

## Card Interactions

### 3. Project Card Hover Effects

#### Specifications

**Trigger:** Mouse hover  
**Duration:** 200-300ms  
**Effects:** Lift, shadow increase, border glow  
**Easing:** Ease-out  

#### Implementation

```tsx
// components/ProjectCard.tsx
'use client'

import { motion } from 'framer-motion'

interface ProjectCardProps {
  title: string
  description: string
  image: string
  tags: string[]
  href: string
}

export function ProjectCard({ 
  title, 
  description, 
  image, 
  tags, 
  href 
}: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{
        y: -8,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      className="group"
    >
      <a href={href} className="block">
        <div className="
          bg-zavala-bg-surface 
          border border-zavala-border 
          rounded-lg 
          overflow-hidden
          transition-all duration-200
          group-hover:border-zavala-accent-primary/50
          group-hover:shadow-xl group-hover:shadow-black/30
        ">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-zavala-bg-elevated">
            <motion.img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Overlay that appears on hover */}
            <motion.div
              className="absolute inset-0 bg-zavala-accent-primary/10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </div>
          
          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-zavala-text-primary group-hover:text-zavala-accent-primary transition-colors">
              {title}
            </h3>
            <p className="text-zavala-text-secondary text-sm mb-4 line-clamp-2">
              {description}
            </p>
            
            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 text-xs font-mono bg-zavala-bg-elevated border border-zavala-border rounded-full group-hover:border-zavala-accent-primary/30 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* CTA */}
            <span className="text-zavala-accent-primary font-medium text-sm inline-flex items-center gap-2">
              View Project 
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: 'easeInOut',
                }}
              >
                →
              </motion.span>
            </span>
          </div>
        </div>
      </a>
    </motion.article>
  )
}
```

#### Stagger Animation for Card Grids

```tsx
// components/ProjectGrid.tsx
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={cardVariants}>
          <ProjectCard {...project} />
        </motion.div>
      ))}
    </motion.div>
  )
}
```

---

## Interactive Elements

### 4. AI Chat Widget Animations

**Note:** v1 implementation is visual only (no AI functionality).

#### Specifications

**Floating Button:**
- Pulse animation (idle state)
- Scale up on hover
- Bounce on click

**Chat Window:**
- Slide up from bottom
- Backdrop blur fade-in
- Smooth entrance/exit

#### Implementation

```tsx
// components/AIChat/FloatingButton.tsx
'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface FloatingButtonProps {
  onClick: () => void
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14
        bg-zavala-accent-primary
        rounded-full
        flex items-center justify-center
        shadow-lg shadow-zavala-accent-primary/30
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
      <MessageCircle className="w-6 h-6 text-white" />
    </motion.button>
  )
}
```

```tsx
// components/AIChat/ChatWindow.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
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
              h-[600px] max-h-[calc(100vh-3rem)]
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
            <div className="flex items-center justify-between p-4 border-b border-zavala-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zavala-accent-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-zavala-text-primary">Portfolio Assistant</h3>
                  <p className="text-xs text-zavala-text-tertiary">Ask me anything</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zavala-bg-elevated rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zavala-text-secondary" />
              </button>
            </div>
            
            {/* Quick Actions (v1 - placeholder) */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <motion.button
                className="w-full p-4 bg-zavala-bg-elevated hover:bg-zavala-bg-primary border border-zavala-border rounded-lg text-left transition-colors"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-medium text-zavala-text-primary">📁 View Projects</p>
                <p className="text-sm text-zavala-text-secondary mt-1">
                  Browse all projects and case studies
                </p>
              </motion.button>
              
              <motion.button
                className="w-full p-4 bg-zavala-bg-elevated hover:bg-zavala-bg-primary border border-zavala-border rounded-lg text-left transition-colors"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-medium text-zavala-text-primary">📄 Download Resume</p>
                <p className="text-sm text-zavala-text-secondary mt-1">
                  Get PDF version of full resume
                </p>
              </motion.button>
              
              <motion.button
                className="w-full p-4 bg-zavala-bg-elevated hover:bg-zavala-bg-primary border border-zavala-border rounded-lg text-left transition-colors"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-medium text-zavala-text-primary">💬 Contact Me</p>
                <p className="text-sm text-zavala-text-secondary mt-1">
                  Send a message or connect on social
                </p>
              </motion.button>
            </div>
            
            {/* Footer note */}
            <div className="p-4 border-t border-zavala-border">
              <p className="text-xs text-zavala-text-tertiary text-center">
                Full AI chat coming soon! 🚀
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

```tsx
// components/AIChat/index.tsx
'use client'

import { useState } from 'react'
import { FloatingButton } from './FloatingButton'
import { ChatWindow } from './ChatWindow'

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <FloatingButton onClick={() => setIsOpen(true)} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
```

---

## Scroll-Triggered Animations

### 5. Fade-In Elements

#### Specifications

**Trigger:** Element enters viewport (50% visible)  
**Duration:** 600-800ms  
**Effect:** Fade in + slide up  
**Easing:** Ease-out  

#### Reusable Component

```tsx
// components/FadeInView.tsx
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
```

#### Usage Examples

```tsx
// Single element
<FadeInView>
  <h2>About Me</h2>
  <p>I'm a software engineer...</p>
</FadeInView>

// Staggered elements
<div>
  <FadeInView delay={0}>
    <Card>First card</Card>
  </FadeInView>
  <FadeInView delay={0.1}>
    <Card>Second card</Card>
  </FadeInView>
  <FadeInView delay={0.2}>
    <Card>Third card</Card>
  </FadeInView>
</div>

// Different directions
<FadeInView direction="left">
  <SidebarContent />
</FadeInView>

<FadeInView direction="right">
  <MainContent />
</FadeInView>
```

---

## Accessibility

### 6. Respect `prefers-reduced-motion`

All animations must respect user motion preferences.

#### Implementation

```tsx
// hooks/useReducedMotion.ts
import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  return reducedMotion
}
```

#### Usage in Components

```tsx
// components/AnimatedComponent.tsx
'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function AnimatedComponent() {
  const reducedMotion = useReducedMotion()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: reducedMotion ? 0 : 0.5 
      }}
    >
      Content
    </motion.div>
  )
}
```

#### Global CSS Approach

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Keyboard Navigation

Ensure all animated interactive elements are keyboard accessible:

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ scale: 1.05 }} // Same as hover
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Handle action
    }
  }}
>
  Click Me
</motion.button>
```

### Skip Animation Option

Provide a way to skip long animations:

```tsx
export function HeroNameReveal() {
  const [skipAnimation, setSkipAnimation] = useState(false)
  
  if (skipAnimation) {
    return <h1>Max Zavala</h1>
  }
  
  return (
    <>
      <AnimatedName onComplete={() => {}} />
      <button 
        onClick={() => setSkipAnimation(true)}
        className="absolute bottom-4 right-4 text-sm"
      >
        Skip animation
      </button>
    </>
  )
}
```

---

## Performance Optimization

### Lazy Loading Animations

Only load animation libraries when needed:

```tsx
// Lazy load Framer Motion for non-critical animations
const LazyMotionComponent = dynamic(
  () => import('./MotionComponent'),
  { ssr: false }
)
```

### GPU Acceleration

Use transform properties for best performance:

```tsx
// ✅ Good: Uses GPU acceleration
<motion.div
  animate={{ x: 100, y: 50, scale: 1.2 }}
/>

// ❌ Avoid: Forces layout recalculation
<motion.div
  animate={{ left: 100, top: 50, width: 200 }}
/>
```

### Animation Timing

```typescript
// Animation duration guidelines
const ANIMATION_DURATIONS = {
  instant: 0,           // Immediate state changes
  fast: 150,            // Micro-interactions (hover, toggle)
  normal: 300,          // Standard animations (modals, drawers)
  slow: 500,            // Emphasis animations (page transitions)
  emphasis: 1000,       // Hero animations (name reveal)
} as const
```

---

## Animation Catalog

### Quick Reference Table

| Animation | Trigger | Duration | Easing | Priority |
|-----------|---------|----------|--------|----------|
| Name Reveal | Page load | 2.5s | Custom ease-out | CRITICAL |
| Text Decipher | Scroll in view | 1.0s | Linear | CRITICAL |
| Card Hover | Mouse hover | 0.2s | Ease-out | High |
| Card Grid Stagger | Scroll in view | 0.5s per item | Ease-out | High |
| Button Hover | Mouse hover | 0.15s | Ease-out | Medium |
| Fade In View | Scroll in view | 0.6s | Ease-out | Medium |
| AI Chat Open | Click | 0.3s | Spring | Medium |
| AI Pulse | Continuous | 2.0s | Ease-in-out | Low |
| Page Transition | Navigation | 0.4s | Ease-in-out | Nice-to-have |

---

## Code Snippets Library

### Spring Animation

```tsx
<motion.div
  animate={{ scale: 1 }}
  transition={{
    type: 'spring',
    stiffness: 300,
    damping: 20,
  }}
/>
```

### Sequence Animation

```tsx
<motion.div
  animate={{
    x: [0, 100, 0],
    opacity: [0, 1, 1, 0],
  }}
  transition={{
    duration: 2,
    times: [0, 0.3, 0.7, 1],
  }}
/>
```

### Gesture Animations

```tsx
<motion.div
  drag
  dragConstraints={{ left: -100, right: 100 }}
  whileDrag={{ scale: 1.1 }}
  onDragEnd={(e, info) => {
    // Handle drag end
  }}
/>
```

### Exit Animations

```tsx
import { AnimatePresence } from 'framer-motion'

<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

---

## Testing Animations

### Manual Testing Checklist

- [ ] All animations complete successfully
- [ ] No jank or stuttering
- [ ] Reduced motion is respected
- [ ] Animations work on mobile (60fps minimum)
- [ ] Keyboard navigation works with animations
- [ ] Animations don't block user interaction
- [ ] No layout shifts during animations

### Performance Testing

```tsx
// Measure animation performance
const AnimationPerformance = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Animation frame:', entry.duration)
      }
    })
    
    observer.observe({ entryTypes: ['measure'] })
    
    return () => observer.disconnect()
  }, [])
}
```

---

## References

- **Design Direction:** [`DESIGN_DIRECTION.md`](./DESIGN_DIRECTION.md) — Feature priorities and design decisions
- **Design System:** [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Colors, typography, component styles
- **Framer Motion:** [framer.com/motion](https://www.framer.com/motion/)
- **Animation Best Practices:** [web.dev/animations](https://web.dev/animations/)
- **Reduced Motion:** [developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

---

**Document Status:** ✅ Complete  
**Next Steps:** Begin Phase 4 implementation with name reveal and text decipher animations
