import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zavala-bg-primary
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variantStyles = {
    primary: `
      bg-zavala-accent-primary text-white
      hover:bg-blue-600 hover:shadow-lg hover:shadow-zavala-accent-primary/20
      hover:-translate-y-0.5 active:translate-y-0
      focus:ring-zavala-accent-primary
    `,
    secondary: `
      bg-transparent text-zavala-accent-primary
      border-2 border-zavala-accent-primary
      hover:bg-zavala-accent-primary hover:text-white
      hover:-translate-y-0.5 active:translate-y-0
      focus:ring-zavala-accent-primary
    `,
    ghost: `
      bg-transparent text-zavala-text-secondary
      hover:bg-zavala-bg-elevated hover:text-zavala-text-primary
      active:bg-zavala-bg-surface
      focus:ring-zavala-border-strong
    `,
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
