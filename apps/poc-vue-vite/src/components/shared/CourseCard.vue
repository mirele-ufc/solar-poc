<script setup lang="ts">
import ImageWithFallback from "./ImageWithFallback.vue";

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1762330910399-95caa55acf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

const props = defineProps<{
  id: string | number;
  title: string;
  hours?: string;
  imagePath?: string | null;
  isActive?: boolean;
}>();

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
      class="w-full aspect-[16/10] overflow-hidden rounded-[8px] bg-[#e0e0e0] relative"
    >
      <ImageWithFallback
        :alt="title"
        :src="courseImage()"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <span
        v-if="isActive"
        class="absolute top-[8px] right-[8px] bg-[#e6f9ee] text-[#155724] text-[11px] font-['Figtree:Medium',sans-serif] font-medium px-[8px] py-[2px] rounded-full"
      >
        Ativo
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
    </div>
  </button>
</template>
