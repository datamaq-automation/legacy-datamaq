import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useContainer } from '@/di/container'
import type { NavbarEmits, NavbarProps } from '@/ui/types/layout'

export function useNavbar(props: NavbarProps, emit: NavbarEmits) {
  const offcanvasRef = ref<HTMLElement | null>(null)
  const toggleButtonRef = ref<HTMLButtonElement | null>(null)
  const isOffcanvasOpen = ref(false)
  const contactCtaEnabled = computed(() => props.contactCtaEnabled)
  const { content } = useContainer()
  const navbar = content.getNavbarContent()

  function setOffcanvasBodyState(isOpen: boolean) {
    if (typeof document === 'undefined') {
      return
    }
    const appRoot = document.getElementById('app')
    document.documentElement.classList.toggle('dmq-offcanvas-open', isOpen)
    document.body.classList.toggle('dmq-offcanvas-open', isOpen)
    appRoot?.classList.toggle('dmq-offcanvas-open', isOpen)

    // Backwards compatibility for existing tests/styles while migrating to dmq-offcanvas-open.
    document.body.classList.toggle('offcanvas-open', isOpen)
  }

  function handleContactClickDesktop() {
    emit('contact')
  }

  function hideOffcanvas() {
    if (!offcanvasRef.value) {
      return
    }
    // Validar que el offcanvas está realmente abierto antes de intentar cerrarlo
    if (!isOffcanvasOpen.value) {
      return
    }
    offcanvasRef.value
      .querySelector<HTMLButtonElement>('button[data-bs-dismiss="offcanvas"]')
      ?.click()
  }

  function handleMobileNavLinkClick() {
    hideOffcanvas()
  }

  function handleContactClickMobile() {
    emit('contact')
    hideOffcanvas()
  }

  function handleShown() {
    isOffcanvasOpen.value = true
    setOffcanvasBodyState(true)
  }

  function handleHidden() {
    isOffcanvasOpen.value = false
    setOffcanvasBodyState(false)
  }

  function handleHashChange() {
    hideOffcanvas()
  }

  onMounted(() => {
    if (!offcanvasRef.value) {
      return
    }

    // Inicializar Bootstrap Offcanvas manualmente para evitar race conditions
    // con data-bs-toggle automático.
    // Esto garantiza que los listeners se registren DESPUÉS de que Bootstrap esté listo.
    const globalWindow = typeof window !== 'undefined' ? (window as any) : null
    if (globalWindow?.bootstrap?.Offcanvas) {
      // Crear instancia manual: esto previene múltiples inicializaciones
      const offcanvasInstance = new globalWindow.bootstrap.Offcanvas(offcanvasRef.value)
      
      // Remueve el atributo data-bs-toggle para evitar auto-inicialización duplicada
      // que puede causar race conditions
      toggleButtonRef.value?.removeAttribute('data-bs-toggle')
      toggleButtonRef.value?.removeAttribute('data-bs-target')
      
      // Ahora add event listeners DESPUÉS de que Bootstrap esté inicializado
      offcanvasRef.value.addEventListener('shown.bs.offcanvas', handleShown)
      offcanvasRef.value.addEventListener('hidden.bs.offcanvas', handleHidden)
      
      // Registrar listener para que el toggle button manual dispare toggle
      toggleButtonRef.value?.addEventListener('click', (e) => {
        e.preventDefault()
        offcanvasInstance.toggle()
      })
    } else {
      // Fallback: si Bootstrap no está disponible, usar el método anterior
      offcanvasRef.value.addEventListener('shown.bs.offcanvas', handleShown)
      offcanvasRef.value.addEventListener('hidden.bs.offcanvas', handleHidden)
    }

    window.addEventListener('hashchange', handleHashChange)
  })

  onUnmounted(() => {
    offcanvasRef.value?.removeEventListener('shown.bs.offcanvas', handleShown)
    offcanvasRef.value?.removeEventListener('hidden.bs.offcanvas', handleHidden)
    window.removeEventListener('hashchange', handleHashChange)
    isOffcanvasOpen.value = false
    setOffcanvasBodyState(false)
  })

  return {
    offcanvasRef,
    toggleButtonRef,
    isOffcanvasOpen,
    contactCtaEnabled,
    navbar,
    handleMobileNavLinkClick,
    handleContactClickDesktop,
    handleContactClickMobile
  }
}
