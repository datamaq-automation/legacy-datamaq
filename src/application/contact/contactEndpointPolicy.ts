const CHATWOOT_PUBLIC_CONTACTS_PATTERN = /\/public\/api\/v1\/inboxes\/[^/]+\/contacts\/?$/i

export interface ContactEndpointPolicyResult {
  allowed: boolean
  reason?: string
}

export function evaluateContactEndpointPolicy(apiUrl: string | undefined): ContactEndpointPolicyResult {
  if (!apiUrl) {
    return { allowed: false, reason: 'missing' }
  }

  const normalized = normalizeApiUrl(apiUrl)
  if (isChatwootPublicContactsEndpoint(normalized)) {
    return { allowed: false, reason: 'chatwoot-public-api-disallowed' }
  }

  return { allowed: true }
}

export function isChatwootPublicContactsEndpoint(apiUrl: string): boolean {
  return CHATWOOT_PUBLIC_CONTACTS_PATTERN.test(normalizeApiUrl(apiUrl))
}

function normalizeApiUrl(apiUrl: string): string {
  return apiUrl.split(/[?#]/, 1)[0] ?? apiUrl
}
