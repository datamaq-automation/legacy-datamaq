interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER: string
  readonly VITE_CHAT_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_CLARITY_PROJECT_ID: string 
  readonly VITE_GA4_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}