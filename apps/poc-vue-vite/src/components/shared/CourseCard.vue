<script setup lang="ts">
import ImageWithFallback from "./ImageWithFallback.vue";
import fallbackBannerImage from "@/assets/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";
import { computed } from "vue";

const FALLBACK_BANNER = fallbackBannerImage;

const props = defineProps<{
  id: string | number;
  title: string;
  hours?: string;
  description?: string;
  imagePath?: string | null;
  badge?: {
    label: string;
    bg: string;
    text: string;
  };
}>();

const isFallback = computed(() => !props.imagePath?.trim());

const courseImage = () => {
  // Se imagePath é fornecido e válido, usar ele
  if (props.imagePath?.trim()) {
    if (/^https?:\/\//i.test(props.imagePath)) {
      return props.imagePath;
    }

    const apiBaseUrl = (
      import.meta.env.VITE_API_URL || "http://localhost:8080"
    ).replace(/\/$/, "");
    const normalizedPath = props.imagePath.startsWith("/")
      ? props.imagePath
      : `/${props.imagePath}`;

    return `${apiBaseUrl}${normalizedPath}`;
  }

  // Fallback para imagem padrão quando não há imagePath do backend
  return FALLBACK_BANNER;
};

defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button
    type="button"
    @click="$emit('click')"
    class="flex flex-col gap-[10px] items-start cursor-pointer group text-left w-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] rounded-[4px]"
  >
    <div
      class="w-full aspect-[16/10] overflow-hidden rounded-[8px] relative"
      :class="
        isFallback
          ? 'bg-[#021b59] flex items-center justify-center'
          : 'bg-[#e0e0e0]'
      "
    >
      <template v-if="isFallback">
        <ImageWithFallback
          :alt="title"
          :src="courseImage()"
          class="h-[80px] w-auto group-hover:scale-105 transition-transform duration-200"
        />
      </template>
      <template v-else>
        <ImageWithFallback
          :alt="title"
          :src="courseImage()"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </template>
      <span
        v-if="badge"
        class="absolute top-[8px] right-[8px] text-[11px] font-['Figtree:Medium',sans-serif] font-medium px-[8px] py-[2px] rounded-full"
        :style="{ backgroundColor: badge.bg, color: badge.text }"
      >
        {{ badge.label }}
      </span>
    </div>
    <div class="flex flex-col gap-[2px]">
      <p
        class="font-['Figtree:Medium',sans-serif] font-medium leading-[26px] text-[18px] text-black"
      >
        {{ title }}
      </p>
      <p
        v-if="hours"
        class="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] text-[14px] text-[#595959]"
      >
        {{ hours }}
      </p>
      <p
        v-if="description"
        class="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] text-[14px] text-[#595959] mt-[2px]"
      >
        {{ description }}
      </p>
    </div>
  </button>
</template>
