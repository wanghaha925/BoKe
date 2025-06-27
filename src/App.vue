<script setup lang="ts">
import { onMounted } from 'vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col">
    <TheNavbar />
    <main class="flex-1">
      <router-view />
    </main>
    <TheFooter />
  </div>
</template>

<style>
/* Global styles are handled by Tailwind CSS */
</style>
