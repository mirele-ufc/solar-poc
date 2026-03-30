<script setup lang="ts">
import { computed } from 'vue';

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  modelValue: string;
  options: Option[];
  hasError?: boolean;
  errorMessage?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const id = computed(() => props.label.toLowerCase().replace(/\s+/g, '-'));
const errorId = computed(() => `${id.value}-error`);

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="flex flex-col items-start w-full gap-[2px]">
    <label
      :for="id"
      class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#333] text-[20px]"
    >
      {{ label }}
    </label>
    <div
      :class="[
        'bg-white h-[60px] w-full rounded-[12px] relative transition-all',
        hasError ? 'border-2 border-[#c0392b]' : 'border border-[#5f5f5f]'
      ]"
    >
      <div class="flex items-center gap-[10px] px-[20px] py-[12px] h-full">
        <select
          :id="id"
          :value="modelValue"
          @change="onChange"
          :aria-invalid="hasError ? 'true' : undefined"
          :aria-describedby="hasError && errorMessage ? errorId : undefined"
          class="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] bg-transparent outline-none min-w-0 focus-visible:outline-none appearance-none cursor-pointer"
          :style="{ color: modelValue === '' ? '#595959' : '#1a1a1a' }"
        >
          <option value="">Selecione uma opção</option>
          <option v-for="opt in options" :key="opt.value" :value="opt.value" style="color: #1a1a1a">
            {{ opt.label }}
          </option>
        </select>
        <svg class="shrink-0 size-[16px] pointer-events-none" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6L8 10L12 6" stroke="#021B59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        :class="[
          'absolute inset-0 pointer-events-none rounded-[12px]',
          hasError ? '' : 'focus-within:outline focus-within:outline-[3px] focus-within:outline-[#333] focus-within:outline-offset-[-1px]'
        ]"
      />
    </div>
    <p v-if="hasError && errorMessage" :id="errorId" role="alert" class="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#ff6f6f]">
      {{ errorMessage }}
    </p>
  </div>
</template>