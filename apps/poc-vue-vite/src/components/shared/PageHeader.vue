<script setup lang="ts">
import { useRouter } from 'vue-router';

// Tipagem baseada no original React
export type Crumb = { label: string; path?: string };

interface PageHeaderProps {
  title: string;
  backPath: string;
  crumbs: Crumb[];
}

// Definindo Props
const props = defineProps<PageHeaderProps>();

const router = useRouter();

const BACK_ARROW = "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z";

// Função para navegação (substituindo o navigate do React)
const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="flex flex-col gap-[6px]">
    <div class="flex items-center gap-[8px]">
      <button
        type="button"
        aria-label="Voltar"
        @click="navigateTo(props.backPath)"
        class="shrink-0 flex items-center justify-center size-[44px] rounded-full hover:bg-[#021b59]/10 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
      >
        <svg class="size-[22px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="BACK_ARROW" fill="#021B59" />
        </svg>
      </button>
      <h1
        class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] leading-[32px]"
        style="font-size: 22px"
      >
        {{ title }}
      </h1>
    </div>

    <nav aria-label="Navegação estrutural" class="pl-[42px]">
      <ol class="flex items-center flex-wrap gap-x-[4px] gap-y-[2px] list-none m-0 p-0">
        <template v-for="(crumb, i) in crumbs" :key="crumb.label + i">
          <li class="flex items-center gap-[4px]">
            <span 
              v-if="i > 0" 
              class="text-[#8e8e8e] text-[13px] select-none" 
              aria-hidden="true"
            >
              ›
            </span>

            <button
              v-if="crumb.path"
              type="button"
              @click="navigateTo(crumb.path)"
              class="font-['Figtree:Regular',sans-serif] font-normal text-[#042e99] text-[13px] hover:underline underline-offset-2 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded-sm min-h-[44px] inline-flex items-center"
            >
              {{ crumb.label }}
            </button>

            <span
              v-else
              class="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[13px]"
              :aria-current="i === crumbs.length - 1 ? 'page' : undefined"
            >
              {{ crumb.label }}
            </span>
          </li>
        </template>
      </ol>
    </nav>
  </div>
</template>