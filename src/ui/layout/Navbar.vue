<!--
Path: src/ui/layout/Navbar.vue
-->

<template>
  <header class="navbar navbar-dark navbar-expand-lg sticky-top border-bottom c-navbar" role="banner">
    <div ref="navRef" class="container c-navbar__inner">
      <a class="navbar-brand fw-bold" href="#" :aria-label="navbar.brandAriaLabel">{{ navbar.brand }}</a>
      <button
        ref="toggleButtonRef"
        class="navbar-toggler d-lg-none c-navbar__toggle"
        type="button"
        :aria-label="menuOpen ? 'Cerrar navegacion' : 'Abrir navegacion'"
        @click="toggleMenu"
        :aria-expanded="menuOpen"
        aria-controls="main-navbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <nav
        id="main-navbar"
        ref="menuPanelRef"
        class="collapse navbar-collapse c-navbar__collapse dmq-navpanel mt-2 p-3 rounded-3 shadow-sm"
        :class="{ show: menuOpen || isDesktop }"
      >
        <ul class="navbar-nav ms-auto gap-lg-3 align-items-lg-center c-navbar__links">
          <li v-for="link in navbar.links" :key="link.href" class="nav-item">
            <a class="nav-link" :href="link.href" @click="handleNavLinkClick">{{ link.label }}</a>
          </li>
          <li v-if="contactCtaEnabled" class="nav-item c-navbar__cta-item d-grid gap-2">
            <a
              class="btn c-ui-btn c-ui-btn--primary ms-lg-3 c-navbar__cta"
              href="#contacto"
              @click.prevent="handleContactClick"
            >
              {{ navbar.contactLabel }}
            </a>
          </li>
        </ul>
      </nav>
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
