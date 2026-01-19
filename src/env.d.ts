
interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_WHATSAPP_PRESET_MESSAGE?: string
  readonly VITE_CLARITY_PROJECT_ID?: string
  readonly VITE_GA4_ID?: string
  readonly VITE_ANALYTICS_ENABLED?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_SITE_NAME?: string
  readonly VITE_SITE_DESCRIPTION?: string
  readonly VITE_SITE_OG_IMAGE?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_CONTACT_API_URL?: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type GtagFunction = (
  command: 'event',
  eventName: string,
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
}

declare module '*.svg' {
  const src: string
  export default src
}
