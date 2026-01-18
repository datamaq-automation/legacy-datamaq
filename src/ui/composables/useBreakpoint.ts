import { onMounted, onUnmounted, ref } from 'vue'

export function useBreakpoint(minWidthPx: number) {
  const matches = ref(false)

  function handleResize() {
    matches.value = typeof window !== 'undefined' && window.innerWidth >= minWidthPx
  }

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    matches
  }
}
