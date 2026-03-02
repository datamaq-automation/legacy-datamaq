<script setup lang="ts">
import { computed } from 'vue'
import { CTA_COPY } from '@/application/constants/ctaCopy'
import { getWhatsAppHref } from '@/ui/controllers/contactController'
import { useContainer } from '@/di/container'

const whatsappHref = computed(() => getWhatsAppHref())
const fabAriaLabel = 'Abrir WhatsApp para pedir coordinación'

function handleFabClick(event: MouseEvent): void {
  if (!whatsappHref.value) {
    return
  }
  event.preventDefault()
  
  // Abrir directamente sin openWhatsApp() para evitar fallback redirect
  window.open(whatsappHref.value, '_blank')
  
  // Analytics tracking separado (inline para evitar dependencias extra)
  const { engagementTracker, environment } = useContainer()
  const params = new URLSearchParams(environment.search())
  const utmSource = params.get('utm_source')
  const trafficSource = utmSource || environment.referrer() || 'direct'
  engagementTracker.trackChat('whatsapp-fab', trafficSource)
}
</script>

<template>
  <a
    v-if="whatsappHref"
    class="tw:fixed tw:bottom-6 tw:right-6 tw:z-[1050] tw:flex tw:items-center tw:justify-center tw:w-14 tw:h-14 tw:bg-[#25D366] tw:text-white tw:rounded-full tw:shadow-lg tw:transition-transform hover:tw:scale-110 active:tw:scale-95"
    :href="whatsappHref"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="fabAriaLabel"
    :title="CTA_COPY.FAB_ARIA_LABEL"
    @click="handleFabClick"
  >
    <svg
      class="c-whatsapp-fab__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M12 2a9.8 9.8 0 0 0-8.38 14.87L2 22l5.28-1.57A9.8 9.8 0 1 0 12 2Zm0 17.65a7.9 7.9 0 0 1-4.03-1.1l-.3-.18-3.14.94.97-3.06-.2-.31A7.9 7.9 0 1 1 12 19.65Zm4.34-5.91c-.24-.12-1.4-.7-1.62-.77-.22-.08-.38-.12-.54.12-.16.23-.62.77-.76.92-.14.15-.28.18-.52.06-.24-.12-1-.38-1.92-1.2a7.2 7.2 0 0 1-1.33-1.64c-.14-.23 0-.36.1-.48.11-.11.24-.28.36-.42.12-.14.16-.23.24-.38.08-.15.04-.29-.02-.41-.06-.12-.54-1.31-.74-1.79-.2-.48-.41-.41-.56-.42h-.48a.92.92 0 0 0-.66.31c-.22.24-.84.82-.84 2s.86 2.31.98 2.47c.12.16 1.69 2.57 4.09 3.6.57.25 1.01.4 1.36.51.57.18 1.08.16 1.49.1.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.09-.22-.15-.46-.27Z"
      />
    </svg>
  </a>
</template>
