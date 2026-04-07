<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Componentes UI
import InputField from '../components/ui/InputField.vue';
import SelectField from '../components/ui/SelectField.vue';

// Assets
import imgUfcLogo1 from "../assets/9098abf5bf97a1aac4c76f171ec108cee92cfddb.png";
import imgAtivo224X1 from "../assets/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";

/**
 * CONFIGURAÇÕES E ESTADOS
 */
const router = useRouter();

const genderOptions = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "outro", label: "Outro" },
  { value: "prefiro-nao-informar", label: "Prefiro não informar" },
];

const footerItems = ["Portais", "Desenvolvimento", "Política de privacidade", "Ajuda", "Idioma"];

// Estado do Formulário
const agreed = ref(false);
const cpf = ref("");
const email = ref("");
const senha = ref("");
const confirmaSenha = ref("");
const genero = ref("");
const showErrors = ref(false);
const generalError = ref("");

/**
 * LÓGICA DE SUBMISSÃO
 */
const handleSubmit = () => {
  // Validação simples baseada na lógica original
  const hasFieldsEmpty = 
    !cpf.value.trim() || 
    !email.value.trim() || 
    !senha.value.trim() || 
    !confirmaSenha.value.trim() || 
    !genero.value;

  if (hasFieldsEmpty) {
    generalError.value = "Por favor, preencha os campos destacados para finalizar o cadastro";
    showErrors.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // Se válido, navega para a rota de cursos
  router.push("/courses");
};

const goToLogin = () => {
  router.push("/");
};
</script>

<template>
  <main class="bg-gradient-to-b from-[#021b59] to-[#042e99] flex flex-col items-center p-[20px] min-h-screen">
    <div class="w-full max-w-[480px] mx-auto flex flex-col gap-[20px] items-center">

      <div class="inline-grid leading-[0] place-items-start relative shrink-0 mt-[10px]">
        <div class="col-1 h-[76px] ml-[72px] mt-0 relative row-1 w-[135px]">
          <img alt="UFC – Universidade Federal do Ceará" class="absolute inset-0 max-w-none object-cover size-full" :src="imgUfcLogo1" />
        </div>
        <div class="col-1 h-[35px] ml-0 mt-[17px] relative row-1 w-[63px]">
          <img alt="Instituto Universidade Virtual" class="absolute inset-0 max-w-none object-cover size-full" :src="imgAtivo224X1" />
        </div>
      </div>

       <div class="flex flex-col font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold h-[90px] justify-center leading-[0] text-[#ffeac4] text-center w-full">
        <h1 class="flex-1 text-[#ffeac4] leading-[normal] font-medium font-[Anek_Devanagari]" style="font-size: clamp(64px, 20vw, 96px)">
          SOLAR
        </h1>
      </div>

      <div
        v-if="showErrors && generalError"
        class="bg-[#c0392b] border border-[#c0392b] rounded-[12px] p-[16px] w-full mb-[12px]"
        role="alert"
      >
        <p class="font-['Figtree:Medium',sans-serif] font-medium text-white text-[15px]">
          {{ generalError }}
        </p>
      </div>

      <form
        class="flex flex-col gap-[12px] items-start w-full"
        @submit.prevent="handleSubmit"
        novalidate
      >
        <InputField
          label="CPF"
          placeholder="Formato: 000.000.000-00"
          v-model="cpf"
          :has-error="showErrors && !cpf.trim()"
          error-message="CPF não informado"
        />

        <InputField
          label="Email"
          placeholder="Insira seu email"
          type="email"
          v-model="email"
          :has-error="showErrors && !email.trim()"
          error-message="Email não informado"
        />

        <InputField
          label="Senha"
          placeholder="Insira sua senha"
          type="password"
          v-model="senha"
          :has-error="showErrors && !senha.trim()"
          error-message="Senha não informada"
        />

        <InputField
          label="Confirme sua senha"
          placeholder="Repita sua senha"
          type="password"
          v-model="confirmaSenha"
          :has-error="showErrors && !confirmaSenha.trim()"
          error-message="Confirmação de senha não informada"
        />

        <SelectField
          label="Gênero"
          v-model="genero"
          :options="genderOptions"
          :has-error="showErrors && !genero"
          error-message="Gênero não informado"
        />

        <div class="flex items-start gap-[8px] w-full">
          <div class="relative mt-[2px] shrink-0">
            <input
              id="terms"
              type="checkbox"
              v-model="agreed"
              class="sr-only peer"
            />
            <label
              for="terms"
              class="flex items-center justify-center size-[22px] border-2 rounded-[2px] cursor-pointer transition-colors peer-focus-visible:outline peer-focus-visible:outline-[2px] peer-focus-visible:outline-[#ffeac4] peer-focus-visible:outline-offset-[2px]"
              :class="agreed ? 'bg-[#ffeac4] border-[#ffeac4]' : 'bg-transparent border-[#ffeac4]'"
              aria-hidden="true"
            >
              <svg v-if="agreed" class="size-[14px]" fill="none" viewBox="0 0 22 22">
                <path clip-rule="evenodd" d="M5 9L3 11L9 17L19 7L17 5L9 13L5 9Z" fill="#021B59" fill-rule="evenodd" />
              </svg>
            </label>
          </div>
          <label for="terms" class="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px] leading-[24px] cursor-pointer">
            Concordo com os termos de privacidade e segurança.
          </label>
        </div>

        <div class="flex flex-col gap-[20px] w-full mt-[8px]">
          <button
            type="submit"
            class="bg-[#ffeac4] h-[50px] w-full rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-[2px]"
          >
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[20px]">Cadastrar</span>
          </button>
          
          <button
            type="button"
            @click="goToLogin"
            class="h-[50px] w-full border-2 border-[#ffeac4] rounded-[26px] cursor-pointer hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px]"
          >
            <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[20px]">Já sou usuário</span>
          </button>
        </div>
      </form>

      <nav class="flex flex-col items-center mt-auto pt-[20px] pb-[10px]" aria-label="Links do rodapé">
        <button
          v-for="item in footerItems"
          :key="item"
          type="button"
          class="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] text-[#ffeac4] text-[16px] text-center w-[230px] hover:underline focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
        >
          {{ item }}
        </button>
      </nav>
    </div>
  </main>
</template>