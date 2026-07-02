import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VariantProvider, useVariant } from '../VariantProvider'
import { VariantSwitcher } from '../VariantSwitcher'
import { VariantEffects } from '../VariantEffects'
import { VARIANT_ATTRIBUTE, VARIANT_STORAGE_KEY } from '@/lib/variants'

// The provider consults matchMedia for reduced-motion before animating a
// switch; the effects layer consults it for pointer capability.
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute(VARIANT_ATTRIBUTE)
})

function renderSwitcher() {
  return render(
    <VariantProvider>
      <VariantEffects />
      <VariantSwitcher />
    </VariantProvider>
  )
}

describe('VariantSwitcher', () => {
  it('renders the trigger with collapsed state', () => {
    renderSwitcher()

    const trigger = screen.getByRole('button', { name: /switch design variant/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the panel and lists all three variants', async () => {
    renderSwitcher()

    await userEvent.click(screen.getByRole('button', { name: /switch design variant/i }))

    expect(screen.getByRole('radiogroup', { name: /design variant/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /classic/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /aurora/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /terminal/i })).toBeInTheDocument()
  })

  it('marks the active variant as checked (classic by default)', async () => {
    renderSwitcher()

    await userEvent.click(screen.getByRole('button', { name: /switch design variant/i }))

    expect(screen.getByRole('radio', { name: /classic/i })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: /aurora/i })).toHaveAttribute('aria-checked', 'false')
  })

  it('selecting Aurora sets the html attribute, persists, and mounts its effects', async () => {
    renderSwitcher()

    await userEvent.click(screen.getByRole('button', { name: /switch design variant/i }))
    await userEvent.click(screen.getByRole('radio', { name: /aurora/i }))

    expect(document.documentElement.getAttribute(VARIANT_ATTRIBUTE)).toBe('aurora')
    expect(localStorage.getItem(VARIANT_STORAGE_KEY)).toBe('aurora')
    expect(screen.getByTestId('aurora-field')).toBeInTheDocument()
    expect(screen.queryByTestId('terminal-overlay')).not.toBeInTheDocument()
  })

  it('selecting Terminal mounts its overlay', async () => {
    renderSwitcher()

    await userEvent.click(screen.getByRole('button', { name: /switch design variant/i }))
    await userEvent.click(screen.getByRole('radio', { name: /terminal/i }))

    expect(document.documentElement.getAttribute(VARIANT_ATTRIBUTE)).toBe('terminal')
    expect(screen.getByTestId('terminal-overlay')).toBeInTheDocument()
  })

  it('switching back to Classic removes the attribute and all effect layers', async () => {
    renderSwitcher()

    await userEvent.click(screen.getByRole('button', { name: /switch design variant/i }))
    await userEvent.click(screen.getByRole('radio', { name: /aurora/i }))

    await userEvent.click(screen.getByRole('button', { name: /switch design variant/i }))
    await userEvent.click(screen.getByRole('radio', { name: /classic/i }))

    expect(document.documentElement.hasAttribute(VARIANT_ATTRIBUTE)).toBe(false)
    expect(localStorage.getItem(VARIANT_STORAGE_KEY)).toBe('classic')
    expect(screen.queryByTestId('aurora-field')).not.toBeInTheDocument()
    expect(screen.queryByTestId('terminal-overlay')).not.toBeInTheDocument()
  })

  it('closes the panel after selection and returns focus to the trigger', async () => {
    renderSwitcher()

    const trigger = screen.getByRole('button', { name: /switch design variant/i })
    await userEvent.click(trigger)
    await userEvent.click(screen.getByRole('radio', { name: /aurora/i }))

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('Escape closes the panel and returns focus to the trigger', async () => {
    renderSwitcher()

    const trigger = screen.getByRole('button', { name: /switch design variant/i })
    await userEvent.click(trigger)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('clicking outside closes the panel', async () => {
    renderSwitcher()

    await userEvent.click(screen.getByRole('button', { name: /switch design variant/i }))
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()

    fireEvent.pointerDown(document.body)

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
  })
})

describe('VariantProvider', () => {
  it('syncs to a variant applied by the pre-hydration script', () => {
    document.documentElement.setAttribute(VARIANT_ATTRIBUTE, 'terminal')

    renderSwitcher()

    expect(screen.getByTestId('terminal-overlay')).toBeInTheDocument()
  })

  it('ignores an invalid persisted attribute', () => {
    document.documentElement.setAttribute(VARIANT_ATTRIBUTE, 'bogus')

    renderSwitcher()

    expect(screen.queryByTestId('aurora-field')).not.toBeInTheDocument()
    expect(screen.queryByTestId('terminal-overlay')).not.toBeInTheDocument()
  })

  it('uses the View Transitions API when available', async () => {
    const startViewTransition = jest.fn((callback: () => void) => callback())
    const doc = document as unknown as Record<string, unknown>
    doc.startViewTransition = startViewTransition

    renderSwitcher()
    await userEvent.click(screen.getByRole('button', { name: /switch design variant/i }))
    await userEvent.click(screen.getByRole('radio', { name: /aurora/i }))

    expect(startViewTransition).toHaveBeenCalledTimes(1)
    expect(document.documentElement.getAttribute(VARIANT_ATTRIBUTE)).toBe('aurora')

    delete doc.startViewTransition
  })

  it('useVariant throws outside the provider', () => {
    function Orphan() {
      useVariant()
      return null
    }
    // Silence React's error boundary logging for the expected throw
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Orphan />)).toThrow(/within a VariantProvider/)
    spy.mockRestore()
  })

  it('still switches when localStorage is unavailable', async () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })

    renderSwitcher()
    await userEvent.click(screen.getByRole('button', { name: /switch design variant/i }))
    await act(async () => {
      await userEvent.click(screen.getByRole('radio', { name: /aurora/i }))
    })

    expect(document.documentElement.getAttribute(VARIANT_ATTRIBUTE)).toBe('aurora')
    setItem.mockRestore()
  })
})
