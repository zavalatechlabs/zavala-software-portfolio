import { LabelHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  required?: boolean
}

export function Label({ children, required = false, className, ...props }: LabelProps) {
  return (
    <label
      className={clsx('block text-sm font-medium text-zavala-text-secondary mb-2', className)}
      {...props}
    >
      {children}
      {required && <span className="text-zavala-accent-error ml-1">*</span>}
    </label>
  )
}
