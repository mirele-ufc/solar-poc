<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEnrollmentGuard } from "@/hooks/useEnrollmentGuard";
import PageHeader from "@/components/shared/PageHeader.vue";
import imgRectangle30 from "@/assets/22ebf3a06cf8215c6bd0946f42302bc2204ed790.png";

// --- Dados e Constantes ---
const VISITED_KEY = "solar_visited_lessons";

interface AulaContent {
  id: string;
  title: string;
  subtitle: string;
  body: string[];
  type: "aula" | "prova";
}

const aulasPorModulo: Record<string, AulaContent[]> = {
  "1": [
    {
      id: "m1-aula-01",
      title: "Aula 01",
      subtitle: "Introdução ao Power BI",
      type: "aula",
      body: [
        "Nesta primeira aula, você terá uma visão geral do Power BI e entenderá como essa ferramenta pode ajudar na análise e visualização de dados. O Power BI permite transformar grandes volumes de informações em relatórios interativos e dashboards intuitivos, facilitando a tomada de decisões baseada em dados.",
        "Durante a aula, conheceremos os principais componentes da ferramenta, como o Power BI Desktop, o Power BI Service e os dashboards. Também veremos exemplos de como empresas utilizam o Power BI para acompanhar indicadores, identificar tendências e melhorar processos.",
        "Ao final desta aula, você compreenderá o papel do Power BI no contexto de Business Intelligence (BI) e estará preparado para começar a importar e explorar dados nas próximas aulas do curso.",
      ],
    },
    {
      id: "m1-aula-02",
      title: "Aula 02",
      subtitle: "Conceitos Básicos",
      type: "aula",
      body: [
        "Nesta aula exploraremos os conceitos fundamentais do Power BI: fontes de dados, tabelas, colunas e relacionamentos. Entender esses pilares é essencial para construir relatórios sólidos e confiáveis.",
        "Veremos como importar dados de diferentes origens — como planilhas Excel, arquivos CSV e bancos de dados — e como preparar essas informações para análise. A organização dos dados desde o início impacta diretamente a qualidade dos relatórios.",
        "Ao concluir esta aula, você terá familiaridade com o ambiente do Power BI Desktop e saberá como navegar entre as suas principais visões: Relatório, Dados e Modelo.",
      ],
    },
    {
      id: "m1-aula-03",
      title: "Aula 03",
      subtitle: "Prática",
      type: "aula",
      body: [
        "Chegou a hora de colocar a mão na massa! Nesta aula prática, você irá criar seu primeiro relatório no Power BI do zero, seguindo um passo a passo guiado com dados reais de exemplo.",
        "Você aprenderá a adicionar visuais ao relatório, configurar filtros e segmentações, e personalizar a aparência dos gráficos para tornar a leitura mais intuitiva. A prática é fundamental para consolidar o aprendizado teórico das aulas anteriores.",
        "Ao final, você terá um relatório funcional salvo no Power BI Desktop e estará pronto para avançar para os próximos módulos, onde exploraremos recursos mais avançados da ferramenta.",
      ],
    },
  ],
  "2": [
    {
      id: "m2-aula-01",
      title: "Aula 01",
      subtitle: "Power Query",
      type: "aula",
      body: [
        "Nesta aula você conhecerá o Power Query, o editor de transformação de dados integrado ao Power BI. Com ele é possível limpar, formatar e combinar dados antes de carregá-los no modelo de análise.",
        "Exploraremos as principais transformações disponíveis: remoção de duplicatas, divisão de colunas, preenchimento de valores nulos e mesclagem de tabelas. Dominar o Power Query elimina a necessidade de tratar dados em ferramentas externas.",
        "Ao concluir esta aula, você será capaz de criar fluxos de tratamento de dados reutilizáveis, economizando tempo sempre que a fonte de dados for atualizada.",
      ],
    },
    {
      id: "m2-aula-02",
      title: "Aula 02",
      subtitle: "Transformação de Dados",
      type: "aula",
      body: [
        "Aprofundaremos as técnicas de transformação de dados no Power Query, abordando casos mais complexos como unpivot de tabelas, criação de colunas calculadas e aplicação de funções M personalizadas.",
        "Veremos como lidar com dados inconsistentes provenientes de múltiplas fontes e como garantir que o modelo final seja limpo e bem estruturado para suportar as análises desejadas.",
        "Você também aprenderá boas práticas de documentação dos passos aplicados no Power Query, facilitando a manutenção e a compreensão do fluxo de dados por outros membros da equipe.",
      ],
    },
    {
      id: "m2-aula-03",
      title: "Aula 03",
      subtitle: "Relacionamentos",
      type: "aula",
      body: [
        "Os relacionamentos entre tabelas são o coração do modelo de dados no Power BI. Nesta aula você aprenderá a criar e gerenciar relacionamentos entre tabelas para possibilitar análises cruzadas.",
        "Abordaremos os tipos de cardinalidade (um-para-muitos, muitos-para-muitos) e a direção do filtro cruzado. Entender esses conceitos evita erros comuns de análise e garante resultados corretos nos relatórios.",
        "Ao final, você terá um modelo de dados bem estruturado, com relacionamentos claros e otimizados para consultas rápidas e análises precisas.",
      ],
    },
  ],
  "3": [
    {
      id: "m3-aula-01",
      title: "Aula 01",
      subtitle: "DAX Básico",
      type: "aula",
      body: [
        "DAX (Data Analysis Expressions) é a linguagem de fórmulas do Power BI. Nesta aula você aprenderá as funções básicas para criar medidas e colunas calculadas que enriquecem sua análise.",
        "Exploraremos funções essenciais como SUM, AVERAGE, COUNT, CALCULATE e IF. Cada função será apresentada com exemplos práticos aplicados a cenários de negócio reais para facilitar a compreensão.",
        "Ao concluir esta aula, você terá criado suas primeiras medidas DAX e entenderá a diferença entre medidas e colunas calculadas, escolhendo a abordagem certa para cada situação.",
      ],
    },
    {
      id: "m3-aula-02",
      title: "Aula 02",
      subtitle: "Visualizações Avançadas",
      type: "aula",
      body: [
        "Além dos gráficos básicos, o Power BI oferece uma ampla galeria de visualizações avançadas. Nesta aula você aprenderá a utilizar mapas, gráficos de dispersão, matrizes e visuais personalizados da AppSource.",
        "Veremos como escolher o tipo de visual mais adequado para cada tipo de análise, evitando gráficos que distorcem a percepção dos dados. Uma boa visualização comunica insights de forma clara e instantânea.",
        "Ao final, você saberá combinar múltiplos visuais em um dashboard coeso, aplicando filtros visuais e segmentações para criar experiências interativas e intuitivas para os usuários.",
      ],
    },
    {
      id: "m3-aula-03",
      title: "Aula 03",
      subtitle: "Publicação e Compartilhamento",
      type: "aula",
      body: [
        "Criar um relatório é apenas o primeiro passo — compartilhá-lo de forma segura e eficiente é igualmente importante. Nesta aula você aprenderá a publicar relatórios no Power BI Service e gerenciar o acesso.",
        "Abordaremos workspaces, aplicativos Power BI, agendamento de atualização de dados e configuração de permissões por papel (visualizador, membro, administrador). A governança de dados é fundamental em ambientes corporativos.",
        "Ao concluir o módulo, você estará capacitado a entregar relatórios profissionais e atualizados automaticamente, garantindo que os stakeholders sempre tenham acesso às informações mais recentes.",
      ],
    },
  ],
};

const moduloTitles: Record<string, string> = {
  "1": "Módulo 01",
  "2": "Módulo 02",
  "3": "Módulo 03",
};

// --- Helpers de Persistência ---
function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(VISITED_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    /* ignore */
  }
  return new Set();
}

function saveVisited(visited: Set<string>) {
  try {
    localStorage.setItem(VISITED_KEY, JSON.stringify([...visited]));
  } catch {
    /* ignore */
  }
}

// --- Lógica da Página ---
const route = useRoute();
const router = useRouter();

useEnrollmentGuard("power-bi");

const modId = computed(() => (route.params.modId as string) || "1");
const aulas = computed(
  () => aulasPorModulo[modId.value] || aulasPorModulo["1"],
);
const moduloTitle = computed(() => moduloTitles[modId.value] || "Módulo 01");

// Recupera o índice inicial do estado da história do navegador (ou 0)
const initialIndex = history.state?.aulaIndex ?? 0;
const aulaIndex = ref(Math.min(initialIndex, aulas.value.length - 1));

const visited = ref<Set<string>>(loadVisited());

const currentAula = computed(() => aulas.value[aulaIndex.value]);
const isLastAula = computed(() => aulaIndex.value === aulas.value.length - 1);

// Lógica de marcar como visitado e salvar
const markAsVisited = () => {
  if (!visited.value.has(currentAula.value.id)) {
    visited.value.add(currentAula.value.id);
    saveVisited(visited.value);
  }
};

onMounted(markAsVisited);

// Observa mudança de aula para marcar como visitado
watch(() => currentAula.value.id, markAsVisited);

const handleNext = () => {
  if (isLastAula.value) {
    router.push("/courses/power-bi/exam/instructions");
  } else {
    aulaIndex.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
</script>

<template>
  <main id="main-content" class="bg-white flex flex-col min-h-screen">
    <div class="flex-1 overflow-y-auto pb-[96px]">
      <div
        class="max-w-[600px] mx-auto flex flex-col gap-[20px] px-[16px] md:px-[24px] pt-[20px] w-full"
      >
        <PageHeader
          :title="currentAula.title"
          backPath="/courses/power-bi/modules"
          :crumbs="[
            { label: 'Cursos', path: '/courses' },
            { label: 'Power BI - Fundamentos', path: '/courses/power-bi' },
            { label: 'Módulos', path: '/courses/power-bi/modules' },
            { label: moduloTitle, path: `/courses/power-bi/modules/${modId}` },
            { label: currentAula.title },
          ]"
        />

        <h2
          class="font-['Figtree:Bold',sans-serif] font-bold text-[24px] leading-[36px] text-black"
        >
          Power BI - Fundamentos
        </h2>

        <div
          class="bg-[#c5d6ff] rounded-[12px] w-full overflow-hidden flex flex-col gap-[15px] px-[18px] pt-[18px] pb-[18px]"
        >
          <div class="w-full aspect-[16/9] rounded-[10px] overflow-hidden">
            <img
              :alt="`${currentAula.title}: ${currentAula.subtitle}`"
              class="w-full h-full object-cover"
              :src="imgRectangle30"
            />
          </div>

          <div class="flex items-center justify-between w-full">
            <h3
              class="font-['Figtree:Bold',sans-serif] font-bold text-[24px] leading-[36px] text-black"
            >
              {{ currentAula.title }}: {{ currentAula.subtitle }}
            </h3>
            <svg
              aria-hidden="true"
              class="size-[24px] shrink-0 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                clip-rule="evenodd"
                d="M6 7L12 13L18 7L20 9L12 17L4 9L6 7Z"
                fill="#021b59"
                fill-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <p
          class="font-['Figtree:Regular',sans-serif] font-normal text-[14px] leading-[20px] text-[#8e8e8e]"
          aria-live="polite"
        >
          {{ aulaIndex + 1 }} de {{ aulas.length }} aulas do {{ moduloTitle }}
        </p>

        <div class="flex flex-col gap-[16px]" aria-label="Conteúdo da aula">
          <p
            v-for="(paragraph, i) in currentAula.body"
            :key="i"
            class="font-['Figtree:Regular',sans-serif] font-normal text-[16px] leading-[24px] text-black"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="fixed bottom-0 left-0 right-0 z-20 bg-white flex items-center justify-center px-[18px] py-[16px] shadow-[0px_0px_12px_0px_rgba(51,51,51,0.2)]"
    >
      <button
        type="button"
        @click="handleNext"
        class="bg-[#ffeac4] flex h-[50px] items-center justify-center rounded-[26px] w-full max-w-[360px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] hover:bg-[#ffd98a] transition-colors active:scale-[0.98]"
        :aria-label="
          isLastAula
            ? 'Ir para a prova do módulo'
            : `Ir para a próxima aula (${aulaIndex + 2} de ${aulas.length})`
        "
      >
        <span
          class="font-['Figtree:Medium',sans-serif] font-medium text-[20px] leading-[30px] text-[#333] text-center whitespace-nowrap"
        >
          {{ isLastAula ? "Ir para a prova" : "Ir para próxima aula" }}
        </span>
      </button>
    </div>
  </main>
</template>
