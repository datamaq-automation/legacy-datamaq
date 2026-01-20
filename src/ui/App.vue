<script setup lang="ts">
import HomePage from '@/ui/pages/HomePage.vue'
import ThanksView from '@/ui/views/ThanksView.vue'
import { useApp } from './App'

const { isThanksPage } = useApp()
</script>

<template>
  <ThanksView v-if="isThanksPage" />
  <HomePage v-else />
</template>
