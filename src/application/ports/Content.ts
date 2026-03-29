/*
Path: src/application/ports/Content.ts
*/

import type {
  AppContent
} from '@/domain/types/content'
import type { SeoContent } from '@/domain/types/site'

export type RemoteContentStatus = 'pending' | 'ready' | 'unavailable' | 'not-required'

export interface ContentPort {
  getContent(): AppContent
}

export interface SeoContentPort {
  getSeoContent(): SeoContent
}
