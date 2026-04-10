<script setup lang="ts">
withDefaults(defineProps<{
  color?: string;
}>(), {
  color: 'currentColor'
});
</script>

<template>
  <svg class="size-[11px]" fill="none" viewBox="0 0 14 14" aria-hidden="true">
    <path 
      :stroke="color" 
      stroke-width="2.5" 
      stroke-linecap="round" 
      d="M1 1L13 13M13 1L1 13" 
    />
  </svg>
</template>