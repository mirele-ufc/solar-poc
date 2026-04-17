<script setup lang="ts">
withDefaults(defineProps<{
  color?: string;
}>(), {
  color: 'currentColor'
});
</script>

<template>
  <svg class="size-[13px]" fill="none" viewBox="0 0 20 16" aria-hidden="true">
    <path 
      :stroke="color" 
      stroke-width="2.5" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="M1 7L7 13L19 1" 
    />
  </svg>
</template>