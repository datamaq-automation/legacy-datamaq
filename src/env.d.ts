
interface ImportMetaEnv {
  readonly VITE_CONTACT_API_URL?: string
  readonly VITE_MAIL_API_URL?: string
  readonly VITE_INQUIRY_API_URL?: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type GtagFunction = {
  (command: 'event' | 'config', target: string, params?: Record<string, unknown>): void
  (command: 'js', target: Date): void
  (
    command: 'consent',
    target: 'default' | 'update',
    params: {
      ad_storage?: 'granted' | 'denied'
      ad_user_data?: 'granted' | 'denied'
      ad_personalization?: 'granted' | 'denied'
      analytics_storage?: 'granted' | 'denied'
    }
  ): void
}

type ClarityFunction = {
  (command: 'event', eventName: string, payload?: Record<string, unknown>): void
  (
    command: 'consentv2',
    payload: {
      ad_Storage: 'granted' | 'denied'
      analytics_Storage: 'granted' | 'denied'
    }
  ): void
  (command: 'consent', accepted: boolean): void
  q?: unknown[]
}

interface Window {
  gtag?: GtagFunction
  clarity?: ClarityFunction
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}
