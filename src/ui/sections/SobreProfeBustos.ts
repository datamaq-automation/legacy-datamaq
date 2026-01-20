import { useContent } from '@/ui/composables/useContent'

export function useSobreProfeBustos() {
  const { about } = useContent()
  return { about }
}
