<script setup lang="ts">
defineProps<{
  label: string;
  placeholder: string;
  id: string;
  modelValue: string;
  hasError?: boolean;
  errorMessage?: string;
}>();

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex flex-col w-full gap-[2px]">
    <label
      :for="id"
      class="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] text-[#333] text-[20px]"
    >
      {{ label }}
    </label>
    <div
      :class="[
        'bg-white h-[60px] w-full rounded-[12px] relative',
        hasError ? 'border-2 border-[#c0392b]' : 'border border-[#5f5f5f]'
      ]"
    >
      <div class="flex items-center px-[20px] py-[12px] h-full">
        <input
          :id="id"
          type="text"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          class="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#333] placeholder-[#595959] bg-transparent outline-none focus-visible:outline-none"
        />
      </div>
      <div
        aria-hidden="true"
        :class="[
          'absolute inset-0 pointer-events-none rounded-[12px]',
          !hasError && 'focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px]'
        ]"
      />
    </div>
    <p v-if="hasError && errorMessage" class="font-['Figtree:Regular',sans-serif] font-normal text-[14px] mt-[4px] text-[#c0392b]">
      {{ errorMessage }}
    </p>
  </div>
</template>