<template>
  <teleport to="body">
    <transition name="offcanvas">
      <div
        v-if="show"
        id="mainOffcanvas"
        class="tw:fixed tw:inset-0 tw:z-[1050] tw:flex tw:justify-end"
        role="dialog"
        aria-modal="true"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div 
          class="tw:absolute tw:inset-0 tw:bg-black/50 tw:backdrop-blur-sm"
          @click="close"
        ></div>

        <!-- Panel -->
        <div 
          class="tw:relative tw:w-full tw:max-w-xs tw:bg-dm-bg tw:shadow-xl tw:flex tw:flex-col tw:h-full tw:border-l tw:border-dm-border"
          @click.stop
        >
          <div class="tw:flex tw:items-center tw:justify-between tw:p-4 tw:border-b tw:border-dm-border">
            <h5 class="tw:text-lg tw:font-semibold tw:text-dm-text-0">
              <slot name="title"></slot>
            </h5>
            <button
              type="button"
              class="tw:p-2 tw:text-dm-text-muted hover:tw:text-dm-text-0 tw:transition-colors"
              aria-label="Cerrar"
              @click="close"
            >
              <svg viewBox="0 0 16 16" width="20" height="20" class="tw:fill-current">
                <path d="M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
          </div>
          <div class="tw:flex-1 tw:overflow-y-auto tw:p-4">
            <slot name="body"></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  emit('close')
}

// Lock scroll
watch(() => props.show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.offcanvas-enter-active,
.offcanvas-leave-active {
  transition: opacity 0.3s ease;
}

.offcanvas-enter-from,
.offcanvas-leave-to {
  opacity: 0;
}

.offcanvas-enter-active > div:last-child {
  transition: transform 0.3s ease-out;
}

.offcanvas-leave-active > div:last-child {
  transition: transform 0.2s ease-in;
}

.offcanvas-enter-from > div:last-child {
  transform: translateX(100%);
}

.offcanvas-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
