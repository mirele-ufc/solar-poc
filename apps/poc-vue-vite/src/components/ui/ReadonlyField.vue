<script setup lang="ts">
import { useId } from 'vue';

defineProps<{
  label: string;
  value: string;
}>();

const id = useId();
</script>

<template>
  <div class="flex flex-col gap-[4px]">
    <span
      :id="id"
      class="font-['Figtree:Medium',sans-serif] font-medium text-[#595959] text-[14px] leading-[20px] uppercase tracking-wider"
    >
      {{ label }}
    </span>
    <div
      :aria-labelledby="id"
      class="bg-[#f5f5f5] border border-[#d0d0d0] h-[56px] flex items-center px-[20px]"
    >
      <span class="font-['Figtree:Regular',sans-serif] font-normal text-[#333] text-[16px]">
        {{ value }}
      </span>
    </div>
  </div>
</template>