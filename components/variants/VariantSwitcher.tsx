'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Palette, Check, X } from 'lucide-react'
import { VARIANTS, VariantId } from '@/lib/variants'
import { useVariant } from './VariantProvider'

/**
 * Floating design-variant switcher (bottom-right dock).
 *
 * Accessibility: the panel is a radiogroup; Escape closes it and returns
 * focus to the trigger; clicking outside closes it. The trigger exposes
 * aria-expanded/aria-controls.
 */
export function VariantSwitcher() {
  const { variant, setVariant } = useVariant()
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback((returnFocus = false) => {
    setIsOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }, [])

  // Escape closes and restores focus; outside click closes.
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true)
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        close()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [isOpen, close])

  const selectVariant = (id: VariantId) => {
    setVariant(id)
    close(true)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div
          ref={panelRef}
          id="variant-panel"
          role="radiogroup"
          aria-label="Design variant"
          className="
            absolute bottom-14 right-0 w-72
            rounded-xl border border-zavala-border
            bg-zavala-bg-surface/95 backdrop-blur-lg
            shadow-xl shadow-black/30
            p-2
            animate-fade-in-up
          "
        >
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-zavala-text-tertiary">
              Design Variant
            </p>
            <button
              type="button"
              onClick={() => close(true)}
              aria-label="Close variant picker"
              className="p-1 rounded text-zavala-text-tertiary hover:text-zavala-text-primary focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:outline-none"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-1">
            {VARIANTS.map((definition) => {
              const isActive = definition.id === variant
              return (
                <button
                  key={definition.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => selectVariant(definition.id)}
                  className={`
                    w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left
                    transition-colors duration-200
                    focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:outline-none
                    ${
                      isActive
                        ? 'bg-zavala-bg-elevated border border-zavala-accent-primary/40'
                        : 'border border-transparent hover:bg-zavala-bg-elevated'
                    }
                  `}
                >
                  {/* Swatch preview */}
                  <span className="flex -space-x-1.5 shrink-0" aria-hidden="true">
                    {definition.swatch.map((color, index) => (
                      <span
                        key={index}
                        className="w-4 h-4 rounded-full border border-zavala-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-zavala-text-primary">
                      {definition.name}
                    </span>
                    <span className="block text-xs text-zavala-text-tertiary truncate">
                      {definition.description}
                    </span>
                  </span>

                  {isActive && (
                    <Check
                      className="w-4 h-4 shrink-0 text-zavala-accent-primary"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'variant-panel' : undefined}
        aria-label="Switch design variant"
        className="
          flex items-center gap-2 px-4 py-2.5
          rounded-full border border-zavala-border
          bg-zavala-bg-surface/90 backdrop-blur-lg
          text-sm font-medium text-zavala-text-secondary
          shadow-lg shadow-black/20
          transition-all duration-200
          hover:text-zavala-text-primary hover:border-zavala-accent-primary/50 hover:-translate-y-0.5
          focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-bg-primary focus-visible:outline-none
        "
      >
        <Palette className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Style</span>
      </button>
    </div>
  )
}
