import { describe, it, expect, vi } from 'vitest'
import { createDiagnosticQuote, fetchQuotePdf } from '@/ui/controllers/quoteController'

const quoteGatewayMock = {
  createDiagnosticQuote: vi.fn(),
  fetchQuotePdf: vi.fn()
}

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    quoteGateway: quoteGatewayMock
  })
}))

describe('quoteController', () => {
  it('delegates createDiagnosticQuote to container quoteGateway', async () => {
    quoteGatewayMock.createDiagnosticQuote.mockResolvedValue({ quote_id: 'Q-1' })
    const payload = {
      company: 'ACME',
      contact_name: 'Juan',
      locality: 'Escobar',
      scheduled: true,
      access_ready: true,
      safe_window_confirmed: true,
      bureaucracy: 'medium' as const
    }

    const result = await createDiagnosticQuote(payload)

    expect(quoteGatewayMock.createDiagnosticQuote).toHaveBeenCalledWith(payload)
    expect(result).toEqual({ quote_id: 'Q-1' })
  })

  it('delegates fetchQuotePdf to container quoteGateway', async () => {
    const fakeBlob = new Blob(['pdf'])
    quoteGatewayMock.fetchQuotePdf.mockResolvedValue({ blob: fakeBlob, filename: 'quote-Q-1.pdf' })

    const result = await fetchQuotePdf('Q-1')

    expect(quoteGatewayMock.fetchQuotePdf).toHaveBeenCalledWith('Q-1')
    expect(result.filename).toBe('quote-Q-1.pdf')
  })
})
