import { describe, expect, it } from 'vitest'
import { mapContactRequestToSubmitPayload } from '@/application/contact/mappers/contactPayloadMapper'
import { ContactRequest } from '@/domain/contact/entities/ContactRequest'

describe('mapContactRequestToSubmitPayload', () => {
  it('maps domain contact to submit payload with metadata', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_1',
      name: 'Ada Lovelace',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '+54 11 5555 4444',
      company: 'Analytical',
      geographicLocation: 'CABA',
      message: 'Necesito cotizar una instalacion industrial.'
    })

    if (!result.ok) {
      throw new Error('Expected valid contact request')
    }

    const payload = mapContactRequestToSubmitPayload(result.data, {
      pageLocation: 'https://example.com',
      trafficSource: 'direct',
      userAgent: 'test-agent',
      createdAt: '2024-01-01T00:00:00.000Z'
    })

    expect(payload).toEqual({
      name: 'Ada Lovelace',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '+54 11 5555 4444',
      company: 'Analytical',
      geographicLocation: 'CABA',
      comment: 'Necesito cotizar una instalacion industrial.',
      pageLocation: 'https://example.com',
      trafficSource: 'direct',
      userAgent: 'test-agent',
      createdAt: '2024-01-01T00:00:00.000Z'
    })
  })

  it('uses empty comment when contact has no message', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_2',
      name: 'Grace Hopper',
      phone: '+54 11 4444 3333'
    })

    if (!result.ok) {
      throw new Error('Expected valid contact request')
    }

    const payload = mapContactRequestToSubmitPayload(result.data, {
      pageLocation: 'https://example.com',
      trafficSource: 'organic',
      userAgent: 'test-agent',
      createdAt: '2024-01-02T00:00:00.000Z'
    })

    expect(payload).toEqual({
      name: 'Grace Hopper',
      phone: '+54 11 4444 3333',
      comment: '',
      pageLocation: 'https://example.com',
      trafficSource: 'organic',
      userAgent: 'test-agent',
      createdAt: '2024-01-02T00:00:00.000Z'
    })
  })
})
