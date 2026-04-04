<script setup lang="ts">
defineProps<{
  currentStep: number
  stepLabels: readonly string[]
}>()

const emit = defineEmits<{
  (event: 'go-to-step', targetStep: number): void
}>()

function handleGoToStep(targetStep: number) {
  emit('go-to-step', targetStep)
}
</script>

<template>
  <ol class="c-contact__stepper" aria-label="Pasos del formulario">
    <li
      v-for="(label, index) in stepLabels"
      :key="label"
      class="c-contact__stepper-item"
      :class="{
        'is-active': currentStep === index + 1,
        'is-completed': currentStep > index + 1
      }"
    >
      <button
        type="button"
        class="c-contact__stepper-trigger"
        :aria-current="currentStep === index + 1 ? 'step' : undefined"
        :aria-label="`Andá al paso ${index + 1}: ${label}`"
        @click="handleGoToStep(index + 1)"
      >
        <span class="c-contact__stepper-dot" aria-hidden="true">
          <span v-if="currentStep > index + 1">&#10003;</span>
          <span v-else>{{ index + 1 }}</span>
        </span>
        <span class="c-contact__stepper-label">{{ label }}</span>
      </button>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.c-contact__stepper {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin: 0 0 0.8rem;
  padding: 0;
  list-style: none;
}

.c-contact__stepper-item {
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.16);
  border-radius: 999px;
  background: rgba(var(--dm-text-0-rgb), 0.03);
  color: rgba(var(--dm-text-0-rgb), 0.78);
  min-width: 0;
}

.c-contact__stepper-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.55rem;
  background: transparent;
  color: inherit;
  border: 0;
  text-align: left;
  border-radius: 999px;
}

.c-contact__stepper-trigger:focus-visible {
  outline: 2px solid rgb(var(--dm-accent-orange-rgb));
  outline-offset: 2px;
}

.c-contact__stepper-dot {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.25);
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}

.c-contact__stepper-label {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.c-contact__stepper-item.is-active {
  border-color: rgba(var(--dm-accent-orange-rgb), 0.8);
  background: rgba(var(--dm-accent-orange-rgb), 0.14);
  color: var(--dm-text-0);
}

.c-contact__stepper-item.is-active .c-contact__stepper-dot {
  border-color: rgb(var(--dm-accent-orange-rgb));
  background: rgba(var(--dm-accent-orange-rgb), 0.2);
}

.c-contact__stepper-item.is-completed {
  border-color: rgba(var(--dm-accent-orange-rgb), 0.6);
  color: rgba(var(--dm-accent-orange-rgb), 0.95);
}

.c-contact__stepper-item.is-completed .c-contact__stepper-dot {
  border-color: rgb(var(--dm-accent-orange-rgb));
  background: rgb(var(--dm-accent-orange-rgb));
  color: var(--dm-bg-0);
}

@media (max-width: 767.98px) {
  .c-contact__stepper {
    grid-template-columns: 1fr;
  }
}
</style>
