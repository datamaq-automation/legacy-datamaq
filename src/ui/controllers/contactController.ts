import type { EmailContactPayload } from '@/application/dto/contact'
import { useContainer } from '@/di/container'
import { useContactFacade } from '@/ui/features/contact/useContactFacade'
import { isChatwootConfigured, openChatwootWidget } from '@/infrastructure/chatwoot/widget'

export function getChatEnabled(): boolean {
  return isChatwootConfigured()
}

export function getContactEmail(): string | undefined {
  const value = useContainer().config.contactEmail
  return value?.trim() ? value : undefined
}

export function openChat(section: string = 'chat'): void {
  if (!isChatwootConfigured()) {
    return
  }

  openChatwootWidget()

  const { engagementTracker, environment } = useContainer()
  const trafficSource = getTrafficSource(environment)
  engagementTracker.trackChat(section, trafficSource)
}

export function submitContact(section: string, payload: EmailContactPayload) {
  return useContactFacade().submitContact(section, payload)
}

function getTrafficSource(location: { search(): string; referrer(): string }): string {
  const params = new URLSearchParams(location.search())
  const utmSource = params.get('utm_source')
  if (utmSource) {
    return utmSource
  }
  return location.referrer() || 'direct'
}
