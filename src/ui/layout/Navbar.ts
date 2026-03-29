import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useContainer } from '@/di/container'
import type { NavbarEmits, NavbarProps } from '@/ui/types/layout'

export function useNavbar(props: NavbarProps, emit: NavbarEmits) {
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

  function toggleOffcanvas() {
    isOffcanvasOpen.value = !isOffcanvasOpen.value
    setOffcanvasBodyState(isOffcanvasOpen.value)
  }

  function handleContactClickDesktop() {
    emit('contact')
  }

  function hideOffcanvas() {
    isOffcanvasOpen.value = false
    setOffcanvasBodyState(false)
  }

  function handleMobileNavLinkClick() {
    hideOffcanvas()
  }

  function handleContactClickMobile() {
    emit('contact')
    hideOffcanvas()
  }

  function handleHashChange() {
    hideOffcanvas()
  }

  onMounted(() => {
    window.addEventListener('hashchange', handleHashChange)
  })

  onUnmounted(() => {
    window.removeEventListener('hashchange', handleHashChange)
    isOffcanvasOpen.value = false
    setOffcanvasBodyState(false)
  })

  return {
    isOffcanvasOpen,
    contactCtaEnabled,
    navbar,
    toggleOffcanvas,
    hideOffcanvas,
    handleMobileNavLinkClick,
    handleContactClickDesktop,
    handleContactClickMobile
  }
}
