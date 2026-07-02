'use client'

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react'
import { flushSync } from 'react-dom'
import {
  DEFAULT_VARIANT,
  VARIANT_ATTRIBUTE,
  VARIANT_STORAGE_KEY,
  VariantId,
  isVariantId,
} from '@/lib/variants'

interface VariantContextValue {
  variant: VariantId
  setVariant: (variant: VariantId) => void
}

const VariantContext = createContext<VariantContextValue | null>(null)

function applyVariant(variant: VariantId) {
  const root = document.documentElement
  if (variant === DEFAULT_VARIANT) {
    root.removeAttribute(VARIANT_ATTRIBUTE)
  } else {
    root.setAttribute(VARIANT_ATTRIBUTE, variant)
  }
}

export function VariantProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<VariantId>(DEFAULT_VARIANT)

  // The pre-hydration script (see lib/variants.ts) may have already applied a
  // persisted variant to <html> before React loaded — sync state to it.
  useEffect(() => {
    const applied = document.documentElement.getAttribute(VARIANT_ATTRIBUTE)
    if (isVariantId(applied)) {
      setVariantState(applied)
    }
  }, [])

  const setVariant = useCallback((next: VariantId) => {
    const commit = () => {
      applyVariant(next)
      setVariantState(next)
    }

    try {
      localStorage.setItem(VARIANT_STORAGE_KEY, next)
    } catch {
      // Private browsing / storage disabled: the switch still works for the session.
    }

    // Animate the re-skin with the View Transitions API where available,
    // falling back to an instant swap (also for reduced-motion users).
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (typeof document.startViewTransition === 'function' && !prefersReducedMotion) {
      // flushSync so React commits the re-render inside the transition
      // callback — the API snapshots the DOM before and after the callback.
      document.startViewTransition(() => flushSync(commit))
    } else {
      commit()
    }
  }, [])

  return (
    <VariantContext.Provider value={{ variant, setVariant }}>{children}</VariantContext.Provider>
  )
}

export function useVariant(): VariantContextValue {
  const context = useContext(VariantContext)
  if (!context) {
    throw new Error('useVariant must be used within a VariantProvider')
  }
  return context
}
