import { z } from 'zod'
import { AppContentSchema } from '@/domain/schemas/contentSchema'

const ImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional()
})

const BrandSchema = z.object({
  brandId: z.string(),
  brandName: z.string(),
  brandAriaLabel: z.string(),
  baseOperativa: z.string(),
  contactEmail: z.string().optional(),
  contactFormActive: z.boolean(),
  emailFormActive: z.boolean(),
  whatsappUrl: z.string().optional(),
  whatsappQr: z.object({
    phoneE164: z.string().optional(),
    message: z.string(),
    sourceTag: z.string()
  }),
  technician: z.object({
    name: z.string(),
    role: z.string(),
    photo: ImageSchema,
    whatsappLabel: z.string(),
    unavailableLabel: z.string()
  }),
  equipmentNames: z.object({
    medidorNombre: z.string(),
    automateNombre: z.string()
  })
})

const SeoBusinessSchema = z.object({
  name: z.string(),
  telephone: z.string().optional(),
  email: z.string().optional(),
  street: z.string().optional(),
  locality: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  areaServed: z.array(z.string())
})

const SeoSchema = z.object({
  siteUrl: z.string(),
  siteName: z.string(),
  siteDescription: z.string(),
  siteOgImage: z.string(),
  siteLocale: z.string(),
  gscVerification: z.string().optional(),
  business: SeoBusinessSchema
})

export const SiteSnapshotSchema = z.object({
  content: AppContentSchema,
  brand: BrandSchema,
  seo: SeoSchema
})
