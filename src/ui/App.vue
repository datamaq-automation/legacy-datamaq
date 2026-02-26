<script setup lang="ts">
import { RouterView } from 'vue-router'
import ContentUnavailableView from '@/ui/views/ContentUnavailableView.vue'
import { useApp } from './App'

const { isContentReady, isContentUnavailable } = useApp()
</script>

<template>
  <RouterView v-if="isContentReady" />
  <ContentUnavailableView v-else-if="isContentUnavailable" />
</template>
