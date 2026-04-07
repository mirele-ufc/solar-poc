<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  src?: string
  alt?: string
  className?: string
  style?: string | Record<string, any>
}>()

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

const didError = ref(false)

const handleError = () => {
  didError.value = true
}

// Se o src mudar externamente, resetamos o estado de erro para tentar carregar a nova imagem
watch(() => props.src, () => {
  didError.value = false
})
</script>

<template>
  <div
    v-if="didError"
    :class="['inline-block bg-gray-100 text-center align-middle', className]"
    :style="style"
  >
    <div class="flex items-center justify-center w-full h-full">
      <img 
        :src="ERROR_IMG_SRC" 
        alt="Error loading image" 
        v-bind="$attrs" 
        :data-original-url="src" 
      />
    </div>
  </div>

  <img
    v-else
    :src="src"
    :alt="alt"
    :class="className"
    :style="style"
    v-bind="$attrs"
    @error="handleError"
  />
</template>

<script lang="ts">
// Desabilitamos a herança automática de atributos para o elemento raiz 
// para podermos usar o v-bind="$attrs" manualmente nos elementos <img> internos
export default {
  inheritAttrs: false
}
</script>