<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/useAuthStore';
import ReadonlyField from '@/components/ui/ReadonlyField.vue';
import PasswordField from '@/components/ui/PasswordField.vue';

// ── helpers ──────────────────────────────────────────────────────────────────
function maskCPF(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 3)}.${d.slice(3, 6)}.***-**`;
  return raw;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

// ── icon paths ────────────────────────────────────────────────────────────────
const cameraPath = "M20 5H17L15 3H9L7 5H4C2.897 5 2 5.897 2 7V19C2 20.103 2.897 21 4 21H20C21.103 21 22 20.103 22 19V7C22 5.897 21.103 5 20 5ZM20 19H4V7H8.414L10.414 5H13.586L15.586 7H20V19ZM12 9C9.791 9 8 10.791 8 13C8 15.209 9.791 17 12 17C14.209 17 16 15.209 16 13C16 10.791 14.209 9 12 9ZM12 15C10.897 15 10 14.103 10 13C10 11.897 10.897 11 12 11C13.103 11 14 11.897 14 13C14 14.103 13.103 15 12 15Z";
const checkPath = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z";
const arrowBackPath = "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z";

const router = useRouter();
const authStore = useAuthStore();
const fileInputRef = ref<HTMLInputElement | null>(null);

// password form state
const currentPw = ref("");
const newPw = ref("");
const confirmPw = ref("");
const pwErrors = ref<Record<string, string>>({});
const pwSuccess = ref(false);

// photo upload handler
const handlePhotoChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return;
  
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      authStore.updateCurrentUser({ photoUrl: reader.result });
    }
  };
  reader.readAsDataURL(file);
};

// password change handler
const handlePasswordSave = () => {
  const errors: Record<string, string> = {};
  if (!currentPw.value) errors.current = "Informe a senha atual.";
  else if (currentPw.value !== authStore.currentUser.password)
    errors.current = "Senha atual incorreta.";
    
  if (!newPw.value) errors.new = "Informe a nova senha.";
  else if (newPw.value.length < 6)
    errors.new = "A nova senha deve ter ao menos 6 caracteres.";
    
  if (!confirmPw.value) errors.confirm = "Confirme a nova senha.";
  else if (newPw.value && confirmPw.value !== newPw.value)
    errors.confirm = "As senhas não coincidem.";

  pwErrors.value = errors;
  if (Object.keys(errors).length > 0) return;

  authStore.updateCurrentUser({ password: newPw.value });
  currentPw.value = "";
  newPw.value = "";
  confirmPw.value = "";
  pwErrors.value = {};
  pwSuccess.value = true;
  setTimeout(() => pwSuccess.value = false, 4000);
};
</script>

<template>
  <div class="bg-white flex flex-col min-h-[calc(100vh-70px)]">
    <div class="bg-gradient-to-b from-[#021b59] to-[#042e99] w-full">
      <div class="max-w-[900px] mx-auto flex flex-col items-center gap-[16px] pt-[32px] pb-[48px] px-[20px]">
        <div class="w-full flex flex-col gap-[6px]">
          <button
            type="button"
            @click="router.back()"
            aria-label="Voltar"
            class="flex items-center gap-[8px] text-[#ffeac4] hover:text-white transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm w-fit"
          >
            <svg class="size-[20px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="arrowBackPath" fill="currentColor" />
            </svg>
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[16px]">
              Voltar
            </span>
          </button>
          <nav aria-label="Navegação estrutural" class="pl-[28px]">
            <ol class="flex items-center gap-[4px] list-none m-0 p-0">
              <li class="flex items-center gap-[4px]">
                <button
                  type="button"
                  @click="router.push('/courses')"
                  class="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4]/70 text-[13px] hover:text-[#ffeac4] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
                >
                  Cursos
                </button>
              </li>
              <li class="flex items-center gap-[4px]">
                <span class="text-[#ffeac4]/40 text-[13px]" aria-hidden="true">›</span>
                <span class="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4]/50 text-[13px]">
                  Perfil
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <div class="flex flex-col items-center gap-[12px]">
          <div class="relative group">
            <div class="size-[110px] rounded-full overflow-hidden bg-[#042e99] border-4 border-[#ffeac4] flex items-center justify-center">
              <img
                v-if="authStore.currentUser.photoUrl && authStore.currentUser.photoUrl.length > 0"
                :src="authStore.currentUser.photoUrl"
                alt="Foto de perfil"
                class="size-full object-cover"
              />
              <span
                v-else
                :aria-label="`Iniciais de ${authStore.currentUser.name}`"
                class="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[36px] select-none"
              >
                {{ initials(authStore.currentUser.name) }}
              </span>
            </div>

            <button
              type="button"
              @click="fileInputRef?.click()"
              aria-label="Alterar foto de perfil"
              class="absolute bottom-0 right-0 size-[34px] rounded-full bg-[#ffeac4] border-2 border-[#021b59] flex items-center justify-center shadow-md hover:bg-white transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px]"
            >
              <svg class="size-[18px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path :d="cameraPath" fill="#021B59" />
              </svg>
            </button>
          </div>

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            aria-hidden="true"
            tabindex="-1"
            class="hidden"
            @change="handlePhotoChange"
          />

          <div class="text-center">
            <p class="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[22px]">
              {{ authStore.currentUser.name }}
            </p>
            <p class="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4]/80 text-[14px] mt-[2px]">
              Estudante
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[900px] mx-auto w-full px-[20px] md:px-[40px] py-[32px] flex flex-col gap-[40px]">
      <section aria-labelledby="dados-pessoais-heading">
        <div class="flex items-center gap-[12px] mb-[20px] pb-[12px] border-b-2 border-[#021b59]">
          <h2 id="dados-pessoais-heading" class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px]">
            Dados pessoais
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <ReadonlyField label="CPF" :value="maskCPF(authStore.currentUser.cpf)" />
          <ReadonlyField label="E-mail" :value="authStore.currentUser.email" />
        </div>
        <p class="mt-[10px] font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[13px] leading-[20px]">
          CPF e e-mail são dados de identificação e não podem ser alterados diretamente. 
          Em caso de divergências, entre em contato com o suporte.
        </p>
      </section>

      <section aria-labelledby="foto-heading">
        <div class="flex items-center gap-[12px] mb-[20px] pb-[12px] border-b-2 border-[#021b59]">
          <h2 id="foto-heading" class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px]">
            Foto de perfil
          </h2>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-[20px]">
          <div class="size-[80px] rounded-full overflow-hidden bg-[#042e99] border-2 border-[#021b59] shrink-0 flex items-center justify-center">
            <img
              v-if="authStore.currentUser.photoUrl"
              :src="authStore.currentUser.photoUrl"
              alt="Prévia da foto de perfil"
              class="size-full object-cover"
            />
            <span
              v-else
              aria-hidden="true"
              class="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[28px] select-none"
            >
              {{ initials(authStore.currentUser.name) }}
            </span>
          </div>
          <div class="flex flex-col gap-[10px] flex-1">
            <p class="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[14px] leading-[22px]">
              Use uma imagem quadrada (JPG, PNG ou GIF) com ao menos 200×200 px para melhor qualidade.
            </p>
            <div class="flex gap-[12px] flex-wrap">
              <button
                type="button"
                @click="fileInputRef?.click()"
                class="bg-[#ffeac4] h-[44px] px-[24px] rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[15px]"
              >
                {{ authStore.currentUser.photoUrl ? "Trocar foto" : "Adicionar foto" }}
              </button>
              <button
                v-if="authStore.currentUser.photoUrl"
                type="button"
                @click="authStore.updateCurrentUser({ photoUrl: null })"
                class="h-[44px] px-[24px] rounded-[26px] border-2 border-[#c0392b] cursor-pointer hover:bg-[#fdecea] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#c0392b] font-['Figtree:Medium',sans-serif] font-medium text-[#c0392b] text-[15px]"
              >
                Remover foto
              </button>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="senha-heading">
        <div class="flex items-center gap-[12px] mb-[20px] pb-[12px] border-b-2 border-[#021b59]">
          <h2 id="senha-heading" class="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px]">
            Alterar senha
          </h2>
        </div>

        <form class="flex flex-col gap-[16px]" novalidate @submit.prevent="handlePasswordSave">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <PasswordField
              id="current-pw"
              label="Senha atual"
              v-model="currentPw"
              :error="pwErrors.current"
            />
            <div /> <PasswordField
              id="new-pw"
              label="Nova senha"
              v-model="newPw"
              :error="pwErrors.new"
            />
            <PasswordField
              id="confirm-pw"
              label="Confirmar nova senha"
              v-model="confirmPw"
              :error="pwErrors.confirm"
            />
          </div>

          <div
            v-if="pwSuccess"
            role="status"
            aria-live="polite"
            class="flex items-center gap-[10px] bg-[#d4edda] border border-[#c3e6cb] px-[16px] py-[12px] rounded-sm"
          >
            <svg class="size-[20px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="checkPath" fill="#155724" />
            </svg>
            <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#155724] text-[15px]">
              Senha alterada com sucesso!
            </p>
          </div>

          <div class="flex justify-start mt-[4px]">
            <button
              type="submit"
              class="bg-[#ffeac4] h-[50px] px-[40px] rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
            >
              <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">
                Salvar senha
              </span>
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>