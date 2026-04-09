<template>
  <div
    v-if="isOpen"
    :data-slot="'modal-overlay'"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    @click="onBackdropClick"
  >
    <div
      :data-slot="'modal'"
      class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      role="dialog"
      aria-modal="true"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  onClose?: () => void;
}>();

const onBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget && props.onClose) {
    props.onClose();
  }
};
</script>

<!-- Sub-components for slot composition -->
<template>
  <div :data-slot="'modal-header'" class="mb-4 flex flex-col gap-2">
    <slot name="header"></slot>
  </div>
</template>

<template>
  <div :data-slot="'modal-body'" class="flex flex-col gap-4">
    <slot name="body"></slot>
  </div>
</template>

<template>
  <div
    :data-slot="'modal-footer'"
    class="mt-6 flex items-center justify-end gap-2"
  >
    <slot name="footer"></slot>
  </div>
</template>
