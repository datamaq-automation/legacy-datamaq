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

  it('extracts canonical FastAPI envelope fields from JSON body', () => {
    const response: HttpResponse = {
      ok: true,
      status: 202,
      data: {
        request_id: 'req_body_fastapi_1',
        status: 'accepted',
        processing_status: 'accepted',
        code: 'CONTACT_ACCEPTED',
        detail: 'Contact request accepted for processing'
      }
    }

    expect(extractContactSubmitFeedback(response)).toEqual({
      requestId: 'req_body_fastapi_1',
      submitStatus: 'accepted',
      processingStatus: 'accepted',
      errorCode: 'CONTACT_ACCEPTED',
      backendMessage: 'Contact request accepted for processing'
    })
  })

  it('prioritizes X-Request-Id header over body request_id', () => {
    const response: HttpResponse = {
      ok: false,
      status: 429,
      data: {
        request_id: 'req_body_2',
        error_code: 'RATE_LIMITED',
        status: 'accepted',
        processing_status: 'queued'
      },
      headers: {
        'x-request-id': 'req_header_2'
      }
    }

    expect(extractContactSubmitFeedback(response)).toEqual({
      requestId: 'req_header_2',
      submitStatus: 'accepted',
      processingStatus: 'queued',
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
