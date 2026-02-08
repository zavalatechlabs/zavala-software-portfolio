import { cn, formatDate, sleep } from '../utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('text-lg', 'font-bold')).toBe('text-lg font-bold')
    })

    it('handles conditional classes', () => {
      const isActive = true
      expect(cn('base', isActive && 'active')).toBe('base active')
    })

    it('handles falsy values', () => {
      expect(cn('base', false, null, undefined, 'end')).toBe('base end')
    })

    it('merges conflicting Tailwind classes', () => {
      // tailwind-merge should keep the last conflicting class
      expect(cn('p-4', 'p-6')).toBe('p-6')
    })
  })

  describe('formatDate', () => {
    it('formats a date string correctly', () => {
      const result = formatDate('2024-01-15')
      expect(result).toBe('January 15, 2024')
    })

    it('formats a Date object correctly', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toBe('January 15, 2024')
    })
  })

  describe('sleep', () => {
    it('resolves after specified milliseconds', async () => {
      const start = Date.now()
      await sleep(100)
      const duration = Date.now() - start
      
      // Allow for some variance in timing
      expect(duration).toBeGreaterThanOrEqual(95)
      expect(duration).toBeLessThan(150)
    })

    it('returns a promise', () => {
      const result = sleep(10)
      expect(result).toBeInstanceOf(Promise)
    })
  })
})
