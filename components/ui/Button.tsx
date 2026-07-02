import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const baseStyles = `
  inline-flex items-center justify-center
  font-semibold rounded-lg
  transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary
  disabled:opacity-50 disabled:cursor-not-allowed
`

// Filled buttons use accent-primary-strong (#2563eb): white text on it meets
// WCAG AA (4.5:1+) in both themes, unlike the lighter default accent.
const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-zavala-accent-primary-strong text-white
    hover:bg-zavala-accent-primary-strong/90 hover:shadow-lg hover:shadow-zavala-accent-primary/20
    hover:-translate-y-0.5 active:translate-y-0
    focus-visible:ring-zavala-accent-primary
  `,
  secondary: `
    bg-transparent text-zavala-accent-primary
    border-2 border-zavala-accent-primary
    hover:bg-zavala-accent-primary-strong hover:border-zavala-accent-primary-strong hover:text-white
    hover:-translate-y-0.5 active:translate-y-0
    focus-visible:ring-zavala-accent-primary
  `,
  ghost: `
    bg-transparent text-zavala-text-secondary
    hover:bg-zavala-bg-elevated hover:text-zavala-text-primary
    active:bg-zavala-bg-surface
    focus-visible:ring-zavala-border-strong
  `,
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string
): string {
  return clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

/**
 * Button-styled link. Use this instead of wrapping <Button> in <Link> —
 * nesting a <button> inside an <a> is invalid HTML and creates double tab
 * stops. Internal hrefs render a Next.js <Link>; external ones a plain <a>.
 */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className)
  const isExternal = /^https?:\/\//.test(href)

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  )
}
