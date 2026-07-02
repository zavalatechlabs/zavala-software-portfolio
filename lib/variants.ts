/**
 * Design variant system.
 *
 * A variant is a complete visual re-skin driven by the `data-variant`
 * attribute on <html>: because every component styles itself through the
 * zavala-* CSS-variable tokens, swapping the variables re-themes the whole
 * site without touching component markup. Variant-specific atmosphere
 * (aurora field, CRT scanlines, cursor spotlight) is layered by
 * <VariantEffects>, which mounts only for the active variant — the Classic
 * variant renders exactly as before with zero added runtime cost.
 *
 * Client-safe: constants only.
 */

export const VARIANT_STORAGE_KEY = 'zavala-variant'
export const VARIANT_ATTRIBUTE = 'data-variant'

export const VARIANT_IDS = ['classic', 'aurora', 'terminal'] as const

export type VariantId = (typeof VARIANT_IDS)[number]

export const DEFAULT_VARIANT: VariantId = 'classic'

export interface VariantDefinition {
  id: VariantId
  name: string
  description: string
  /** Swatch colors for the switcher preview dots. */
  swatch: [string, string, string]
}

export const VARIANTS: readonly VariantDefinition[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'The original — minimal, near-black, blue accent',
    swatch: ['#0a0a0a', '#3b82f6', '#f5f5f5'],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Glassmorphism over a living gradient field',
    swatch: ['#060714', '#8b5cf6', '#22d3ee'],
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'CRT phosphor — scanlines, mono, green glow',
    swatch: ['#010409', '#3fb950', '#e6edf3'],
  },
] as const

export function isVariantId(value: unknown): value is VariantId {
  return typeof value === 'string' && (VARIANT_IDS as readonly string[]).includes(value)
}

/**
 * Pre-hydration script injected into <head>: applies the persisted variant
 * before first paint so there is no flash of the wrong skin. Mirrors the
 * next-themes approach; kept dependency-free and wrapped in try/catch for
 * environments without localStorage.
 */
export const VARIANT_INIT_SCRIPT = `try{var v=localStorage.getItem('${VARIANT_STORAGE_KEY}');if(v==='aurora'||v==='terminal'){document.documentElement.setAttribute('${VARIANT_ATTRIBUTE}',v)}}catch(e){}`
