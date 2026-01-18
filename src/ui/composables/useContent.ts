import type { AppContent } from '@/domain/types/content'
import { AppContentSchema } from '@/domain/schemas/contentSchema'
import { es } from '@/infrastructure/content/locales/es'

export function useContent(): AppContent {
  const parsed = AppContentSchema.safeParse(es)
  if (!parsed.success) {
    throw new Error('Invalid content schema')
  }
  return parsed.data
}
