/*
Path: src/ui/seo/defaultSeo.ts
*/

export type { BusinessInfo, SeoMeta } from '@/domain/seo/types'
export {
  buildLocalBusinessJsonLd,
  buildOfferCatalogJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd
} from '@/domain/seo/jsonLd'
export { getDefaultSeo } from '@/application/seo/defaultSeo'
