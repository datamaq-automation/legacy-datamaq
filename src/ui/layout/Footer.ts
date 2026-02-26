import { computed } from 'vue'
import { useContainer } from '@/di/container'

export function useFooter() {
  const { content } = useContainer()
  const footer = content.getFooterContent()
  const navbar = content.getNavbarContent()
  const contactLabel = navbar.contactLabel
  const brand = navbar.brand
  const year = computed(() => new Date().getFullYear())

  return { footer, contactLabel, brand, year }
}
