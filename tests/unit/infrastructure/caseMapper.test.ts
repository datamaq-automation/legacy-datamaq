import { describe, expect, it } from 'vitest'
import { mapKeysToCamelCase } from '@/infrastructure/mappers/caseMapper'

describe('caseMapper', () => {
  it('maps snake_case keys recursively to camelCase', () => {
    const payload = {
      request_id: 'req-1',
      error_code: 'VALIDATION_ERROR',
      meta: {
        page_location: 'https://example.com',
        nested_value: {
          created_at: '2026-02-26T00:00:00Z'
        }
      },
      items: [{ item_id: 1 }, { item_id: 2 }]
    }

    const result = mapKeysToCamelCase(payload) as {
      requestId: string
      errorCode: string
      meta: { pageLocation: string; nestedValue: { createdAt: string } }
      items: Array<{ itemId: number }>
    }

    expect(result.requestId).toBe('req-1')
    expect(result.errorCode).toBe('VALIDATION_ERROR')
    expect(result.meta.pageLocation).toBe('https://example.com')
    expect(result.meta.nestedValue.createdAt).toBe('2026-02-26T00:00:00Z')
    expect(result.items[0]?.itemId).toBe(1)
  })
})
