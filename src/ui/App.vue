<script setup lang="ts">
import { RouterView } from 'vue-router'
import ContentLoadingView from '@/ui/views/ContentLoadingView.vue'
import ContentUnavailableView from '@/ui/views/ContentUnavailableView.vue'
import { useApp } from './App'

const { isContentReady, isContentPending, isContentUnavailable, showDevBackendOfflineBanner, devBackendAvailability } =
  useApp()
</script>

<template>
  <div v-if="showDevBackendOfflineBanner" class="c-dev-backend-banner" role="status" aria-live="polite">
    <strong>Modo desarrollo sin backend.</strong>
    Usando fallback frontend local.
    <span v-if="devBackendAvailability.endpoint" class="c-dev-backend-banner__meta">
      endpoint: {{ devBackendAvailability.endpoint }}
      <template v-if="devBackendAvailability.status !== null">
        · status: {{ devBackendAvailability.status }}
      </template>
    </span>
  </div>
  <RouterView v-if="isContentReady" />
  <ContentLoadingView v-else-if="isContentPending" />
  <ContentUnavailableView v-else-if="isContentUnavailable" />
</template>
