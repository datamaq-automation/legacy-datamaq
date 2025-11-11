
interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_CHAT_URL?: string
  readonly VITE_WHATSAPP_PRESET_MESSAGE?: string
  readonly VITE_CLARITY_PROJECT_ID?: string
  readonly VITE_GA4_ID?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_CONTACT_API_URL?: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type DataLayerEvent = {
  event: string
  section?: string
  traffic_source?: string
  navigation_time_ms?: number
  page_location?: string
  [key: string]: unknown
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
  dataLayer?: DataLayerEvent[]
  gtag?: GtagFunction
  clarity?: ClarityFunction
}
