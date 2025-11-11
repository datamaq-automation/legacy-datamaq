import type { InjectionKey } from 'vue'

export type ConsentStatus = 'unknown' | 'granted' | 'denied'

type Listener = (status: ConsentStatus) => void

const STORAGE_KEY = 'profebustos-www-consent'
const listeners = new Set<Listener>()
let cachedStatus: ConsentStatus = 'unknown'
const isBrowser = typeof window !== 'undefined'
const isDev = import.meta.env.DEV

function loadFromStorage(): ConsentStatus {
  if (!isBrowser) {
    return 'unknown'
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'granted' || stored === 'denied') {
      return stored
    }
  } catch (error) {
    if (isDev) {
      console.warn('[consentManager] No fue posible leer el consentimiento almacenado:', error)
    }
  }

  return 'unknown'
}

function persistStatus(status: ConsentStatus): void {
  if (!isBrowser) {
    return
  }

  try {
    if (status === 'unknown') {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, status)
    }
  } catch (error) {
    if (isDev) {
      console.warn('[consentManager] No fue posible persistir el consentimiento:', error)
    }
  }
}

function updateStatus(status: ConsentStatus): void {
  if (cachedStatus === status) {
    return
  }

  cachedStatus = status
  persistStatus(status)
  listeners.forEach((listener) => listener(cachedStatus))
}

cachedStatus = loadFromStorage()

export interface ConsentManager {
  getStatus(): ConsentStatus
  grant(): void
  deny(): void
  reset(): void
  subscribe(listener: Listener): () => void
}

export const consentManager: ConsentManager = {
  getStatus() {
    return cachedStatus
  },
  grant() {
    updateStatus('granted')
  },
  deny() {
    updateStatus('denied')
  },
  reset() {
    updateStatus('unknown')
  },
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
}

export const consentManagerKey: InjectionKey<ConsentManager> = Symbol('consentManager')
