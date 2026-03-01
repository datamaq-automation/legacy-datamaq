import { computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useContainer } from '@/di/container'
import { getWhatsAppHref } from '@/ui/controllers/contactController'
import './WhatsAppRedirectView.css'

const REDIRECT_DELAY_SECONDS = 0

export function useWhatsAppRedirectView() {
  const { content } = useContainer()
  const whatsappHref = computed(() => getWhatsAppHref() ?? '#contacto')
  const shouldRedirect = computed(() => /^https?:\/\//.test(whatsappHref.value))
  const canonicalHref = computed(() => {
    const siteUrl = content.getSeoContent().siteUrl?.trim().replace(/\/$/, '')
    return siteUrl ? `${siteUrl}/w` : '/w'
  })
  const title = computed(() => content.getSeoContent().siteName?.trim() || 'Sitio')

  useHead(() => ({
    title: title.value,
    meta: shouldRedirect.value
      ? [
          {
            'http-equiv': 'refresh',
            content: `${REDIRECT_DELAY_SECONDS};url=${whatsappHref.value}`
          }
        ]
      : [],
    link: [{ rel: 'canonical', href: canonicalHref.value }]
  }))

  onMounted(() => {
    if (typeof window !== 'undefined' && shouldRedirect.value) {
      window.location.replace(whatsappHref.value)
    }
  })

  return { whatsappHref, title, shouldRedirect }
}
