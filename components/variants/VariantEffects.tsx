'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useVariant } from './VariantProvider'

/**
 * Per-variant atmosphere layers. Mounted only for the active variant so the
 * Classic skin pays zero runtime cost. All layers are decorative
 * (aria-hidden, pointer-events-none) and sit behind the page content.
 */
export function VariantEffects() {
  const { variant } = useVariant()

  if (variant === 'aurora') return <AuroraField />
  if (variant === 'terminal') return <TerminalOverlay />
  return null
}

/**
 * Aurora: three GPU-composited gradient blobs drifting on CSS keyframes, a
 * slow conic sheen, an SVG-noise grain pass, and a cursor spotlight driven
 * by CSS custom properties updated inside requestAnimationFrame.
 */
function AuroraField() {
  const spotlightRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    // Spotlight only makes sense with a fine pointer (mouse/trackpad).
    if (!window.matchMedia('(pointer: fine)').matches) return

    const spotlight = spotlightRef.current
    if (!spotlight) return

    let frame = 0
    const onPointerMove = (event: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        spotlight.style.setProperty('--spot-x', `${event.clientX}px`)
        spotlight.style.setProperty('--spot-y', `${event.clientY}px`)
        spotlight.style.opacity = '1'
      })
    }
    const onPointerLeave = () => {
      spotlight.style.opacity = '0'
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [prefersReducedMotion])

  return (
    <div aria-hidden="true" data-testid="aurora-field" className="variant-layer">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-sheen" />
      <div className="aurora-grain" />
      <div ref={spotlightRef} className="aurora-spotlight" />
    </div>
  )
}

/**
 * Terminal: phosphor dot grid, CRT scanlines, and an edge vignette. The
 * subtle flicker is CSS-only and disabled by the global reduced-motion rule.
 */
function TerminalOverlay() {
  return (
    <div aria-hidden="true" data-testid="terminal-overlay" className="variant-layer">
      <div className="terminal-grid" />
      <div className="terminal-scanlines" />
      <div className="terminal-vignette" />
    </div>
  )
}
