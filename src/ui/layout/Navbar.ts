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
    offcanvasRef.value?.addEventListener('shown.bs.offcanvas', handleShown)
    offcanvasRef.value?.addEventListener('hidden.bs.offcanvas', handleHidden)
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
