<!--
Path: src/ui/layout/Navbar.vue
-->

<template>
  <header class="tw:sticky tw:top-0 tw:z-[1040] tw:w-full tw:bg-dm-bg/80 tw:backdrop-blur-md tw:border-b tw:border-dm-border c-navbar" role="banner">
    <div class="tw:max-w-7xl tw:mx-auto tw:px-4 tw:h-16 tw:flex tw:items-center tw:justify-between c-navbar__inner">
      <a class="tw:text-xl tw:font-bold tw:text-dm-text-0" href="#" :aria-label="navbar.brandAriaLabel">{{ navbar.brand }}</a>
      <button
        class="tw:lg:hidden tw:p-2 tw:text-dm-text-muted hover:tw:text-dm-text-0 tw:transition-colors c-navbar__toggle"
        type="button"
        :aria-expanded="isOffcanvasOpen ? 'true' : 'false'"
        aria-label="Abrir navegacion"
        data-bs-toggle="offcanvas"
        data-bs-target="#mainOffcanvas"
        aria-controls="mainOffcanvas"
        @click="toggleOffcanvas"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" class="tw:fill-current">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>

      <nav class="tw:hidden tw:lg:flex tw:ml-auto">
        <ul class="tw:flex tw:items-center tw:gap-8 c-navbar__links">
          <li v-for="link in navbar.links" :key="link.href" class="nav-item">
            <a class="tw:text-dm-text-0 hover:tw:text-dm-primary tw:transition-colors" :href="link.href">{{ link.label }}</a>
          </li>
          <li v-if="contactCtaEnabled" class="tw:ml-4">
            <a
              class="tw:btn-primary"
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

  <BaseOffcanvas
    :show="isOffcanvasOpen"
    @close="hideOffcanvas"
  >
    <template #title>
      {{ navbar.brand }}
    </template>
    <template #body>
      <ul class="tw:flex tw:flex-col tw:gap-4">
        <li v-for="link in navbar.links" :key="`mobile-${link.href}`">
          <a
            class="tw:text-dm-text-0 tw:text-lg tw:font-medium hover:tw:text-dm-primary tw:transition-colors"
            :href="link.href"
            @click="handleMobileNavLinkClick"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
      <div v-if="contactCtaEnabled" class="tw:mt-8">
        <a
          class="tw:btn-primary tw:w-full"
          href="#contacto"
          @click.prevent="handleContactClickMobile"
        >
          {{ navbar.contactLabel }}
        </a>
      </div>
    </template>
  </BaseOffcanvas>
</template>

<script setup lang="ts">
import type { NavbarEmits, NavbarProps } from '@/ui/types/layout'
import { useNavbar } from './Navbar'
import BaseOffcanvas from '@/ui/components/BaseOffcanvas.vue'

const props = defineProps<NavbarProps>()
const emit = defineEmits<NavbarEmits>()

const {
  contactCtaEnabled,
  navbar,
  isOffcanvasOpen,
  toggleOffcanvas,
  hideOffcanvas,
  handleMobileNavLinkClick,
  handleContactClickDesktop,
  handleContactClickMobile
} = useNavbar(props, emit)
</script>
