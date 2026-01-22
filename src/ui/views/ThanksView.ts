import { onMounted } from 'vue'
import Navbar from '@/ui/layout/Navbar.vue'
import Footer from '@/ui/layout/Footer.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import { getChatEnabled, openWhatsApp } from '@/ui/controllers/contactController'
import { useContainer } from '@/di/container'
import { useRouter } from 'vue-router'
import './ThanksView.css'

export function useThanksView() {
  const chatEnabled = getChatEnabled()
  const { leadTracking } = useContainer()
  const router = useRouter()

  function handleWhatsapp() {
    openWhatsApp('gracias')
  }

  function handleGoHome() {
    void router.push('/')
  }

  onMounted(() => {
    const pageLocation = typeof window !== 'undefined' ? window.location.href : ''
    leadTracking.trackGenerateLeadOnce({ page_location: pageLocation })
  })

  return {
    chatEnabled,
    handleWhatsapp,
    handleGoHome
  }
}
