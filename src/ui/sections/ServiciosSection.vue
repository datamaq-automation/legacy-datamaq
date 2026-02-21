<!--
Path: src/ui/sections/ServiciosSection.vue
-->

<template>
  <section id="servicios" class="section-mobile py-5 bg-body-secondary text-body c-services" aria-labelledby="servicios-title">
    <div class="container">
      <h2 id="servicios-title" class="mb-3 text-center text-body-emphasis c-services__title">
        {{ services.title }}
      </h2>
      <p v-if="servicesSubtitle" class="mx-auto mb-5 text-center text-secondary c-services__intro">
        {{ servicesSubtitle }}
      </p>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div
          v-for="card in cards"
          :key="card.id"
          class="col"
        >
          <ServiceCard :card="card" @contact="emit('contact', $event)" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ServiciosSectionEmits, ServiciosSectionProps } from '@/ui/types/sections'
import { useContainer } from '@/di/container'
import { useServiciosSection } from '@/application/sections/useServiciosSection'
import ServiceCard from './ServiceCard.vue'

defineProps<ServiciosSectionProps>()
const emit = defineEmits<ServiciosSectionEmits>()

const { content } = useContainer()
const { services, cards } = useServiciosSection(content)
const servicesSubtitle =
  'Elegí el alcance que necesitás y coordinamos una intervención prolija, segura y documentada.'

defineOptions({
  name: 'ServiciosSection'
})
</script>
