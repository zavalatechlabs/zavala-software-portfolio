import { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
}

export function Card({ 
  children, 
  hover = false, 
  className, 
  ...props 
}: CardProps) {
  const baseStyles = `
    bg-zavala-bg-surface 
    border border-zavala-border 
    rounded-lg 
    overflow-hidden
  `

  const hoverStyles = hover
    ? `
      transition-all duration-200
      hover:border-zavala-accent-primary/50
      hover:shadow-xl hover:shadow-black/30
      hover:-translate-y-2
    `
    : ''

  return (
    <div 
      className={clsx(baseStyles, hoverStyles, className)} 
      {...props}
    >
      {children}
    </div>
  )
}
