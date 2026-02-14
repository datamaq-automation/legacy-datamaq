import { onMounted } from 'vue'
import { getWhatsAppEnabled, openWhatsApp } from '@/ui/controllers/contactController'
import { useContainer } from '@/di/container'
import { useRouter } from 'vue-router'
import './ThanksView.css'

export function useThanksView() {
  const contactCtaEnabled = getWhatsAppEnabled()
  const { leadTracking } = useContainer()
  const router = useRouter()

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
    handleChat,
    handleGoHome
  }
}
