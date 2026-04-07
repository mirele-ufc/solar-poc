<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/useAuthStore';
import { Toaster } from 'vue-sonner';
import svgPaths from "../../assets/svg-3imqnb48ew";      

const hamburgerPath = "M0 12V10H18V12H0ZM0 7V5H18V7H0ZM0 2V0H18V2H0Z";
const searchPath = "M14.3251 12.8985L19.7048 18.2783C19.8939 18.4676 20.0001 18.7242 20 18.9917C19.9999 19.2592 19.8935 19.5157 19.7043 19.7048C19.5151 19.8939 19.2585 20.0001 18.991 20C18.7235 19.9999 18.467 19.8935 18.2779 19.7043L12.8981 14.3244C11.2899 15.5701 9.26759 16.1563 7.24253 15.9638C5.21748 15.7712 3.34182 14.8145 1.99713 13.2881C0.652446 11.7617 -0.0602623 9.78035 0.00399614 7.74712C0.0682545 5.7139 0.904653 3.78152 2.34304 2.3431C3.78143 0.904675 5.71376 0.0682562 7.74693 0.00399624C9.7801 -0.0602638 11.7614 0.652463 13.2877 1.99718C14.8141 3.3419 15.7708 5.21761 15.9634 7.24271C16.1559 9.26782 15.5697 11.2902 14.3241 12.8985M8.00037 13.9994C9.5916 13.9994 11.1176 13.3673 12.2428 12.2421C13.368 11.1169 14.0001 9.59084 14.0001 7.99957C14.0001 6.40831 13.368 4.88222 12.2428 3.75702C11.1176 2.63183 9.5916 1.9997 8.00037 1.9997C6.40915 1.9997 4.88309 2.63183 3.75793 3.75702C2.63276 4.88222 2.00065 6.40831 2.00065 7.99957C2.00065 9.59084 2.63276 11.1169 3.75793 12.2421C4.88309 13.3673 6.40915 13.9994 8.00037 13.9994Z";
const micPath = "M7 12C6.16667 12 5.45833 11.7083 4.875 11.125C4.29167 10.5417 4 9.83333 4 9V3C4 2.16667 4.29167 1.45833 4.875 0.875C5.45833 0.291667 6.16667 0 7 0C7.83333 0 8.54167 0.291667 9.125 0.875C9.70833 1.45833 10 2.16667 10 3V9C10 9.83333 9.70833 10.5417 9.125 11.125C8.54167 11.7083 7.83333 12 7 12ZM6 19V15.925C4.26667 15.6917 2.83333 14.9167 1.7 13.6C0.566667 12.2833 0 10.75 0 9H2C2 10.3833 2.4875 11.5625 3.4625 12.5375C4.4375 13.5125 5.61667 14 7 14C8.38333 14 9.5625 13.5125 10.5375 12.5375C11.5125 11.5625 12 10.3833 12 9H14C14 10.75 13.4333 12.2833 12.3 13.6C11.1667 14.9167 9.73333 15.6917 8 15.925V19H6Z";

const menuItems = [
  { label: "Cursos", path: "/courses", iconPath: svgPaths.p240fd300 },
  { label: "Portais", path: null, iconPath: svgPaths.p12986e80 },
  { label: "Desenvolvimento", path: null, iconPath: svgPaths.p3d982070 },
  { label: "Política de privacidade", path: null, iconPath: svgPaths.p230ab480 },
  { label: "Ajuda", path: null, iconPath: svgPaths.p34f77440 },
  { label: "Idioma", path: null, iconPath: svgPaths.p20701600 },
];

/** ── STATE & LOGIC ── */
const router = useRouter();
const authStore = useAuthStore();
const menuOpen = ref(false);
const profileOpen = ref(false);

const hamburgerRef = ref<HTMLButtonElement | null>(null);
const profileBtnRef = ref<HTMLButtonElement | null>(null);
const drawerCloseRef = ref<HTMLButtonElement | null>(null);

const initials = computed(() => {
  const parts = authStore.currentUser.name.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
});

const handleLogout = () => {
  profileOpen.value = false;
  authStore.logout();
  router.push("/");
};

const navigateTo = (path: string | null) => {
  menuOpen.value = false;
  profileOpen.value = false;
  if (path) router.push(path);
};

/** ── KEYBOARD ACCESSIBILITY ── */
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    if (menuOpen.value) {
      menuOpen.value = false;
      hamburgerRef.value?.focus();
    } else if (profileOpen.value) {
      profileOpen.value = false;
      profileBtnRef.value?.focus();
    }
  }
};

onMounted(() => document.addEventListener("keydown", handleKeyDown));
onUnmounted(() => document.removeEventListener("keydown", handleKeyDown));

// Monitora abertura do drawer para dar foco ao botão fechar
watch(menuOpen, (val) => {
  if (val) {
    setTimeout(() => drawerCloseRef.value?.focus(), 50);
  }
});
</script>

<template>
  <div class="bg-white flex flex-col w-full min-h-screen">
    <header class="bg-[#021b59] h-[56px] sticky top-0 z-10 w-full relative shrink-0">
      <div class="max-w-[1280px] mx-auto flex items-center justify-between px-[16px] h-full">
        
        <button
          ref="hamburgerRef"
          type="button"
          aria-label="Abrir menu"
          :aria-expanded="menuOpen"
          aria-controls="main-nav-drawer"
          @click="menuOpen = true; profileOpen = false"
          :class="[
            'flex items-center justify-center size-[44px] rounded-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] transition-colors',
            menuOpen ? 'bg-[#042e99]' : ''
          ]"
        >
          <svg class="size-[16px]" fill="none" viewBox="0 0 18 12" aria-hidden="true">
            <path :d="hamburgerPath" fill="#FFEAC4" />
          </svg>
        </button>

        <div class="bg-white flex gap-[8px] h-[36px] items-center px-[14px] py-[4px] w-[220px] sm:w-[300px] md:w-[380px] lg:w-[480px] rounded-sm">
          <svg class="size-[18px] shrink-0" fill="none" viewBox="0 0 20 20" aria-hidden="true">
            <g clip-path="url(#clip-search-nav)">
              <path clip-rule="evenodd" :d="searchPath" fill="#042E99" fill-rule="evenodd" />
            </g>
            <defs>
              <clipPath id="clip-search-nav">
                <rect fill="white" height="20" width="20" />
              </clipPath>
            </defs>
          </svg>
          <input
            type="search"
            aria-label="Buscar cursos"
            placeholder="Buscar cursos"
            class="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[15px] text-[#333] bg-transparent outline-none min-w-0 placeholder-[#595959]"
          />
          <button
            type="button"
            aria-label="Pesquisar por voz"
            class="relative shrink-0 size-[20px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#042e99] rounded-sm"
          >
            <svg class="block size-full" fill="none" viewBox="0 0 14 19" aria-hidden="true">
              <path :d="micPath" fill="#042E99" />
            </svg>
          </button>
        </div>

        <div class="relative">
          <button
            ref="profileBtnRef"
            type="button"
            aria-label="Menu do perfil"
            :aria-expanded="profileOpen"
            aria-controls="profile-dropdown"
            @click="profileOpen = !profileOpen; menuOpen = false"
            class="flex items-center justify-center size-[44px] rounded-full border-2 border-[#ffeac4] overflow-hidden focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] transition-colors bg-[#042e99]"
          >
            <img v-if="authStore.currentUser.photoUrl" :src="authStore.currentUser.photoUrl" alt="Foto de perfil" class="size-full object-cover" />
            <span v-else aria-hidden="true" class="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[16px] select-none">
              {{ initials }}
            </span>
          </button>

          <div v-if="profileOpen">
            <div class="fixed inset-0 z-30" @click="profileOpen = false" aria-hidden="true" />
            <div
              id="profile-dropdown"
              role="menu"
              aria-label="Menu do perfil"
              class="absolute right-0 top-[46px] z-40 bg-[#021b59] min-w-[220px] py-[10px] shadow-xl"
            >
              <div class="px-[20px] py-[8px] pb-[14px] flex items-center gap-[12px] border-b border-[#ffeac4]/20 mb-[6px]">
                <div class="size-[38px] rounded-full overflow-hidden bg-[#042e99] border border-[#ffeac4] shrink-0 flex items-center justify-center">
                  <img v-if="authStore.currentUser.photoUrl" :src="authStore.currentUser.photoUrl" alt="" class="size-full object-cover" />
                  <span v-else class="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[14px]">{{ initials }}</span>
                </div>
                <div>
                  <p class="font-['Figtree:Medium',sans-serif] font-medium leading-[22px] text-[#ffeac4] text-[16px]">{{ authStore.currentUser.name }}</p>
                  <p class="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4]/70 text-[12px]">{{ authStore.currentUser.email }}</p>
                </div>
              </div>

              <button role="menuitem" type="button" @click="navigateTo('/profile')" class="dropdown-item">
                <svg class="shrink-0 size-[22px]" fill="none" viewBox="0 0 20 20"><path :d="svgPaths.pe3d9c80" fill="#FFEAC4" /></svg>
                <span>Perfil</span>
              </button>

              <button v-if="authStore.currentUser.role === 'professor'" role="menuitem" type="button" @click="navigateTo('/messages')" class="dropdown-item">
                <svg class="shrink-0 size-[22px]" fill="none" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="#FFEAC4" /></svg>
                <span>Mensagem</span>
              </button>

              <button role="menuitem" type="button" @click="navigateTo('/my-courses')" class="dropdown-item">
                <svg class="shrink-0 size-[22px]" fill="none" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z" fill="#FFEAC4" /></svg>
                <span>Meus cursos</span>
              </button>

              <button v-if="authStore.currentUser.role === 'student'" role="menuitem" type="button" @click="navigateTo('/messages')" class="dropdown-item">
                <svg class="shrink-0 size-[22px]" fill="none" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="#FFEAC4" /></svg>
                <span>Mensagens</span>
              </button>

              <button role="menuitem" type="button" @click="handleLogout" class="dropdown-item">
                <svg class="shrink-0 size-[22px]" fill="none" viewBox="0 0 24 23"><path clip-rule="evenodd" :d="svgPaths.pcbd3400" fill="#FFEAC4" fill-rule="evenodd" /></svg>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex-1 max-w-[1280px] mx-auto w-full overflow-x-hidden">
      <router-view />
    </div>

    <div v-if="menuOpen" class="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <nav id="main-nav-drawer" class="bg-[#021b59] w-[300px] sm:w-[340px] h-full flex flex-col pt-[20px] pb-[40px] overflow-y-auto shadow-2xl">
        <div class="flex items-center justify-between px-[20px] pb-[20px] border-b border-[#ffeac4]/20">
          <p id="drawer-title" class="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4]/70 text-[12px] uppercase tracking-widest">Menu</p>
          <button
            ref="drawerCloseRef"
            type="button"
            aria-label="Fechar menu"
            @click="menuOpen = false; hamburgerRef?.focus()"
            class="flex items-center justify-center size-[44px] text-[#ffeac4] hover:bg-[#ffeac4]/10 rounded-sm focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4]"
          >
            <span aria-hidden="true" class="text-[20px] leading-none">✕</span>
          </button>
        </div>

        <button
          v-for="item in menuItems"
          :key="item.label"
          type="button"
          class="flex items-center gap-[15px] text-left w-full px-[30px] py-[14px] font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px] hover:bg-[#ffeac4]/10 active:bg-[#ffeac4]/20 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[-2px]"
          @click="navigateTo(item.path)"
        >
          <svg class="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="item.iconPath" fill="#FFEAC4" fill-rule="evenodd" clip-rule="evenodd" />
          </svg>
          {{ item.label }}
        </button>
      </nav>
      <div class="flex-1 bg-black/50" @click="menuOpen = false; hamburgerRef?.focus()" aria-hidden="true" />
    </div>

    <Toaster position="top-center" richColors />
  </div>
</template>

<style scoped>
@reference "../../styles/index.css"; 

.dropdown-item {
  @apply w-full flex items-center gap-[15px] px-[20px] py-[11px] hover:bg-[#042e99] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[-2px] transition-colors;
}

.dropdown-item span {
  @apply font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px];
}

#main-nav-drawer {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
#main-nav-drawer::-webkit-scrollbar {
  display: none;
}
</style>