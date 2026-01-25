import { useContainer } from '@/di/container'
import './SobreProfeBustos.css'

export function useSobreProfeBustos() {
  const { content } = useContainer()
  const about = content.getAboutContent()
  return { about }
}
