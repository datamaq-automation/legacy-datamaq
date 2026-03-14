import { describe, expect, it } from 'vitest'
import type { QuoteValidationIssue } from '@/application/quote/quoteApiError'
import {
  collectInvalidQuoteFields,
  hasQuoteFormErrors,
  mapBackendValidationIssuesToQuoteErrors,
  validateQuoteForm,
  type QuoteFormState
} from '@/features/quote/application/quoteFormValidation'

function buildValidForm(overrides: Partial<QuoteFormState> = {}): QuoteFormState {
  return {
    company: 'ACME',
    contact_name: 'Ada Lovelace',
    locality: 'Escobar',
    scheduled: true,
    access_ready: true,
    safe_window_confirmed: true,
    bureaucracy: 'medium',
    email: 'ada@example.com',
    phone: '+54 11 5555 4444',
    notes: 'Necesitamos coordinacion',
    ...overrides
  }
}

describe('quoteFormValidation', () => {
  it('validates required local fields', () => {
    expect(
      validateQuoteForm(
        buildValidForm({
          company: ' ',
          contact_name: ' ',
          locality: ' ',
          scheduled: null,
          access_ready: null,
          safe_window_confirmed: null
        })
      )
    ).toEqual({
      company: 'Ingresa la empresa.',
      contact_name: 'Ingresa el nombre de contacto.',
      locality: 'Ingresa la localidad.',
      scheduled: 'Selecciona Sí o No.',
      access_ready: 'Selecciona Sí o No.',
      safe_window_confirmed: 'Selecciona Sí o No.'
    })
  })

  it('collects invalid fields and reports whether errors exist', () => {
    const errors = {
      company: 'Ingresa la empresa.',
      locality: '  ',
      scheduled: 'Selecciona Sí o No.'
    }

    expect(collectInvalidQuoteFields(errors)).toEqual(['company', 'scheduled'])
    expect(hasQuoteFormErrors(errors)).toBe(true)
    expect(hasQuoteFormErrors({})).toBe(false)
  })

  it('maps backend validation issues by field and loc path', () => {
    const issues: QuoteValidationIssue[] = [
      {
        field: 'company',
        loc: ['body', 'company'],
        message: 'Field required',
        type: 'missing'
      },
      {
        loc: ['body', 'safe_window_confirmed'],
        message: 'Confirmacion requerida',
        type: 'missing'
      },
      {
        loc: ['body', 'unknown_field'],
        message: 'Debe ignorarse',
        type: 'missing'
      },
      {
        loc: ['body', 'locality'],
        message: '   ',
        type: 'missing'
      }
    ]

    expect(mapBackendValidationIssuesToQuoteErrors(issues)).toEqual({
      company: 'Field required',
      safe_window_confirmed: 'Confirmacion requerida'
    })
  })
})
