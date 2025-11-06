<!--
Path: src/components/Navbar.vue
-->

<template>
  <header class="navbar navbar-dark bg-dark sticky-top border-bottom" role="banner">
    <div class="container-fluid px-3">
      <!-- Botón hamburguesa a la izquierda, visible solo en mobile -->
      <button
        class="navbar-toggler me-2"
        type="button"
        aria-label="Abrir menú"
        @click="toggleMenu"
        :aria-expanded="menuOpen"
        aria-controls="main-navbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand fw-bold" href="#" aria-label="profebustos, inicio">profebustos</a>
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
          <ul class="navbar-nav ms-lg-auto">
            <li class="nav-item">
              <a class="nav-link" href="#servicios">Servicios</a>
            </li>
            <li class="nav-item" v-if="chatEnabled">
              <a class="nav-link" :href="chatUrl" target="_blank" rel="noopener">Conversar con el bot</a>
            </li>
          </ul>
        </nav>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  chatEnabled: boolean
  chatUrl: string
}>()

const menuOpen = ref(false)
const isDesktop = ref(window.innerWidth >= 992)
const navRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

// Actualiza isDesktop al cambiar el tamaño de ventana
function handleResize() {
  isDesktop.value = window.innerWidth >= 992
  if (isDesktop.value) menuOpen.value = false
}

// Cierra el menú si se hace click fuera del nav (solo mobile)
function handleClickOutside(event: MouseEvent) {
  if (
    menuOpen.value &&
    navRef.value &&
    !navRef.value.contains(event.target as Node)
  ) {
    menuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('mousedown', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousedown', handleClickOutside)
})
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
