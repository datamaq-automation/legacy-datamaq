/*
Path: src/application/ports/Content.ts
*/

import type {
  AppContent
} from '@/domain/types/content'
import type { SeoContent } from '@/domain/types/site'

export interface ContentPort {
  getContent(): AppContent
}

export interface SeoContentPort {
  getSeoContent(): SeoContent
}
