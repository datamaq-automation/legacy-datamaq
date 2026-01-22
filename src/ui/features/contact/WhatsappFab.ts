import { useContent } from '@/ui/composables/useContent'

export function useWhatsappFab() {
  const { whatsappFab } = useContent()
  return { whatsappFab }
}
