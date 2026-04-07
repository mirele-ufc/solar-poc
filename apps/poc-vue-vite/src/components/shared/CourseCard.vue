<script setup lang="ts">
import ImageWithFallback from './ImageWithFallback.vue';

const COURSE_IMAGES_POOL: string[] = [
  "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  "https://images.unsplash.com/photo-1747654804155-ffd62d5dfb51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  "https://images.unsplash.com/photo-1762330910399-95caa55acf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  "https://images.unsplash.com/photo-1663000806489-08f132cf3032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  "https://images.unsplash.com/photo-1602576666092-bf6447a729fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
];

const props = defineProps<{
  id: string | number;
  title: string;
  hours?: string;
  imagePath?: string;
  isActive?: boolean;
}>();

const courseImage = () => {
  const idNum = typeof props.id === 'string' ? parseInt(props.id, 10) : props.id;
  const index = (idNum % COURSE_IMAGES_POOL.length);
  return COURSE_IMAGES_POOL[index];
};

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    type="button"
    @click="$emit('click')"
    class="flex flex-col gap-[10px] items-start cursor-pointer group text-left w-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] rounded-[4px]"
  >
    <div class="w-full aspect-[16/10] overflow-hidden rounded-[8px] bg-[#e0e0e0] relative">
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
      <p class="font-['Figtree:Medium',sans-serif] font-medium leading-[26px] text-[18px] text-black">
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