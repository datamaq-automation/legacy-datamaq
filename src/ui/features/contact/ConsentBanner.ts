import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { consentManagerKey, type ConsentStatus } from '@/application/consent/consentManager'
import { useContainer } from '@/di/container'

export function useConsentBanner() {
  const manager = inject(consentManagerKey)

  if (!manager) {
    throw new Error('ConsentManager no está disponible en el árbol de la aplicación.')
  }

  const consentManager = manager

  const status = ref<ConsentStatus>(consentManager.getStatus())
  let unsubscribe: (() => void) | undefined
  const { content } = useContainer()
  const consent = content.getConsentContent()

  const visible = computed(() => status.value === 'unknown')

  function accept(): void {
    consentManager.grant()
  }

  function reject(): void {
    consentManager.deny()
  }

  onMounted(() => {
    unsubscribe = consentManager.subscribe((newStatus) => {
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
