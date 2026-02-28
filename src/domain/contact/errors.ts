export type ContactDomainError =
  | { type: 'InvalidEmail' }
  | { type: 'InvalidPhone' }
  | { type: 'InvalidName' }
  | { type: 'MissingContactMethod' }

export function isContactDomainError(value: unknown): value is ContactDomainError {
  if (!value || typeof value !== 'object') {
    return false
  }
  const candidate = value as { type?: string }
  return (
    candidate.type === 'InvalidEmail' ||
    candidate.type === 'InvalidPhone' ||
    candidate.type === 'InvalidName' ||
    candidate.type === 'MissingContactMethod'
  )
}
