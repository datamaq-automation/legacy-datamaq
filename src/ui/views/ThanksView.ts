import { onMounted } from 'vue'
import { getWhatsAppEnabled, openWhatsApp } from '@/ui/controllers/contactController'
import { useContainer } from '@/di/container'
import { useRouter } from 'vue-router'
import './ThanksView.css'

export function useThanksView() {
  const contactCtaEnabled = getWhatsAppEnabled()
  const { leadTracking, content } = useContainer()
  const router = useRouter()
  const thanksContent = content.getContent().thanks
  
  // Proporcionar valores por defecto para campos opcionales
  const thanksContentWithDefaults = {
    badge: thanksContent?.badge ?? '¡Gracias!',
    topbarTitle: thanksContent?.topbarTitle ?? 'Mensaje enviado',
    title: thanksContent?.title ?? '¡Listo! Recibimos tu mensaje',
    subtitle: thanksContent?.subtitle ?? 'Te vamos a contactar a la brevedad',
    whatsappButtonLabel: thanksContent?.whatsappButtonLabel ?? 'Escribime por WhatsApp',
    goHomeButtonLabel: thanksContent?.goHomeButtonLabel ?? 'Volvé al inicio',
    closeButtonAriaLabel: thanksContent?.closeButtonAriaLabel ?? 'Cerrá y volvé al inicio'
  }

  function handleChat() {
    openWhatsApp('gracias')
  }

  function handleGoHome() {
    void router.push({ name: 'home' })
  }

  onMounted(() => {
    const pageLocation = typeof window !== 'undefined' ? window.location.href : ''
    leadTracking.trackGenerateLeadOnce({ page_location: pageLocation })
  })

  return {
    contactCtaEnabled,
    thanksContent: thanksContentWithDefaults,
    handleChat,
    handleGoHome
  }
}
