import { useContainer } from '@/di/container'

export function useWhatsappFab() {
  const { content } = useContainer()
  const whatsappFab = content.getWhatsappFabContent()
  return { whatsappFab }
}
