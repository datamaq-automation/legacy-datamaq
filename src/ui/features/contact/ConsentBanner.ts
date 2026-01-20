import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { consentManagerKey, type ConsentStatus } from '@/application/consent/consentManager'
import { useContent } from '@/ui/composables/useContent'
import './ConsentBanner.css'

export function useConsentBanner() {
  const manager = inject(consentManagerKey)

  if (!manager) {
    throw new Error('ConsentManager no está disponible en el árbol de la aplicación.')
  }

  const status = ref<ConsentStatus>(manager.getStatus())
  let unsubscribe: (() => void) | undefined
  const { consent } = useContent()

  const visible = computed(() => status.value === 'unknown')

  function accept(): void {
    manager.grant()
  }

  function reject(): void {
    manager.deny()
  }

  onMounted(() => {
    unsubscribe = manager.subscribe((newStatus) => {
      status.value = newStatus
    })
  })

  watch(
    visible,
    (isVisible) => {
      document.body.classList.toggle('has-consent-banner', isVisible)
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    document.body.classList.remove('has-consent-banner')
    unsubscribe?.()
  })

  return {
    consent,
    visible,
    accept,
    reject
  }
}
