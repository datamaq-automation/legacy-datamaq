import { computed } from 'vue'
import { useContainer } from '@/di/container'

export function useFooter() {
  const { content } = useContainer()
  const footer = content.getFooterContent()
  const contactLabel = content.getNavbarContent().contactLabel
  const year = computed(() => new Date().getFullYear())

  return { footer, contactLabel, year }
}
