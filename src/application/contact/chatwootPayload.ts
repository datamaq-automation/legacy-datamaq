type CustomAttributes = Record<string, unknown>

export type ChatwootContactPayload = {
  name: string
  email?: string
  identifier?: string
  phone_number?: string
  avatar?: string
  custom_attributes?: CustomAttributes
}

export function buildChatwootContactPayload(params: {
  name: string
  email?: string
  identifier?: string
  phoneNumber?: string
  avatar?: string
  customAttributes?: CustomAttributes
}): ChatwootContactPayload {
  const payload: ChatwootContactPayload = {
    name: params.name
  }

  if (params.email) {
    payload.email = params.email
  }
  if (params.identifier) {
    payload.identifier = params.identifier
  }
  if (params.phoneNumber) {
    payload.phone_number = params.phoneNumber
  }
  if (params.avatar) {
    payload.avatar = params.avatar
  }

  const custom = compactRecord(params.customAttributes)
  if (custom && Object.keys(custom).length > 0) {
    payload.custom_attributes = custom
  }

  return payload
}

function compactRecord(
  record: CustomAttributes | undefined
): CustomAttributes | undefined {
  if (!record) {
    return undefined
  }

  const entries = Object.entries(record).filter(([, value]) => {
    if (value === undefined || value === null) {
      return false
    }
    if (typeof value === 'string' && value.trim() === '') {
      return false
    }
    return true
  })

  if (entries.length === 0) {
    return undefined
  }

  return Object.fromEntries(entries)
}
