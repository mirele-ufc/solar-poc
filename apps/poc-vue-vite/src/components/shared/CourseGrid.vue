<script setup lang="ts">
import CourseCard from "./CourseCard.vue";

interface Course {
  id: string | number;
  title: string;
  hours?: string;
  imagePath?: string | null;
  description?: string;
  isActive?: boolean;
}

defineProps<{
  courses: Course[];
  showHours?: boolean;
}>();

defineEmits<{
  (e: "click-course", id: string | number): void;
}>();
</script>

<template>
  <div class="w-full">
    <div
      class="no-scrollbar flex gap-[16px] overflow-x-auto pb-[8px] md:hidden"
    >
      <div v-for="c in courses" :key="c.id" class="shrink-0 w-[200px]">
        <CourseCard
          :id="c.id"
          :title="c.title"
          :hours="showHours ? c.hours : undefined"
          :description="c.description"
          :imagePath="c.imagePath"
          :is-active="c.isActive"
          @click="$emit('click-course', c.id)"
        />
      </div>
    </div>
    <div class="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
      <CourseCard
        v-for="c in courses"
        :key="c.id"
        :id="c.id"
        :title="c.title"
        :hours="showHours ? c.hours : undefined"
        :description="c.description"
        :imagePath="c.imagePath"
        :is-active="c.isActive"
        @click="$emit('click-course', c.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
