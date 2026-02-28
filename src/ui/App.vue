<script setup lang="ts">
import { RouterView } from 'vue-router'
import ContentLoadingView from '@/ui/views/ContentLoadingView.vue'
import ContentUnavailableView from '@/ui/views/ContentUnavailableView.vue'
import { useApp } from './App'

const { isContentReady, isContentPending, isContentUnavailable } = useApp()
</script>

<template>
  <RouterView v-if="isContentReady" />
  <ContentLoadingView v-else-if="isContentPending" />
  <ContentUnavailableView v-else-if="isContentUnavailable" />
</template>
