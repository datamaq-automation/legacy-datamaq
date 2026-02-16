import { describe, expect, it } from 'vitest'
import { mapContactRequestToSubmitPayload } from '@/application/contact/mappers/contactPayloadMapper'
import { ContactRequest } from '@/domain/contact/entities/ContactRequest'

describe('mapContactRequestToSubmitPayload', () => {
  it('maps domain contact to submit payload with metadata', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
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
      email: 'ada@example.com',
      message: 'Necesito cotizar una instalacion industrial.',
      pageLocation: 'https://example.com',
      trafficSource: 'direct',
      userAgent: 'test-agent',
      createdAt: '2024-01-01T00:00:00.000Z'
    })
  })

  it('uses empty message when contact has no message', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_2',
      name: 'Grace Hopper',
      email: 'grace@example.com'
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
      email: 'grace@example.com',
      message: '',
      pageLocation: 'https://example.com',
      trafficSource: 'organic',
      userAgent: 'test-agent',
      createdAt: '2024-01-02T00:00:00.000Z'
    })
  })
})
