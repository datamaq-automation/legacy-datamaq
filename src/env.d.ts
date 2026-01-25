
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
  readonly VITE_SITE_LOCALE?: string
  readonly VITE_GSC_VERIFICATION?: string
  readonly VITE_BUSINESS_NAME?: string
  readonly VITE_BUSINESS_TELEPHONE?: string
  readonly VITE_BUSINESS_EMAIL?: string
  readonly VITE_BUSINESS_STREET?: string
  readonly VITE_BUSINESS_LOCALITY?: string
  readonly VITE_BUSINESS_REGION?: string
  readonly VITE_BUSINESS_POSTAL_CODE?: string
  readonly VITE_BUSINESS_COUNTRY?: string
  readonly VITE_BUSINESS_LAT?: string
  readonly VITE_BUSINESS_LNG?: string
  readonly VITE_BUSINESS_AREA?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_CONTACT_API_URL?: string
  readonly VITE_ORIGIN_VERIFY_SECRET?: string
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
