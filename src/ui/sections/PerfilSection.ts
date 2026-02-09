import { useContainer } from '@/di/container'
import './PerfilSection.css'

export function usePerfilSection() {
  const { content } = useContainer()
  const profile = content.getProfileContent()
  return { profile }
}
