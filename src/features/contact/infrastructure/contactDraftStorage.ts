import type { ContactPersistedDraft } from '@/features/contact/application/leadWizard'

interface StoredContactDraft {
  expiresAt: number
  data: ContactPersistedDraft
}

const CONTACT_DRAFT_TTL_MS = 12 * 60 * 60 * 1000

function isPersistedDraft(value: unknown): value is ContactPersistedDraft {
  if (!value || typeof value !== 'object') {
    return false
  }

  const draft = value as Partial<ContactPersistedDraft>
  return (
    typeof draft.company === 'string' &&
    typeof draft.comment === 'string' &&
    (draft.preferredContact === 'whatsapp' || draft.preferredContact === 'email') &&
    typeof draft.currentStep === 'number'
  )
}

function isStoredContactDraft(value: unknown): value is StoredContactDraft {
  if (!value || typeof value !== 'object') {
    return false
  }

  const draft = value as Partial<StoredContactDraft>
  return typeof draft.expiresAt === 'number' && isPersistedDraft(draft.data)
}

export function readContactDraft(storageKey: string): ContactPersistedDraft | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  const rawDraft = window.localStorage.getItem(storageKey)
  if (!rawDraft) {
    return undefined
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as unknown
    if (!isStoredContactDraft(parsedDraft)) {
      window.localStorage.removeItem(storageKey)
      return undefined
    }

    if (parsedDraft.expiresAt <= Date.now()) {
      window.localStorage.removeItem(storageKey)
      return undefined
    }

    return parsedDraft.data
  } catch {
    window.localStorage.removeItem(storageKey)
    return undefined
  }
}

export function writeContactDraft(storageKey: string, draft: ContactPersistedDraft): void {
  if (typeof window === 'undefined') {
    return
  }

  const storedDraft: StoredContactDraft = {
    expiresAt: Date.now() + CONTACT_DRAFT_TTL_MS,
    data: draft
  }

  window.localStorage.setItem(storageKey, JSON.stringify(storedDraft))
}

export function removeContactDraft(storageKey: string): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(storageKey)
}
