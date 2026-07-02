import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Required: used to wire the error message via aria-describedby. */
  id: string
  /** Error message. When set, the input is styled and announced as invalid. */
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, error, className, ...props }, ref) => {
    const errorId = `${id}-error`

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

    const stateStyles = error
      ? 'border-zavala-accent-error focus:border-zavala-accent-error focus:ring-zavala-accent-error/20'
      : 'border-zavala-border focus:border-zavala-accent-primary focus:ring-zavala-accent-primary/20'

    return (
      <div className="w-full">
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={clsx(baseStyles, stateStyles, className)}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-zavala-accent-error mt-1 animate-fade-in-up">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
