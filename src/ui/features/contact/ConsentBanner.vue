<!--
Path: src/ui/features/contact/ConsentBanner.vue
-->
<template>
  <div
    v-if="visible"
    class="c-consent-banner c-consent-banner--shell position-fixed bottom-0 start-50 translate-middle-x w-100 shadow-lg"
    role="dialog"
    aria-modal="true"
    aria-labelledby="consent-banner-title"
  >
    <div class="container py-3">
      <div class="row align-items-center g-3">
        <div class="col-12 col-lg">
          <h2 id="consent-banner-title" class="h6 fw-semibold mb-1 text-body">{{ consent.title }}</h2>
          <p class="mb-0 small text-body-secondary">
            {{ consent.description }}
          </p>
        </div>
        <div class="col-12 col-lg-auto d-flex gap-2 justify-content-lg-end c-consent-banner__actions">
          <button
            type="button"
            class="btn btn-outline-secondary c-consent-banner__button"
            @click="reject"
            data-testid="consent-reject"
          >
            {{ consent.rejectLabel }}
          </button>
          <button
            type="button"
            class="btn btn-primary c-consent-banner__button"
            @click="accept"
            data-testid="consent-accept"
          >
            {{ consent.acceptLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConsentBanner } from './ConsentBanner'

const {
  consent,
  visible,
  accept,
  reject
} = useConsentBanner()
</script>
