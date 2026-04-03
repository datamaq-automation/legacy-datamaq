import { describe, expect, it } from 'vitest'
import {
  normalizeContactFormPayload,
  normalizeContactSubmitMetadata,
  normalizeOptionalText,
  normalizePreferredContactChannel
} from '@/application/contact/contactPayloadNormalization'

describe('contactPayloadNormalization', () => {
  it('normalizes optional text values by trimming and dropping empty values', () => {
    expect(normalizeOptionalText(undefined)).toBeUndefined()
    expect(normalizeOptionalText('')).toBeUndefined()
    expect(normalizeOptionalText('   ')).toBeUndefined()
    expect(normalizeOptionalText('  Juan  ')).toBe('Juan')
  })

  it('normalizes preferred contact channel to allowed values only', () => {
    expect(normalizePreferredContactChannel('whatsapp')).toBe('whatsapp')
    expect(normalizePreferredContactChannel('email')).toBe('email')
    expect(normalizePreferredContactChannel(undefined)).toBeUndefined()
    expect(normalizePreferredContactChannel('other' as unknown as 'whatsapp' | 'email')).toBeUndefined()
  })

  it('normalizes contact form payload fields consistently', () => {
    expect(
      normalizeContactFormPayload({
        firstName: '  Juan ',
        lastName: '  Perez ',
        company: '  ',
        email: ' juan@example.com ',
        phone: '',
        preferredContactChannel: 'whatsapp',
        geographicLocation: ' Escobar ',
        comment: ' Hola ',
        captchaToken: '  token '
      })
    ).toEqual({
      firstName: 'Juan',
      lastName: 'Perez',
      email: 'juan@example.com',
      preferredContactChannel: 'whatsapp',
      geographicLocation: 'Escobar',
      comment: 'Hola',
      captchaToken: 'token'
    })
  })

  it('normalizes contact submit metadata used by backend payload builder', () => {
    expect(
      normalizeContactSubmitMetadata({
        name: 'Juan Perez',
        comment: 'Necesito propuesta',
        pageLocation: 'https://example.com/contact',
        trafficSource: 'direct',
        userAgent: 'Vitest',
        createdAt: '2026-04-03T00:00:00.000Z',
        firstName: '  Juan ',
        lastName: '  ',
        preferredContactChannel: 'email'
      })
    ).toEqual({
      firstName: 'Juan',
      preferredContactChannel: 'email'
    })
  })
})
