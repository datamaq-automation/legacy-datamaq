<script setup lang="ts" src="./App.ts"></script>

<template>
  <ThanksView v-if="isThanksPage" />
  <HomePage v-else />
</template>
