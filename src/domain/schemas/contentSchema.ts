import { z } from 'zod'

const CTAContentSchema = z.object({
  label: z.string(),
  href: z.string().optional(),
  action: z.enum(['whatsapp', 'contact', 'services']).optional()
})

const ImageContentSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional()
})

const HeroBenefitSchema = z.object({
  title: z.string(),
  text: z.string(),
  variant: z.enum(['success', 'primary', 'warning'])
})

const HeroSchema = z.object({
  badge: z.string(),
  title: z.string(),
  subtitle: z.string(),
  responseNote: z.string(),
  chatUnavailableMessage: z.string(),
  primaryCta: CTAContentSchema,
  secondaryCta: CTAContentSchema,
  benefits: z.array(HeroBenefitSchema),
  image: ImageContentSchema
})

const ServiceCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  subtitle: z.string(),
  media: ImageContentSchema,
  items: z.array(z.string()),
  figure: ImageContentSchema.extend({
    caption: z.string().optional()
  }).optional(),
  note: z.string().optional(),
  cta: CTAContentSchema.extend({
    section: z.string()
  }),
  unavailableMessage: z.string()
})

const ServicesSchema = z.object({
  title: z.string(),
  cards: z.array(ServiceCardSchema)
})

const AboutSchema = z.object({
  title: z.string(),
  paragraphs: z.array(z.string()),
  image: ImageContentSchema
})

const NavbarSchema = z.object({
  brand: z.string(),
  brandAriaLabel: z.string(),
  links: z.array(z.object({ label: z.string(), href: z.string() })),
  contactLabel: z.string()
})

const FooterSchema = z.object({
  note: z.string()
})

const LegalSchema = z.object({
  text: z.string()
})

const ContactSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  labels: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    city: z.string(),
    country: z.string(),
    company: z.string()
  }),
  submitLabel: z.string(),
  checkingMessage: z.string(),
  unavailableMessage: z.string(),
  successMessage: z.string(),
  errorMessage: z.string(),
  unexpectedErrorMessage: z.string()
})

const ConsentSchema = z.object({
  title: z.string(),
  description: z.string(),
  acceptLabel: z.string(),
  rejectLabel: z.string()
})

const WhatsappFabSchema = z.object({
  ariaLabel: z.string()
})

export const AppContentSchema = z.object({
  hero: HeroSchema,
  services: ServicesSchema,
  about: AboutSchema,
  navbar: NavbarSchema,
  footer: FooterSchema,
  legal: LegalSchema,
  contact: ContactSchema,
  consent: ConsentSchema,
  whatsappFab: WhatsappFabSchema
})
