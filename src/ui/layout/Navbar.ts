import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useBreakpoint } from '@/ui/composables/useBreakpoint'
import { useClickOutside } from '@/ui/composables/useClickOutside'
import { useContent } from '@/ui/composables/useContent'
import type { NavbarEmits, NavbarProps } from '@/ui/types/layout'

export function useNavbar(props: NavbarProps, emit: NavbarEmits) {
  const menuOpen = ref(false)
  const { matches: isDesktop } = useBreakpoint(992)
  const navRef = ref<HTMLElement | null>(null)
  const toggleButtonRef = ref<HTMLButtonElement | null>(null)
  const chatEnabled = computed(() => props.chatEnabled)
  const { navbar } = useContent()

  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  function closeMenu(returnFocus = false) {
    menuOpen.value = false
    if (returnFocus) {
      toggleButtonRef.value?.focus()
    }
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

  useClickOutside(navRef, onCloseOutside, menuOpen)

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    if (isDesktop.value) {
      closeMenu()
    }
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    menuOpen,
    isDesktop,
    navRef,
    toggleButtonRef,
    chatEnabled,
    navbar,
    toggleMenu,
    handleNavLinkClick,
    handleContactClick
  }
}
