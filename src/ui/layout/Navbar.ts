import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useContainer } from '@/di/container'
import type { NavbarEmits, NavbarProps } from '@/ui/types/layout'

export function useNavbar(props: NavbarProps, emit: NavbarEmits) {
  const offcanvasRef = ref<HTMLElement | null>(null)
  const toggleButtonRef = ref<HTMLButtonElement | null>(null)
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

  function closeOffcanvas() {
    if (!offcanvasRef.value || typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const bootstrap = (
      window as Window & {
        bootstrap?: { Offcanvas?: { getOrCreateInstance: (el: Element) => { hide: () => void } } }
      }
    ).bootstrap
    bootstrap?.Offcanvas?.getOrCreateInstance(offcanvasRef.value)?.hide()

    offcanvasRef.value.classList.remove('show')
    offcanvasRef.value.setAttribute('aria-modal', 'false')
    offcanvasRef.value.setAttribute('aria-hidden', 'true')
    offcanvasRef.value.removeAttribute('role')

    document.documentElement.classList.remove('dmq-offcanvas-open')
    document.body.classList.remove('dmq-offcanvas-open')
    document.getElementById('app')?.classList.remove('dmq-offcanvas-open')
    document.body.classList.remove('offcanvas-open')
    document.body.classList.remove('offcanvas-backdrop')
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('padding-right')

    document.querySelectorAll('.offcanvas-backdrop').forEach((backdrop) => backdrop.remove())
  }

  function handleMobileNavLinkClick() {
    closeOffcanvas()
  }

  function handleContactClickMobile() {
    emit('contact')
    closeOffcanvas()
  }

  function handleShown() {
    setOffcanvasBodyState(true)
  }

  function handleHidden() {
    setOffcanvasBodyState(false)
  }

  onMounted(() => {
    offcanvasRef.value?.addEventListener('shown.bs.offcanvas', handleShown)
    offcanvasRef.value?.addEventListener('hidden.bs.offcanvas', handleHidden)
  })

  onUnmounted(() => {
    offcanvasRef.value?.removeEventListener('shown.bs.offcanvas', handleShown)
    offcanvasRef.value?.removeEventListener('hidden.bs.offcanvas', handleHidden)
    setOffcanvasBodyState(false)
  })

  return {
    offcanvasRef,
    toggleButtonRef,
    contactCtaEnabled,
    navbar,
    handleMobileNavLinkClick,
    handleContactClickDesktop,
    handleContactClickMobile
  }
}
