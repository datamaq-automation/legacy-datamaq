import { describe, expect, it } from 'vitest'
import { isValidQuoteId } from '@/application/quote/quoteId'

describe('isValidQuoteId', () => {
  it('accepts quote ids that match Q-YYYYMMDD-######', () => {
    expect(isValidQuoteId('Q-20260222-000123')).toBe(true)
  })

  it('rejects malformed quote ids', () => {
    expect(isValidQuoteId('Q-20260222-123')).toBe(false)
    expect(isValidQuoteId('Q-2026-000123')).toBe(false)
    expect(isValidQuoteId('q-20260222-000123')).toBe(false)
    expect(isValidQuoteId('Q-20260222-0001234')).toBe(false)
  })
})
