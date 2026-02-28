import type { ContactFormPayload, ContactSubmitPayload } from '@/application/dto/contact'
import type { ContactError } from '@/application/types/errors'

type ContactDraftLike = Partial<ContactFormPayload>

export function summarizeContactDraft(payload: ContactDraftLike): {
  filledFieldCount: number
  hasEmail: boolean
  hasPhone: boolean
  hasCompany: boolean
  hasGeographicLocation: boolean
  hasComment: boolean
  commentLength: number
} {
  const email = normalize(payload.email)
  const phone = normalize(payload.phone)
  const company = normalize(payload.company)
  const geographicLocation = normalize(payload.geographicLocation)
  const comment = normalize(payload.comment)
  const filledFieldCount = Object.values({
    firstName: normalize(payload.firstName),
    lastName: normalize(payload.lastName),
    company,
    email,
    phone,
    geographicLocation,
    comment
  }).filter(Boolean).length

  return {
    filledFieldCount,
    hasEmail: Boolean(email),
    hasPhone: Boolean(phone),
    hasCompany: Boolean(company),
    hasGeographicLocation: Boolean(geographicLocation),
    hasComment: Boolean(comment),
    commentLength: comment.length
  }
}

export function summarizeContactSubmitPayload(payload: ContactSubmitPayload): {
  hasEmail: boolean
  hasPhone: boolean
  hasCompany: boolean
  hasGeographicLocation: boolean
  hasAttribution: boolean
  attributionKeys: string[]
  commentLength: number
  pagePathname: string | null
} {
  const attributionKeys = Object.keys(payload.attribution ?? {}).filter((key) => Boolean(payload.attribution?.[key as keyof NonNullable<ContactSubmitPayload['attribution']>]))

  return {
    hasEmail: Boolean(normalize(payload.email)),
    hasPhone: Boolean(normalize(payload.phone)),
    hasCompany: Boolean(normalize(payload.company)),
    hasGeographicLocation: Boolean(normalize(payload.geographicLocation)),
    hasAttribution: attributionKeys.length > 0,
    attributionKeys,
    commentLength: normalize(payload.comment).length,
    pagePathname: resolvePathname(payload.pageLocation)
  }
}

export function summarizeContactError(
  error: ContactError | undefined
): {
  type: ContactError['type']
  status?: number
  requestId?: string
  errorCode?: string
  backendMessagePreview?: string
} | null {
  if (!error) {
    return null
  }

  switch (error.type) {
    case 'BackendError':
      return {
        type: error.type,
        status: error.status,
        ...buildErrorMeta(error.requestId, error.errorCode, preview(error.backendMessage))
      }
    case 'NetworkError':
      return {
        type: error.type,
        ...buildErrorMeta(error.requestId, error.errorCode, preview(error.backendMessage))
      }
    case 'ValidationError':
      return {
        type: error.type
      }
    case 'Unavailable':
      return {
        type: error.type
      }
  }
}

function buildErrorMeta(
  requestId: string | undefined,
  errorCode: string | undefined,
  backendMessagePreview: string | undefined
): {
  requestId?: string
  errorCode?: string
  backendMessagePreview?: string
} {
  return {
    ...(requestId ? { requestId } : {}),
    ...(errorCode ? { errorCode } : {}),
    ...(backendMessagePreview ? { backendMessagePreview } : {})
  }
}

export function collectInvalidContactFields(
  fieldErrors: Partial<Record<keyof ContactFormPayload, string>>
): Array<keyof ContactFormPayload> {
  return (Object.entries(fieldErrors) as Array<[keyof ContactFormPayload, string | undefined]>)
    .filter(([, message]) => Boolean(message?.trim()))
    .map(([field]) => field)
    .sort()
}

function preview(value: string | undefined, maxLength: number = 120): string | undefined {
  const normalized = normalize(value)
  if (!normalized) {
    return undefined
  }
  return normalized.length <= maxLength ? normalized : normalized.slice(0, maxLength)
}

function normalize(value: string | undefined): string {
  return value?.trim() ?? ''
}

function resolvePathname(value: string): string | null {
  const normalized = normalize(value)
  if (!normalized) {
    return null
  }

  try {
    return new URL(normalized).pathname || null
  } catch {
    return normalized.startsWith('/') ? normalized : null
  }
}
