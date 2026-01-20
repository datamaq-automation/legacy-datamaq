import type { AppContent } from '@/domain/types/content'
import { AppContentSchema } from '@/domain/schemas/contentSchema'
import { content } from '@/infrastructure/content/content'

export function useContent(): AppContent {
  const parsed = AppContentSchema.safeParse(content)
  if (!parsed.success) {
    throw new Error('Invalid content schema')
  }
  return parsed.data
}
