import { computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { buildWhatsAppQrHref } from '@/application/constants/whatsappQr'
import './WhatsAppRedirectView.css'

const REDIRECT_DELAY_SECONDS = 0

export function useWhatsAppRedirectView() {
  const whatsappHref = computed(() => buildWhatsAppQrHref())

  useHead(() => ({
    title: 'DataMaq',
    meta: [
      {
        'http-equiv': 'refresh',
        content: `${REDIRECT_DELAY_SECONDS};url=${whatsappHref.value}`
      }
    ],
    link: [{ rel: 'canonical', href: 'https://www.datamaq.com.ar/w' }]
  }))

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.location.replace(whatsappHref.value)
    }
  })

  return { whatsappHref }
}
