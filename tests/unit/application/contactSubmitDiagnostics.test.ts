import { describe, expect, it } from 'vitest'
import {
  collectInvalidContactFields,
  summarizeContactDraft,
  summarizeContactError,
  summarizeContactSubmitPayload
} from '@/application/contact/contactSubmitDiagnostics'

describe('contactSubmitDiagnostics', () => {
  it('summarizes draft payload without exposing raw contact values', () => {
    expect(
      summarizeContactDraft({
        firstName: ' Ana ',
        email: 'ana@example.com',
        phone: '',
        comment: 'Necesito una propuesta.'
      })
    ).toEqual({
      filledFieldCount: 3,
      hasEmail: true,
      hasPhone: false,
      hasCompany: false,
      hasGeographicLocation: false,
      hasComment: true,
      commentLength: 23
    })
  })

  it('summarizes gateway payload with pathname and attribution keys only', () => {
    expect(
      summarizeContactSubmitPayload({
        name: 'Ana',
        email: 'ana@example.com',
        phone: '+54 11 5555 4444',
        company: 'Acme',
        geographicLocation: 'Escobar',
        comment: 'Necesito soporte',
        pageLocation: 'https://www.datamaq.com.ar/contacto?utm_source=google',
        trafficSource: 'google',
        userAgent: 'Vitest',
        createdAt: '2026-02-28T00:00:00.000Z',
        attribution: {
          utmSource: 'google',
          utmCampaign: 'search',
          gclid: ''
        }
      })
    ).toEqual({
      hasEmail: true,
      hasPhone: true,
      hasCompany: true,
      hasGeographicLocation: true,
      hasAttribution: true,
      attributionKeys: ['utmSource', 'utmCampaign'],
      commentLength: 16,
      pagePathname: '/contacto'
    })
  })

  it('summarizes errors and invalid field names', () => {
    expect(
      summarizeContactError({
        type: 'BackendError',
        status: 422,
        requestId: 'req_1',
        errorCode: 'VALIDATION',
        backendMessage: 'Ingresa e-mail o teléfono (al menos uno).'
      })
    ).toEqual({
      type: 'BackendError',
      status: 422,
      requestId: 'req_1',
      errorCode: 'VALIDATION',
      backendMessagePreview: 'Ingresa e-mail o teléfono (al menos uno).'
    })

    expect(
      collectInvalidContactFields({
        email: 'Ingresa un e-mail valido.',
        comment: 'Ingresa un comentario.'
      })
    ).toEqual(['comment', 'email'])
  })
})
