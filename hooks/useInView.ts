'use client'

import { RefObject, useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  /** Fraction of the element that must be visible before triggering (0-1). */
  amount?: number
  /** When true (default), stays `true` after the first intersection. */
  once?: boolean
}

/**
 * Tracks whether an element is in the viewport using IntersectionObserver.
 * Dependency-free replacement for framer-motion's useInView.
 *
 * Returns false on the server and first client render; consumers should pair
 * it with CSS that keeps content visible when JavaScript is unavailable
 * (see `.fade-in-view` in globals.css).
 */
export function useInView<T extends Element>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean] {
  const { amount = 0.3, once = true } = options
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Old browsers without IntersectionObserver: show content immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold: amount }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [amount, once])

  return [ref, isInView]
}
