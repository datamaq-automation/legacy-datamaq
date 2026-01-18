import type { InjectionKey } from 'vue'
import type { LoggerPort } from '../ports/Logger'
import type { StoragePort } from '../ports/Storage'

export type ConsentStatus = 'unknown' | 'granted' | 'denied'

type Listener = (status: ConsentStatus) => void

const STORAGE_KEY = 'profebustos-www-consent'

export interface ConsentManager {
  getStatus(): ConsentStatus
  grant(): void
  deny(): void
  reset(): void
  subscribe(listener: Listener): () => void
}

export function createConsentManager(
  storage: StoragePort,
  logger: LoggerPort
): ConsentManager {
  const listeners = new Set<Listener>()
  let cachedStatus: ConsentStatus = loadFromStorage(storage, logger)

  function updateStatus(status: ConsentStatus): void {
    if (cachedStatus === status) {
      return
    }

    cachedStatus = status
    persistStatus(storage, logger, status)
    listeners.forEach((listener) => listener(cachedStatus))
  }

  return {
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
}

function loadFromStorage(storage: StoragePort, logger: LoggerPort): ConsentStatus {
  try {
    const stored = storage.get(STORAGE_KEY)
    if (stored === 'granted' || stored === 'denied') {
      return stored
    }
  } catch (error) {
    logger.warn('[consentManager] No fue posible leer el consentimiento almacenado:', error)
  }

  return 'unknown'
}

function persistStatus(
  storage: StoragePort,
  logger: LoggerPort,
  status: ConsentStatus
): void {
  try {
    if (status === 'unknown') {
      storage.remove(STORAGE_KEY)
    } else {
      storage.set(STORAGE_KEY, status)
    }
  } catch (error) {
    logger.warn('[consentManager] No fue posible persistir el consentimiento:', error)
  }
}

export const consentManagerKey: InjectionKey<ConsentManager> = Symbol('consentManager')
