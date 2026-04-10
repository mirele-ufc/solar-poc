<template>
  <div
    data-slot="card"
    class="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border px-4 py-3"
    :class="className"
  >
    <div
      v-if="$slots.header"
      data-slot="card-header"
      class="flex flex-col gap-2"
    >
      <slot name="header"></slot>
    </div>
    <div v-if="$slots.title" data-slot="card-title">
      <slot name="title"></slot>
    </div>
    <div v-if="$slots.body" data-slot="card-body" class="flex flex-col gap-4">
      <slot name="body"></slot>
    </div>
    <slot></slot>
    <div
      v-if="$slots.footer"
      data-slot="card-footer"
      class="mt-6 flex justify-end gap-2"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  className?: string;
}>();
</script>
