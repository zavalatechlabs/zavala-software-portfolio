'use client'

import dynamic from 'next/dynamic'
import { useInView } from '@/hooks/useInView'

const TerminalWindow = dynamic(
  () => import('@/components/TerminalWindow').then((mod) => ({ default: mod.TerminalWindow })),
  {
    ssr: false,
    loading: () => <TerminalPlaceholder />,
  }
)

function TerminalPlaceholder() {
  return <div className="h-64 bg-zavala-terminal-bg rounded-lg animate-pulse" aria-hidden="true" />
}

/**
 * Defers the TerminalWindow chunk until the footer scrolls near the viewport.
 * A plain next/dynamic import is still preloaded with the page; gating the
 * render on IntersectionObserver means the chunk is only fetched when the
 * user actually approaches the footer.
 */
export function LazyTerminalWindow() {
  const [ref, isInView] = useInView<HTMLDivElement>({ amount: 0.1, once: true })

  return <div ref={ref}>{isInView ? <TerminalWindow /> : <TerminalPlaceholder />}</div>
}
