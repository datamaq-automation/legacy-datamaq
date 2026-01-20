export type ContactDomainError =
  | { type: 'InvalidEmail' }
  | { type: 'InvalidName' }

export function isContactDomainError(value: unknown): value is ContactDomainError {
  if (!value || typeof value !== 'object') {
    return false
  }
  const candidate = value as { type?: string }
  return candidate.type === 'InvalidEmail' || candidate.type === 'InvalidName'
}
