<!--
Path: src/ui/layout/Navbar.vue
-->

<template>
  <header class="navbar navbar-dark sticky-top border-bottom c-navbar" role="banner">
    <div ref="navRef" class="container-fluid px-3 c-navbar__inner">
      <!-- Botón hamburguesa a la izquierda, visible solo en mobile -->
      <button
        ref="toggleButtonRef"
        class="navbar-toggler me-2 c-navbar__toggle"
        type="button"
        :aria-label="menuOpen ? 'Cerrar menu' : 'Abrir menu'"
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
          class="navbar-collapse c-navbar__collapse"
          :class="{
            'd-lg-flex': isDesktop,
            'd-none d-lg-flex': !menuOpen && !isDesktop,
            'p-3 rounded shadow': !isDesktop
          }"
          ref="menuPanelRef"
        >
          <ul class="navbar-nav ms-lg-auto align-items-lg-center gap-lg-2">
            <li v-for="link in navbar.links" :key="link.href" class="nav-item">
              <a class="nav-link" :href="link.href" @click="handleNavLinkClick">{{ link.label }}</a>
            </li>
            <li v-if="contactCtaEnabled" class="nav-item ms-lg-3">
              <button type="button" class="btn c-ui-btn c-ui-btn--primary" @click="handleContactClick">
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
  menuPanelRef,
  toggleButtonRef,
  contactCtaEnabled,
  navbar,
  toggleMenu,
  handleNavLinkClick,
  handleContactClick
} = useNavbar(props, emit)
</script>
