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
  })
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

const ProfileSchema = z.object({
  title: z.string(),
  bullets: z.array(z.string())
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
    email: z.string(),
    message: z.string()
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

const DecisionFlowSchema = z.object({
  processTitle: z.string(),
  pricingTitle: z.string(),
  pricingSummaryFallback: z.string(),
  pricingIncludes: z.array(z.string()),
  pricingExcludes: z.array(z.string()),
  pricingVariables: z.array(z.string()),
  coverageTitle: z.string(),
  coverageAreas: z.array(z.string()),
  responseTimes: z.array(z.string()),
  whatsappLabel: z.string(),
  contactFormLabel: z.string(),
  faqTitle: z.string(),
  processSteps: z.array(
    z.object({
      order: z.number(),
      title: z.string(),
      description: z.string()
    })
  ),
  faqItems: z.array(
    z.object({
      question: z.string(),
      answer: z.string()
    })
  )
})

const ThanksSchema = z.object({
  badge: z.string(),
  title: z.string(),
  subtitle: z.string(),
  whatsappButtonLabel: z.string(),
  goHomeButtonLabel: z.string()
})

export const AppContentSchema = z.object({
  hero: HeroSchema,
  services: ServicesSchema,
  about: AboutSchema,
  profile: ProfileSchema,
  navbar: NavbarSchema,
  footer: FooterSchema,
  legal: LegalSchema,
  contact: ContactSchema,
  consent: ConsentSchema,
  decisionFlow: DecisionFlowSchema,
  thanks: ThanksSchema
})
