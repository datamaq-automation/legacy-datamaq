import { useContainer } from '@/di/container'

export function useLegalSection() {
  const { content } = useContainer()
  const legal = content.getLegalContent()
  return { legal }
}
