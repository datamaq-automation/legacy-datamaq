import type { InjectionKey } from 'vue'
import type { LoggerPort } from '../ports/Logger'
import type { StoragePort } from '../ports/Storage'
import {
  analyticsConsentLegacyStorageKey,
  analyticsConsentStorageKey,
  parseStoredConsentStatus
} from './consentStorage'

export type ConsentStatus = 'unknown' | 'granted' | 'denied'

type Listener = (status: ConsentStatus) => void

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
    const stored = parseStoredConsentStatus(storage.get(analyticsConsentStorageKey))
    if (stored) {
      return stored
    }

    const legacyStored = parseStoredConsentStatus(storage.get(analyticsConsentLegacyStorageKey))
    if (legacyStored) {
      storage.set(analyticsConsentStorageKey, legacyStored)
      storage.remove(analyticsConsentLegacyStorageKey)
      return legacyStored
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
      storage.remove(analyticsConsentStorageKey)
    } else {
      storage.set(analyticsConsentStorageKey, status)
    }

    storage.remove(analyticsConsentLegacyStorageKey)
  } catch (error) {
    logger.warn('[consentManager] No fue posible persistir el consentimiento:', error)
  }
}

export const consentManagerKey: InjectionKey<ConsentManager> = Symbol('consentManager')
