import type { StoragePort } from '@/application/ports/Storage'

/**
 * ⚠️ SEGURIDAD: Esta implementación usa localStorage (no encriptado).
 * NO usar para almacenar: tokens de autenticación, contraseñas, datos sensibles.
 * Uso actual válido: drafts de formularios, preferencias de consentimiento.
 */
export class BrowserStorage implements StoragePort {
  get(key: string): string | null {
    if (typeof window === 'undefined') {
      return null
    }
    return window.localStorage.getItem(key)
  }

  set(key: string, value: string): void {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem(key, value)
  }

  remove(key: string): void {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.removeItem(key)
  }
}
