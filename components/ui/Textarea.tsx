import { TextareaHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  errorMessage?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, errorMessage, className, rows = 4, ...props }, ref) => {
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
      resize-none
    `

    const errorStyles = error
      ? 'border-2 border-zavala-accent-error focus:border-zavala-accent-error focus:ring-zavala-accent-error/20'
      : 'border-zavala-border focus:border-zavala-accent-primary focus:ring-zavala-accent-primary/20'

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          rows={rows}
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

Textarea.displayName = 'Textarea'
