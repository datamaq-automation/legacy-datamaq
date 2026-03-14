<script setup lang="ts">
import type { DecisionFlowFaqContent } from '@/domain/types/content'

defineProps<{
  faqItems: DecisionFlowFaqContent[]
}>()
</script>

<template>
  <div class="c-home-faq__stack">
    <details
      v-for="(item, index) in faqItems"
      :key="item.question"
      class="c-home-faq__item"
      :open="index === 0"
    >
      <summary class="c-home-faq__summary">
        <span>{{ item.question }}</span>
        <span class="c-home-faq__toggle" aria-hidden="true">
          <i class="bi bi-plus-lg"></i>
        </span>
      </summary>
      <p class="c-home-faq__answer">
        {{ item.answer }}
      </p>
    </details>
  </div>
</template>

<style scoped lang="scss">
.c-home-faq__stack {
  display: grid;
  gap: 1rem;
}

.c-home-faq__item {
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.1);
  border-radius: 1.25rem;
  background: rgba(10, 26, 48, 0.9);
  overflow: hidden;
}

.c-home-faq__summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.25rem;
  color: var(--dm-text-0);
  font-weight: 700;
}

.c-home-faq__summary::-webkit-details-marker {
  display: none;
}

.c-home-faq__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--dm-accent-orange-rgb));
  transition: transform 0.24s ease;
}

.c-home-faq__item[open] .c-home-faq__toggle {
  transform: rotate(180deg);
}

.c-home-faq__answer {
  margin: 0;
  padding: 0 1.25rem 1.25rem;
  color: rgba(var(--dm-text-0-rgb), 0.74);
  line-height: 1.65;
}

@media (max-width: 575.98px) {
  .c-home-faq__summary {
    padding-inline: 1rem;
  }

  .c-home-faq__answer {
    padding-inline: 1rem;
  }
}
</style>
