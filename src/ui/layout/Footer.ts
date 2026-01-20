import { computed } from 'vue'
import { useContent } from '@/ui/composables/useContent'

export function useFooter() {
  const { footer } = useContent()
  const year = computed(() => new Date().getFullYear())

  return { footer, year }
}
