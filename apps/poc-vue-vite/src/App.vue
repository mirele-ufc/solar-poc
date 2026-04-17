<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSessionTimeout } from "@/composables/useSessionTimeout";

const router = useRouter();
const isRouterReady = ref(false);

// Session timeout: auto-logout após 30min de inatividade (OWASP A07)
useSessionTimeout();

onMounted(async () => {
  await router.isReady();
  isRouterReady.value = true;
});
</script>

<template>
  <RouterView v-if="isRouterReady" />
</template>
