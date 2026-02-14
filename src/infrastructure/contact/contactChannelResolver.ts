export type ContactChannel = 'backend' | 'chatwootPublic'

export function resolveContactChannel(apiUrl: string): ContactChannel {
  if (isChatwootPublicContactsEndpoint(apiUrl)) {
    return 'chatwootPublic'
  }

  return 'backend'
}

export function isChatwootPublicContactsEndpoint(apiUrl: string): boolean {
  return apiUrl.includes('/public/api/v1/inboxes/') && apiUrl.endsWith('/contacts')
}
