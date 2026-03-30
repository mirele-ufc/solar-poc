<script setup lang="ts">
import { useRouter } from "vue-router";
import PageHeader from "@/components/shared/PageHeader.vue";
import { useEnrollmentGuard } from "@/hooks/useEnrollmentGuard";

// Proteção de rota para garantir que apenas alunos matriculados acessem
useEnrollmentGuard("python");
const router = useRouter();

// Conteúdo completo da aula extraído do componente React
const AULA = {
  title: "Aula 01",
  subtitle: "O que é Python?",
  body: [
    "Python é uma linguagem de programação de alto nível, interpretada e de propósito geral, criada por Guido van Rossum e lançada em 1991. Seu design prioriza a legibilidade do código, permitindo que desenvolvedores expressem conceitos complexos em menos linhas do que outras linguagens, como C++ ou Java.",
    "Uma das grandes vantagens do Python é sua versatilidade: pode ser usado para desenvolvimento web, ciência de dados, inteligência artificial, automação de tarefas, scripts de sistema, desenvolvimento de jogos e muito mais. Grandes empresas como Google, Instagram, Netflix e a NASA utilizam Python em seus projetos.",
    "Python é uma linguagem orientada a objetos, mas também suporta programação procedural e funcional. Seu sistema de tipos é dinâmico e forte — variáveis não precisam ser declaradas com um tipo específico, mas o tipo é verificado em tempo de execução, evitando operações incompatíveis.",
    "Ao final desta aula, você estará pronto para compreender o papel do Python no ecossistema de tecnologia e dar os primeiros passos na escrita de código. Na próxima atividade, você realizará a Prova do Módulo para consolidar o que aprendeu.",
  ],
};

const ARROW_BACK = "M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z";
</script>

<template>
  <div class="bg-white min-h-screen pb-[60px]">
    <div class="max-w-[900px] mx-auto flex flex-col gap-[24px] px-[20px] md:px-[40px] pt-[24px] w-full">
      
      <PageHeader
        :title="AULA.subtitle"
        backPath="/courses/python/modules"
        :crumbs="[
          { label: 'Cursos', path: '/courses' },
          { label: 'Python Iniciante', path: '/courses/python' },
          { label: 'Módulos', path: '/courses/python/modules' },
          { label: 'Módulo 01' },
        ]"
      />

      <div class="flex flex-col gap-[4px]">
        <p class="font-['Figtree:Regular',sans-serif] text-[#606060] text-[14px]">
          Módulo 01 — Introdução ao Python
        </p>
        <h2 class="font-['Figtree:Bold',sans-serif] font-bold text-[28px] leading-[38px] text-[#021b59]">
          {{ AULA.title }} — {{ AULA.subtitle }}
        </h2>
      </div>

      <div class="w-full h-px bg-[#e0e0e0]" aria-hidden="true" />

      <div class="flex flex-col gap-[20px]">
        <p
          v-for="(paragraph, idx) in AULA.body"
          :key="idx"
          class="font-['Figtree:Regular',sans-serif] font-normal text-[16px] leading-[28px] text-[#333]"
        >
          {{ paragraph }}
        </p>
      </div>

      <div class="bg-[#021b59] rounded-[12px] px-[20px] py-[18px] flex flex-col gap-[8px]">
        <p class="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4] text-[13px] uppercase tracking-wide">
          Exemplo — Python
        </p>
        <pre class="font-mono text-[14px] leading-[24px] text-white overflow-x-auto">
# Seu primeiro programa em Python
nome = "Estudante"
print("Olá,", nome)

# Definindo uma função
def saudacao(nome):
    return f"Bem-vindo ao curso, {nome}!"

print(saudacao(nome))</pre>
      </div>

      <div class="flex flex-col sm:flex-row gap-[12px] mt-[12px]">
        <button
          type="button"
          @click="router.push('/courses/python/modules')"
          class="flex items-center justify-center gap-[8px] h-[48px] px-[20px] border-2 border-[#021b59] rounded-[26px] hover:bg-[#021b59]/5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
          aria-label="Voltar para lista de módulos"
        >
          <svg class="size-[20px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="ARROW_BACK" fill="#021b59" />
          </svg>
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
            Voltar aos módulos
          </span>
        </button>

        <button
          type="button"
          @click="router.push('/courses/python/exam/instructions')"
          class="flex-1 h-[48px] bg-[#ffeac4] rounded-[26px] hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px]"
          aria-label="Ir para a prova do módulo"
        >
          <span class="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px]">
            Ir para a prova →
          </span>
        </button>
      </div>
    </div>
  </div>
</template>