/*
Path: src/infrastructure/config.ts
*/

export const config = {
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER ?? "",
  CHAT_URL:        import.meta.env.VITE_CHAT_URL ?? "",
  API_BASE_URL:    import.meta.env.VITE_API_BASE_URL ?? "",
  PRESET_MSG:      "Vengo de la página web, quiero más información."
} as const;

// Agrega console.info para mostrar el valor de API_BASE_URL al cargar la config
console.info(`API_BASE_URL cargado desde entorno: ${config.API_BASE_URL}`)
console.info(`WHATSAPP_NUMBER cargado desde entorno: ${config.WHATSAPP_NUMBER}`)
console.info(`CHAT_URL cargado desde entorno: ${config.CHAT_URL}`)


