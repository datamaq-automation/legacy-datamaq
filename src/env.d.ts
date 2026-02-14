
interface ImportMetaEnv {
  readonly VITE_CONTACT_API_URL?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_ORIGIN_VERIFY_SECRET?: string
  readonly VITE_CHATWOOT_BASE_URL?: string
  readonly VITE_CHATWOOT_WEBSITE_TOKEN?: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type GtagFunction = (
  command: 'event' | 'config' | 'js',
  target: string | Date,
  params?: Record<string, unknown>
) => void

type ClarityFunction = (
  command: 'event',
  eventName: string,
  payload?: Record<string, unknown>
) => void

interface Window {
  gtag?: GtagFunction
  clarity?: ClarityFunction
  chatwootSDK?: {
    run: (config: { websiteToken: string; baseUrl: string }) => void
  }
  $chatwoot?: {
    toggle?: (state?: 'open' | 'close') => void
    popoutChatWindow?: () => void
    toggleBubbleVisibility?: (state: 'show' | 'hide') => void
  }
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}
