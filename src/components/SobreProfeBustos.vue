<!--
Path: src/components/SobreProfeBustos.vue
-->

<template>
  <section class="sobre-section py-5 border border-white rounded" aria-labelledby="sobre-title">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-4 text-center mb-4 mb-md-0">
          <img
            :src="teamTraining"
            alt="Ilustración de equipo técnico en sesión de formación"
            class="img-fluid rounded shadow"
            width="240"
            height="180"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="col-md-8">
          <h2 id="sobre-title" class="mb-3 accent-title">Sobre profebustos</h2>
          <p>
            profebustos es liderado por profesionales con experiencia en la industria y la educación técnica. 
            Nuestra misión es ayudar a las empresas del GBA Norte a mejorar su eficiencia energética y operativa, 
            combinando tecnología de medición y formación especializada.
          </p>
          <p>
            El responsable principal cuenta con trayectoria en instalaciones industriales y docencia, 
            aportando una visión integral para interpretar datos y tomar decisiones informadas.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import teamTraining from '@/assets/team-training.svg'

defineOptions({
  name: 'SobreProfeBustos'
})
</script>
