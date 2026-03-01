import { describe, expect, it } from 'vitest'
import { buildRuntimeLogArgs } from '@/application/utils/runtimeConsole'

describe('runtimeConsole', () => {
  it('returns only the message when no metadata is provided', () => {
    expect(buildRuntimeLogArgs('[contact:ui] submit iniciado')).toEqual([
      '[contact:ui] submit iniciado'
    ])
  })

  it('normalizes metadata while preserving explicit structure', () => {
    const [, context] = buildRuntimeLogArgs('[contact:gateway] response OK', {
      channel: 'contact',
      pathname: '/api/v1/contact',
      transportMode: 'proxy',
      status: 201,
      requestId: 'req-123',
      submissionId: 'sub-123',
      ignored: undefined,
      payload: {
        firstNamePresent: true,
        companyPresent: false,
        ignored: undefined
      }
    })

    expect(context).toEqual({
      channel: 'contact',
      pathname: '/api/v1/contact',
      transportMode: 'proxy',
      status: 201,
      requestId: 'req-123',
      submissionId: 'sub-123',
      payload: {
        firstNamePresent: true,
        companyPresent: false
      }
    })
    expect(Object.keys(context as Record<string, unknown>)).toEqual([
      'channel',
      'pathname',
      'transportMode',
      'status',
      'requestId',
      'submissionId',
      'payload'
    ])
  })

  it('serializes Error instances into plain loggable metadata', () => {
    const [, context] = buildRuntimeLogArgs('[contact:ui] excepcion inesperada durante submit', {
      error: new Error('boom')
    })

    expect(context).toEqual({
      error: {
        name: 'Error',
        message: 'boom'
      }
    })
  })
})
