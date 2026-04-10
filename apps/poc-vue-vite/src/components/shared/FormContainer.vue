<template>
  <form
    data-slot="form-container"
    :class="['w-full flex flex-col gap-6', className]"
    v-bind="$attrs"
  >
    <div
      v-if="$slots.header"
      data-slot="form-container-header"
      class="flex flex-col gap-2"
    >
      <slot name="header"></slot>
    </div>
    <div
      v-if="$slots.body"
      data-slot="form-container-body"
      class="flex flex-col gap-4"
    >
      <slot name="body"></slot>
    </div>
    <slot></slot>
    <div
      v-if="$slots.footer"
      data-slot="form-container-footer"
      class="mt-6 flex items-center justify-end gap-2"
    >
      <slot name="footer"></slot>
    </div>
  </form>
</template>

<script setup lang="ts">
defineProps<{
  className?: string;
}>();
</script>
