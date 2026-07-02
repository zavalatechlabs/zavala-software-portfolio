'use client'

import { CSSProperties, ReactNode } from 'react'
import { clsx } from 'clsx'
import { useInView } from '@/hooks/useInView'

interface FadeInViewProps {
  children: ReactNode
  className?: string
  /** Transition delay in seconds. */
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  once?: boolean
}

const DIRECTION_TRANSFORMS: Record<NonNullable<FadeInViewProps['direction']>, string> = {
  up: 'translateY(50px)',
  down: 'translateY(-50px)',
  left: 'translateX(50px)',
  right: 'translateX(-50px)',
}

/**
 * Fades content in when it scrolls into view. CSS transition driven — no
 * animation library. Reduced-motion users and no-JS visitors see content
 * immediately (handled by the `.fade-in-view` rules in globals.css).
 */
export function FadeInView({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
}: FadeInViewProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ amount: 0.3, once })

  const style: CSSProperties = {
    transitionDelay: delay ? `${delay}s` : undefined,
  }
  if (!isInView) {
    style.transform = DIRECTION_TRANSFORMS[direction]
  }

  return (
    <div
      ref={ref}
      className={clsx('fade-in-view', isInView && 'is-in-view', className)}
      style={style}
    >
      {children}
    </div>
  )
}
