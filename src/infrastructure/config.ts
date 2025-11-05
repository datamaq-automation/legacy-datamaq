/*
Path: src/infrastructure/config.ts
*/

export const config = {
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER ?? "",
  CHAT_URL:        import.meta.env.VITE_CHAT_URL ?? "",
  API_BASE_URL:    import.meta.env.VITE_API_BASE_URL ?? "",
  PRESET_MSG:      "Vengo de la página web, quiero más información."
} as const;

