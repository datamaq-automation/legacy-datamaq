<!--
Path: src/ui/sections/PerfilSection.vue
-->

<template>
  <section id="perfil" class="perfil-section section-mobile py-5" aria-labelledby="perfil-title">
    <div class="container">
      <div class="row align-items-start">
        <div class="col-lg-4 mb-4 mb-lg-0">
          <h2 id="perfil-title" class="mb-3 accent-title perfil-title">{{ profile.title }}</h2>
        </div>
        <div class="col-lg-8">
          <ul class="perfil-list">
            <li v-for="(bullet, index) in profile.bullets" :key="index" class="perfil-item">
              <span>{{ bullet }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePerfilSection } from './PerfilSection'

const { profile } = usePerfilSection()

defineOptions({
  name: 'PerfilSection'
})
</script>
