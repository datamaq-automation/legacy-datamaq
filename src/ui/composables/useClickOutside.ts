import { onMounted, onUnmounted, type Ref } from 'vue'

export function useClickOutside(
  targetRef: Ref<HTMLElement | null>,
  handler: () => void,
  enabled: Ref<boolean>
) {
  function onPointerDown(event: MouseEvent) {
    if (!enabled.value) {
      return
    }
    const target = event.target
    if (!targetRef.value || !(target instanceof Node)) {
      return
    }
    if (!targetRef.value.contains(target)) {
      handler()
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', onPointerDown)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', onPointerDown)
  })
}
