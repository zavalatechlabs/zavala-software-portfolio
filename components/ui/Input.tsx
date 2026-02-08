import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, errorMessage, className, ...props }, ref) => {
    const baseStyles = `
      w-full px-4 py-3
      bg-zavala-bg-surface 
      border rounded-lg
      text-zavala-text-primary
      placeholder:text-zavala-text-tertiary
      transition-all duration-200
      focus:outline-none 
      focus:ring-2
      hover:border-zavala-border-strong
      disabled:opacity-50 disabled:cursor-not-allowed
    `

    const errorStyles = error
      ? 'border-2 border-zavala-accent-error focus:border-zavala-accent-error focus:ring-zavala-accent-error/20'
      : 'border-zavala-border focus:border-zavala-accent-primary focus:ring-zavala-accent-primary/20'

    return (
      <div className="w-full">
        <input
          ref={ref}
          className={clsx(baseStyles, errorStyles, className)}
          {...props}
        />
        {error && errorMessage && (
          <p className="text-sm text-zavala-accent-error mt-1">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
