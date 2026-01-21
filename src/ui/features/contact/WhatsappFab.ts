import { useContent } from '@/ui/composables/useContent'
import './WhatsappFab.css'

export function useWhatsappFab() {
  const { whatsappFab } = useContent()
  return { whatsappFab }
}
