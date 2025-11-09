interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_CHAT_URL?: string
  readonly VITE_WHATSAPP_PRESET_MESSAGE?: string
  readonly VITE_CLARITY_PROJECT_ID?: string
  readonly VITE_GA4_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  dataLayer?: Array<Record<string, unknown>>
  gtag?: (...args: unknown[]) => void
  clarity?: (...args: unknown[]) => void
}
