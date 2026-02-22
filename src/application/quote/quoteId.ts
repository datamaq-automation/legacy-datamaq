const QUOTE_ID_PATTERN = /^Q-\d{8}-\d{6}$/

export function isValidQuoteId(value: string): boolean {
  return QUOTE_ID_PATTERN.test(value.trim())
}
