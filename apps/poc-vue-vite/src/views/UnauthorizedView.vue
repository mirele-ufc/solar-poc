<template>
  <main
    class="bg-gradient-to-b from-[#021b59] to-[#042e99] min-h-screen flex items-center justify-center p-[20px]"
  >
    <section
      class="w-full max-w-[640px] rounded-[16px] bg-white shadow-[0_16px_40px_rgba(2,27,89,0.2)] p-[28px] md:p-[40px] flex flex-col gap-[20px] text-center"
    >
      <h1
        class="font-['Figtree:Bold',sans-serif] text-[#021b59] text-[28px] leading-[36px]"
      >
        Acesso negado
      </h1>

      <p
        class="font-['Figtree:Medium',sans-serif] text-[#333333] text-[18px] leading-[30px]"
      >
        Você não tem permissão para acessar este recurso
      </p>

      <p
        class="font-['Figtree:Regular',sans-serif] text-[#595959] text-[15px] leading-[24px]"
      >
        Você será redirecionado automaticamente para seus cursos em 5 segundos.
      </p>

      <button
        type="button"
        @click="handleRedirect"
        class="mx-auto h-[48px] px-[28px] rounded-[24px] bg-[#021b59] text-[#ffeac4] font-['Figtree:Medium',sans-serif] text-[18px] hover:bg-[#042e99] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
      >
        Ir para dashboard
      </button>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, onUnmounted } from "vue";

const router = useRouter();
const REDIRECT_DELAY_MS = 5000;

let timeoutId: ReturnType<typeof setTimeout> | null = null;

const handleRedirect = () => {
  router.push("/courses");
};

onMounted(() => {
  timeoutId = setTimeout(() => {
    handleRedirect();
  }, REDIRECT_DELAY_MS);
});

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>
