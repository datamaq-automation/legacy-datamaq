<!--
Path: src/ui/layout/Navbar.vue
-->

<template>
  <header class="navbar navbar-dark bg-dark sticky-top border-bottom" role="banner">
    <div class="container-fluid px-3">
      <!-- Botón hamburguesa a la izquierda, visible solo en mobile -->
      <button
        ref="toggleButtonRef"
        class="navbar-toggler me-2"
        type="button"
        aria-label="Abrir menú"
        @click="toggleMenu"
        :aria-expanded="menuOpen"
        aria-controls="main-navbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand fw-bold" href="#" :aria-label="navbar.brandAriaLabel">{{ navbar.brand }}</a>
      <!-- Menú colapsable -->
      <transition name="slide-fade">
        <nav
          v-if="menuOpen || isDesktop"
          id="main-navbar"
          class="navbar-collapse"
          :class="{
            'd-lg-flex': isDesktop,
            'd-none d-lg-flex': !menuOpen && !isDesktop,
            'bg-dark': !isDesktop,
            'p-3 rounded shadow': !isDesktop
          }"
          ref="navRef"
        >
          <ul class="navbar-nav ms-lg-auto align-items-lg-center gap-lg-2">
            <li v-for="link in navbar.links" :key="link.href" class="nav-item">
              <a class="nav-link" :href="link.href" @click="handleNavLinkClick">{{ link.label }}</a>
            </li>
            <li v-if="chatEnabled" class="nav-item ms-lg-3">
              <button
                type="button"
                class="btn btn-success"
                @click="handleContactClick"
              >
                {{ navbar.contactLabel }}
              </button>
            </li>
          </ul>
        </nav>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { NavbarEmits, NavbarProps } from '@/ui/types/layout'
import { useNavbar } from './Navbar'

const props = defineProps<NavbarProps>()
const emit = defineEmits<NavbarEmits>()

const {
  menuOpen,
  isDesktop,
  navRef,
  toggleButtonRef,
  chatEnabled,
  navbar,
  toggleMenu,
  handleNavLinkClick,
  handleContactClick
} = useNavbar(props, emit)
</script>

<style scoped>
/* Animación para el colapsable SOLO en mobile */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: max-height 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s;
  overflow: hidden;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 200px;
  opacity: 1;
}

/* Deshabilitar animación y altura extra en desktop */
@media (min-width: 992px) {
  .navbar-toggler {
    display: none !important;
  }
  .slide-fade-enter-active,
  .slide-fade-leave-active,
  .slide-fade-enter-from,
  .slide-fade-leave-to,
  .slide-fade-enter-to,
  .slide-fade-leave-from {
    transition: none !important;
    max-height: none !important;
    opacity: 1 !important;
    overflow: visible !important;
  }
  .navbar-collapse {
    padding: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    background: transparent !important;
  }
}
</style>
