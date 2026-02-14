import { publicConfig } from '@/infrastructure/config/publicConfig'

type ChatwootSdk = {
  run: (config: { websiteToken: string; baseUrl: string }) => void
}

type ChatwootWidgetApi = {
  toggle?: (state?: 'open' | 'close') => void
  popoutChatWindow?: () => void
  toggleBubbleVisibility?: (state: 'show' | 'hide') => void
}

const SCRIPT_ATTR = 'data-chatwoot-sdk'

function normalizeBaseUrl(value: string | undefined): string | null {
  if (!value) {
    return null
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }
  return trimmed.replace(/\/+$/, '')
}

function normalizeToken(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function getChatwootConfig(): { baseUrl: string; websiteToken: string } | null {
  const baseUrl =
    normalizeBaseUrl(import.meta.env.VITE_CHATWOOT_BASE_URL) ??
    normalizeBaseUrl(publicConfig.chatwootBaseUrl)
  const websiteToken =
    normalizeToken(import.meta.env.VITE_CHATWOOT_WEBSITE_TOKEN) ??
    normalizeToken(publicConfig.chatwootWebsiteToken)

  if (!baseUrl || !websiteToken) {
    return null
  }
  return { baseUrl, websiteToken }
}

export function isChatwootConfigured(): boolean {
  return Boolean(getChatwootConfig())
}

export function initChatwootWidget(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const config = getChatwootConfig()
  if (!config) {
    return
  }

  const runWidget = () => {
    const sdk = window.chatwootSDK as ChatwootSdk | undefined
    sdk?.run({ websiteToken: config.websiteToken, baseUrl: config.baseUrl })
  }

  if (window.chatwootSDK) {
    runWidget()
    return
  }

  const existing = document.querySelector(`script[${SCRIPT_ATTR}]`) as
    | HTMLScriptElement
    | null
  if (existing) {
    if (existing.dataset['loaded'] === 'true') {
      runWidget()
    } else {
      existing.addEventListener('load', runWidget, { once: true })
    }
    return
  }

  const script = document.createElement('script')
  script.src = `${config.baseUrl}/packs/js/sdk.js`
  script.async = true
  script.setAttribute(SCRIPT_ATTR, 'true')
  script.addEventListener('load', () => {
    script.dataset['loaded'] = 'true'
    runWidget()
  })
  document.head?.appendChild(script)
}

export function openChatwootWidget(): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!getChatwootConfig()) {
    return
  }

  const openWidget = () => {
    const api = window.$chatwoot as ChatwootWidgetApi | undefined
    api?.toggle?.('open')
  }

  if (window.$chatwoot) {
    openWidget()
    return
  }

  initChatwootWidget()
  window.addEventListener(
    'chatwoot:ready',
    () => {
      openWidget()
    },
    { once: true }
  )
}
