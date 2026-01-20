import { useContent } from '@/ui/composables/useContent'

export function useLegalSection() {
  const { legal } = useContent()
  return { legal }
}
