<!--
Path: src/ui/layout/Navbar.vue
-->

<template>
  <header class="navbar navbar-dark navbar-expand-lg sticky-top border-bottom c-navbar" role="banner">
    <div class="container c-navbar__inner">
      <a class="navbar-brand fw-bold" href="#" :aria-label="navbar.brandAriaLabel">{{ navbar.brand }}</a>
      <button
        ref="toggleButtonRef"
        class="navbar-toggler d-lg-none c-navbar__toggle"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#mainOffcanvas"
        aria-controls="mainOffcanvas"
        :aria-expanded="isOffcanvasOpen ? 'true' : 'false'"
        aria-label="Abrir navegacion"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <nav class="d-none d-lg-flex ms-auto">
        <ul class="navbar-nav ms-auto gap-lg-3 align-items-lg-center c-navbar__links">
          <li v-for="link in navbar.links" :key="link.href" class="nav-item">
            <a class="nav-link" :href="link.href">{{ link.label }}</a>
          </li>
          <li v-if="contactCtaEnabled" class="nav-item c-navbar__cta-item d-grid gap-2">
            <a
              class="btn c-ui-btn c-ui-btn--primary ms-lg-3 c-navbar__cta"
              href="#contacto"
              @click.prevent="handleContactClickDesktop"
            >
              {{ navbar.contactLabel }}
            </a>
          </li>
        </ul>
      </nav>

    </div>
  </header>

  <teleport to="body">
    <div
      id="mainOffcanvas"
      ref="offcanvasRef"
      class="offcanvas offcanvas-end text-bg-dark c-navbar__offcanvas dmq-offcanvas d-lg-none"
      tabindex="-1"
      aria-labelledby="mainOffcanvasLabel"
      data-bs-backdrop="true"
      data-bs-scroll="false"
    >
      <div class="offcanvas-header">
        <h5 id="mainOffcanvasLabel" class="offcanvas-title">{{ navbar.brand }}</h5>
        <button
          type="button"
          class="c-navbar__close-btn"
          data-bs-dismiss="offcanvas"
          aria-label="Cerrar"
        >
          <svg class="c-navbar__close-icon" viewBox="0 0 16 16" width="20" height="20">
            <path fill="currentColor" d="M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z"/>
          </svg>
        </button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav gap-2 c-navbar__links">
          <li v-for="link in navbar.links" :key="`mobile-${link.href}`" class="nav-item">
            <a
              class="nav-link"
              :href="link.href"
              data-bs-dismiss="offcanvas"
              @click="handleMobileNavLinkClick"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
        <div v-if="contactCtaEnabled" class="d-grid mt-3">
          <a
            class="btn c-ui-btn c-ui-btn--primary c-navbar__cta"
            href="#contacto"
            data-bs-dismiss="offcanvas"
            @click.prevent="handleContactClickMobile"
          >
            {{ navbar.contactLabel }}
          </a>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import type { NavbarEmits, NavbarProps } from '@/ui/types/layout'
import { useNavbar } from './Navbar'

const props = defineProps<NavbarProps>()
const emit = defineEmits<NavbarEmits>()

const {
  offcanvasRef,
  toggleButtonRef,
  contactCtaEnabled,
  navbar,
  isOffcanvasOpen,
  handleMobileNavLinkClick,
  handleContactClickDesktop,
  handleContactClickMobile
} = useNavbar(props, emit)
</script>
