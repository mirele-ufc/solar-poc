<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  id: string;
  label: string;
  modelValue: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const show = ref(false);

const eyePath = "M2 12C2.945 7.436 7.063 4 12 4C16.937 4 21.055 7.436 22 12C21.055 16.564 16.937 20 12 20C7.063 20 2.945 16.564 2 12ZM12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17ZM12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15Z";
const eyeOffPath = "M3.707 2.293a1 1 0 0 0-1.414 1.414l18 18a1 1 0 0 0 1.414-1.414l-1.473-1.473A10.014 10.014 0 0 0 22 12c-.955-4.564-5.073-8-10-8a9.958 9.958 0 0 0-5.458 1.626L3.707 2.293ZM7.68 7.68l1.454 1.454A4.003 4.003 0 0 1 16 12c0 .342-.037.676-.107.998l1.559 1.559A9.953 9.953 0 0 0 20 12c-.946-3.822-4.401-7-8-7a8.38 8.38 0 0 0-4.32 1.32Z M12 5C7.063 5 2.945 8.436 2 13c.464 2.216 1.67 4.162 3.35 5.552l1.423-1.423A7.977 7.977 0 0 1 4 13c.946-3.822 4.401-7 8-7 .748 0 1.47.107 2.152.306L15.707 4.75A9.95 9.95 0 0 0 12 5Z M12 17a4 4 0 0 1-3.866-2.958l-1.44-1.44A6 6 0 0 0 12 19c.342 0 .676-.037.998-.107l-1.441-1.441A4.013 4.013 0 0 1 12 17Z";
</script>

<template>
  <div class="flex flex-col gap-[4px]">
    <label
      :for="id"
      class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px] leading-[24px]"
    >
      {{ label }}
    </label>
    <div
      :class="[
        'bg-white h-[56px] border rounded-[12px] flex items-center gap-[10px] px-[20px] relative transition-colors',
        error ? 'border-[#c0392b]' : 'border-[#5f5f5f]'
      ]"
    >
      <input
        :id="id"
        :type="show ? 'text' : 'password'"
        autocomplete="new-password"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :aria-describedby="error ? `${id}-error` : undefined"
        :aria-invalid="!!error"
        class="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#1a1a1a] placeholder-[#595959] bg-transparent outline-none focus-visible:outline-none min-w-0"
      />
      <button
        type="button"
        @click="show = !show"
        :aria-pressed="show"
        :aria-label="show ? 'Ocultar senha' : 'Mostrar senha'"
        class="shrink-0 size-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded-sm"
      >
        <svg
          class="size-[24px]"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            clip-rule="evenodd"
            :d="show ? eyeOffPath : eyePath"
            fill="#595959"
            fill-rule="evenodd"
          />
        </svg>
      </button>
      <div
        aria-hidden="true"
        class="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px]"
      />
    </div>
    <p
      v-if="error"
      :id="`${id}-error`"
      role="alert"
      class="text-[#c0392b] text-[13px] font-['Figtree:Regular',sans-serif]"
    >
      {{ error }}
    </p>
  </div>
</template>