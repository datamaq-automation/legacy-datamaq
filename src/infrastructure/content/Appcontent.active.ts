import type { AppContent, CommercialConfig } from '@/domain/types/content'
import { activeAppTarget } from '@/infrastructure/content/runtimeProfile'
import * as datamaqContent from '@/infrastructure/content/Appcontent.datamaq'
import * as uppContent from '@/infrastructure/content/Appcontent.upp'
import * as exampleContent from '@/infrastructure/content/Appcontent.example'

type AppcontentModule = {
  commercialConfig: CommercialConfig
  buildAppContent: (config: CommercialConfig) => AppContent
}

const APP_CONTENT_TARGETS = ['datamaq', 'upp', 'example'] as const
type AppContentTarget = (typeof APP_CONTENT_TARGETS)[number]

function normalizeTarget(value: string | undefined): AppContentTarget | undefined {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) {
    return undefined
  }
  if ((APP_CONTENT_TARGETS as readonly string[]).includes(normalized)) {
    return normalized as AppContentTarget
  }
  return undefined
}

function resolveAppcontentTarget(): AppContentTarget {
  const fromEnv = normalizeTarget(import.meta.env.VITE_CONTENT_TARGET)
  if (fromEnv) {
    return fromEnv
  }

  const fromAppTarget = normalizeTarget(activeAppTarget)
  if (fromAppTarget) {
    return fromAppTarget
  }

  return 'example'
}

function deepCloneCommercialConfig(config: CommercialConfig): CommercialConfig {
  return {
    ...config,
    descuentos: {
      ...config.descuentos
    },
    equipos: {
      ...config.equipos
    }
  }
}

const APP_CONTENT_BY_TARGET: Record<AppContentTarget, AppcontentModule> = {
  datamaq: datamaqContent,
  upp: uppContent,
  example: exampleContent
}

const selectedModule = APP_CONTENT_BY_TARGET[resolveAppcontentTarget()]

export const commercialConfig: CommercialConfig = deepCloneCommercialConfig(selectedModule.commercialConfig)
export const buildAppContent = selectedModule.buildAppContent
