import { describe, expect, it } from 'vitest'
import type { HttpResponse } from '@/application/ports/HttpClient'
import { extractContactSubmitFeedback } from '@/infrastructure/contact/contactResponseFeedback'

describe('extractContactSubmitFeedback', () => {
  it('extracts request_id, error_code and detail from JSON body', () => {
    const response: HttpResponse = {
      ok: false,
      status: 422,
      data: {
        request_id: 'req_body_1',
        error_code: 'INVALID_PAYLOAD',
        detail: 'email is invalid'
      }
    }

    expect(extractContactSubmitFeedback(response)).toEqual({
      requestId: 'req_body_1',
      errorCode: 'INVALID_PAYLOAD',
      backendMessage: 'email is invalid'
    })
  })

  it('prioritizes X-Request-Id header over body request_id', () => {
    const response: HttpResponse = {
      ok: false,
      status: 429,
      data: {
        request_id: 'req_body_2',
        error_code: 'RATE_LIMITED'
      },
      headers: {
        'x-request-id': 'req_header_2'
      }
    }

    expect(extractContactSubmitFeedback(response)).toEqual({
      requestId: 'req_header_2',
      errorCode: 'RATE_LIMITED'
    })
  })

  it('falls back to raw text when backend message is plain text', () => {
    const response: HttpResponse = {
      ok: false,
      status: 500,
      text: 'smtp timeout while sending'
    }

    expect(extractContactSubmitFeedback(response)).toEqual({
      backendMessage: 'smtp timeout while sending'
    })
  })
})
