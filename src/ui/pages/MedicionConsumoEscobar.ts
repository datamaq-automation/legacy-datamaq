import {
  getWhatsAppEnabled,
  getContactFormActive,
  getEmailFormActive,
  openWhatsApp,
  submitContact,
  submitMail
} from '@/ui/controllers/contactController'
import { useContainer } from '@/di/container'
import { computed } from 'vue'

export function useMedicionConsumoEscobar() {
  const { content } = useContainer()
  const appContent = computed(() => content.getContent())
  const contactContent = computed(() => appContent.value.contact)

  const pageContent = computed(() => {
    const services = appContent.value.services.cards
    const mainService = services.find((card) => card.id === 'medicion') ?? services[0]
    const decisionFlow = appContent.value.decisionFlow
    const hero = appContent.value.hero

    return {
      eyebrow: hero.badge,
      headline: hero.title,
      lead: hero.subtitle,
      primaryCtaLabel: hero.primaryCta.label,
      secondaryCtaLabel: hero.secondaryCta.label,
      summaryTitle: appContent.value.services.title,
      summary: hero.benefits.map((benefit) => benefit.text),
      includesTitle: decisionFlow.pricingIncludesTitle,
      includes: decisionFlow.pricingIncludes,
      processTitle: decisionFlow.processTitle,
      processSteps: decisionFlow.processSteps.map((step) => `${step.title}. ${step.description}`),
      deliverablesTitle: mainService?.title ?? appContent.value.services.title,
      deliverables: mainService?.items ?? [],
      faqTitle: decisionFlow.faqTitle,
      faqs: decisionFlow.faqItems
    }
  })

  const contactCtaEnabled = getWhatsAppEnabled()
  const isContactFormActive = getContactFormActive()
  const isEmailFormActive = getEmailFormActive()

  function handleChat(section: string, href?: string) {
    openWhatsApp(section, href)
  }

  function handleEmailSubmit(payload: Parameters<typeof submitMail>[0]) {
    return submitMail(payload)
  }

  function handleContactSubmit(payload: Parameters<typeof submitContact>[0]) {
    return submitContact(payload)
  }

  return {
    pageContent,
    contactContent,
    contactCtaEnabled,
    isContactFormActive,
    isEmailFormActive,
    handleChat,
    handleContactSubmit,
    handleEmailSubmit
  }
}
