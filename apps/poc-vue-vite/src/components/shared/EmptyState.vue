<script setup lang="ts">
defineProps<{
  message: string;
  sub: string;
}>();

const BOOK_ICON = "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z";
</script>

<template>
  <div class="flex flex-col items-center gap-[12px] py-[40px] text-center bg-[#f5f8ff] rounded-[12px]">
    <svg
      class="size-[48px] opacity-25"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path :d="BOOK_ICON" fill="#021b59" />
    </svg>
    <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
      {{ message }}
    </p>
    <p class="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[14px]">
      {{ sub }}
    </p>
  </div>
</template>