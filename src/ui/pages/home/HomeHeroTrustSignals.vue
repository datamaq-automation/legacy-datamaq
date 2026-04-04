<script setup lang="ts">
import type { ImageContent } from '@/domain/types/content'

defineProps<{
  trustLogos?: ImageContent[]
  trustSignals: string[]
}>()
</script>

<template>
  <div
    class="c-home-hero__trust-inline"
    :aria-label="trustLogos?.length ? 'Marcas que confían' : 'Capacidades destacadas'"
  >
    <template v-if="trustLogos?.length">
      <img
        v-for="(logo, idx) in trustLogos"
        :key="idx"
        :src="logo.src"
        :alt="logo.alt"
        class="c-home-hero__trust-logo"
        loading="lazy"
        decoding="async"
      />
    </template>
    <template v-else>
      <span v-for="signal in trustSignals.slice(0, 3)" :key="signal" class="c-home-hero__trust-chip">
        {{ signal }}
      </span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.c-home-hero__trust-inline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow-x: auto;
  margin-top: 1rem;
  padding-bottom: 0.15rem;
  scrollbar-width: none;
}

.c-home-hero__trust-inline::-webkit-scrollbar {
  display: none;
}

.c-home-hero__trust-logo {
  flex: 0 0 auto;
  height: clamp(1.6rem, 2.7vw, 2.05rem);
  width: auto;
  opacity: 0.78;
  filter: grayscale(1) brightness(1.4);
}

.c-home-hero__trust-chip {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 0.48rem 0.8rem;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.16);
  background: rgba(var(--dm-text-0-rgb), 0.06);
  color: rgba(var(--dm-text-0-rgb), 0.8);
  font-size: 0.79rem;
}
</style>
