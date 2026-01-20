import { useContent } from '@/ui/composables/useContent'
import './SobreProfeBustos.css'

export function useSobreProfeBustos() {
  const { about } = useContent()
  return { about }
}
