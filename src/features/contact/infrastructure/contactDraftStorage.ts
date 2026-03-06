import type { ContactLeadDraft } from '@/features/contact/application/leadWizard'

export function readContactDraft(storageKey: string): Partial<ContactLeadDraft> | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  const rawDraft = window.localStorage.getItem(storageKey)
  if (!rawDraft) {
    return undefined
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as Partial<ContactLeadDraft>
    return parsedDraft && typeof parsedDraft === 'object' ? parsedDraft : undefined
  } catch {
    window.localStorage.removeItem(storageKey)
    return undefined
  }
}

export function writeContactDraft(storageKey: string, draft: ContactLeadDraft): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(draft))
}

export function removeContactDraft(storageKey: string): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(storageKey)
}

