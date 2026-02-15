import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useBreakpoint } from '@/ui/composables/useBreakpoint'
import { useClickOutside } from '@/ui/composables/useClickOutside'
import { useContainer } from '@/di/container'
import type { NavbarEmits, NavbarProps } from '@/ui/types/layout'

export function useNavbar(props: NavbarProps, emit: NavbarEmits) {
  const menuOpen = ref(false)
  const { matches: isDesktop } = useBreakpoint(992)
  const navRef = ref<HTMLElement | null>(null)
  const menuPanelRef = ref<HTMLElement | null>(null)
  const toggleButtonRef = ref<HTMLButtonElement | null>(null)
  const contactCtaEnabled = computed(() => props.contactCtaEnabled)
  const { content } = useContainer()
  const navbar = content.getNavbarContent()

  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  function closeMenu(returnFocus = false) {
    menuOpen.value = false
    if (returnFocus) {
      toggleButtonRef.value?.focus()
    }
  }

  function setBodyScrollLock(isLocked: boolean) {
    if (typeof document === 'undefined') {
      return
    }
    document.body.classList.toggle('has-open-menu', isLocked)
  }

  function focusFirstMenuItem() {
    const firstFocusable = menuPanelRef.value?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()
  }

  function onCloseOutside() {
    if (!menuOpen.value) {
      return
    }
    closeMenu()
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && menuOpen.value) {
      event.preventDefault()
      closeMenu(true)
    }
  }

  function handleNavLinkClick() {
    if (!isDesktop.value) {
      closeMenu()
    }
  }

  function handleContactClick() {
    emit('contact')
    if (!isDesktop.value) {
      closeMenu(true)
    }
  }

  watch(menuOpen, async (isOpen) => {
    const shouldLockScroll = isOpen && !isDesktop.value
    setBodyScrollLock(shouldLockScroll)

    if (shouldLockScroll) {
      await nextTick()
      focusFirstMenuItem()
    }
  })

  watch(isDesktop, (desktop) => {
    if (desktop && menuOpen.value) {
      closeMenu()
    }
    if (desktop) {
      setBodyScrollLock(false)
    }
  })

  useClickOutside(navRef, onCloseOutside, menuOpen)

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    if (isDesktop.value) {
      closeMenu()
    }
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    setBodyScrollLock(false)
  })

  return {
    menuOpen,
    isDesktop,
    navRef,
    menuPanelRef,
    toggleButtonRef,
    contactCtaEnabled,
    navbar,
    toggleMenu,
    handleNavLinkClick,
    handleContactClick
  }
}
