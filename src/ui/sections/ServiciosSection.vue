<!--
Path: src/ui/sections/ServiciosSection.vue
-->

<template>
  <section id="servicios" class="section-mobile py-5 bg-body-secondary text-body c-services" aria-labelledby="servicios-title">
    <div class="container">
      <h2 id="servicios-title" class="mb-5 text-center text-body-emphasis c-services__title">{{ services.title }}</h2>
      <div class="row g-4">
        <div class="col-12 col-lg-6">
          <ServiceCard :card="primaryCard" :chat-enabled="chatEnabled" @contact="emit('contact', $event)" />
        </div>
        <div class="col-12 col-lg-6">
          <ServiceCard :card="secondaryCard" :chat-enabled="chatEnabled" @contact="emit('contact', $event)" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ServiciosSectionEmits, ServiciosSectionProps } from '@/ui/types/sections'
import { useContainer } from '@/di/container'
import { useServiciosSection } from '@/application/sections/useServiciosSection'
import ServiceCard from './ServiceCard.vue'

const props = defineProps<ServiciosSectionProps>()
const emit = defineEmits<ServiciosSectionEmits>()

const { content } = useContainer()
const chatEnabled = computed(() => props.chatEnabled)
const { services, primaryCard, secondaryCard } = useServiciosSection(content, chatEnabled)

defineOptions({
  name: 'ServiciosSection'
})
</script>
