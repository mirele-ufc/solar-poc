<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isRouterReady = ref(false)

onMounted(async () => {
  await router.isReady()
  isRouterReady.value = true
})
</script>

<template>
  <RouterView v-if="isRouterReady" />
</template>