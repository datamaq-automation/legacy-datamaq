import { describe, expect, it } from 'vitest'
import {
  buildWhatsAppQrHref,
  buildWhatsAppQrMessage
} from '@/application/constants/whatsappQr'

describe('whatsappQr config', () => {
  it('builds prefilled message with source tag', () => {
    const message = buildWhatsAppQrMessage({
      phoneE164: '5491122334455',
      message: 'Hola',
      sourceTag: 'qr_card'
    })

    expect(message).toBe('Hola\n\nOrigen: qr_card')
  })

  it('builds wa.me href with encoded message', () => {
    const href = buildWhatsAppQrHref({
      phoneE164: '5491122334455',
      message: 'Hola',
      sourceTag: 'qr_card'
    })

    expect(href).toBe('https://wa.me/5491122334455?text=Hola%0A%0AOrigen%3A%20qr_card')
  })
})
