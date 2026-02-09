import { describe, expect, it } from 'vitest'
import { mapContactRequestToSubmitPayload } from '@/application/contact/mappers/contactPayloadMapper'
import { ContactRequest } from '@/domain/contact/entities/ContactRequest'

describe('mapContactRequestToSubmitPayload', () => {
  it('maps domain contact to submit payload with metadata', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: 'Analytical',
      message: 'Hola'
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
      firstName: 'Ada',
      lastName: 'Lovelace',
      phoneNumber: undefined,
      city: undefined,
      country: undefined,
      company: 'Analytical',
      pageLocation: 'https://example.com',
      trafficSource: 'direct',
      userAgent: 'test-agent',
      createdAt: '2024-01-01T00:00:00.000Z'
    })
  })

  it('omite opcionales vacíos en el payload', () => {
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

    expect(payload.company).toBeUndefined()
    expect(payload).toEqual({
      name: 'Grace Hopper',
      email: 'grace@example.com',
      firstName: 'Grace',
      lastName: 'Hopper',
      phoneNumber: undefined,
      city: undefined,
      country: undefined,
      company: undefined,
      pageLocation: 'https://example.com',
      trafficSource: 'organic',
      userAgent: 'test-agent',
      createdAt: '2024-01-02T00:00:00.000Z'
    })
  })

  it('usa detalles provistos para sobrescribir nombre y extras', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_3',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: 'Analytical'
    })

    if (!result.ok) {
      throw new Error('Expected valid contact request')
    }

    const payload = mapContactRequestToSubmitPayload(
      result.data,
      {
        pageLocation: 'https://example.com',
        trafficSource: 'direct',
        userAgent: 'test-agent',
        createdAt: '2024-01-03T00:00:00.000Z'
      },
      {
        firstName: 'Grace',
        lastName: 'Hopper',
        phoneNumber: '123456',
        city: 'Tigre',
        country: 'AR'
      }
    )

    expect(payload).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      firstName: 'Grace',
      lastName: 'Hopper',
      phoneNumber: '123456',
      city: 'Tigre',
      country: 'AR',
      company: 'Analytical',
      pageLocation: 'https://example.com',
      trafficSource: 'direct',
      userAgent: 'test-agent',
      createdAt: '2024-01-03T00:00:00.000Z'
    })
  })
})
