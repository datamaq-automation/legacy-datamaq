import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import { type ConsentManager, type ConsentStatus } from '@/application/consent/consentManager'
import { consentManagerKey } from '@/di/keys'

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    content: {
      getConsentContent: () => ({
        title: 'Usamos cookies para analitica',
        description: 'Acepta para habilitar medicion',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Rechazar'
      })
    }
  })
}))

function createConsentManager(initialStatus: ConsentStatus = 'unknown'): {
  manager: ConsentManager
  grant: ReturnType<typeof vi.fn>
  deny: ReturnType<typeof vi.fn>
} {
  let status = initialStatus
  const listeners = new Set<(nextStatus: ConsentStatus) => void>()
  const grant = vi.fn(() => {
    status = 'granted'
    listeners.forEach((listener) => listener(status))
  })
  const deny = vi.fn(() => {
    status = 'denied'
    listeners.forEach((listener) => listener(status))
  })

  const manager: ConsentManager = {
    getStatus: () => status,
    grant,
    deny,
    reset: () => {
      status = 'unknown'
      listeners.forEach((listener) => listener(status))
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }

  return { manager, grant, deny }
}

describe('ConsentBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.classList.remove('has-consent-banner')
  })

  afterEach(() => {
    document.body.classList.remove('has-consent-banner')
  })

  it('shows banner and accepts consent', async () => {
    const { manager, grant } = createConsentManager('unknown')

    render(ConsentBanner, {
      global: {
        provide: {
          [consentManagerKey as symbol]: manager
        }
      }
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(document.body).toHaveClass('has-consent-banner')

    await fireEvent.click(screen.getByTestId('consent-accept'))
    expect(grant).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(document.body).not.toHaveClass('has-consent-banner')
  })

  it('shows banner and rejects consent', async () => {
    const { manager, deny } = createConsentManager('unknown')

    render(ConsentBanner, {
      global: {
        provide: {
          [consentManagerKey as symbol]: manager
        }
      }
    })

    await fireEvent.click(screen.getByTestId('consent-reject'))
    expect(deny).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
