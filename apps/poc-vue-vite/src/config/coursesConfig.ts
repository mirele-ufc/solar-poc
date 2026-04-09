/**
 * Configuração centralizada de cursos (dados mock)
 * Mapeia courseId para metadados do curso — IDÊNTICO ao React
 */

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  correctLabel: string;
}

export interface CourseConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  longDescription: string;
  loading: string;
  bullets: string[];
  heroImageUrl: string;
  enrollmentKey: string;
  examQuestions: ExamQuestion[]; // questões da prova consolidadas
}

export const coursesConfig: Record<string, CourseConfig> = {
  "power-bi": {
    id: "power-bi",
    name: "Power BI",
    title: "Power BI - Fundamentos",
    description:
      "O curso Power BI Fundamentos tem como objetivo introduzir os participantes aos conceitos essenciais de análise de dados e Business Intelligence utilizando o Microsoft Power BI.",
    longDescription:
      "Ao longo do curso, os alunos aprendem a transformar dados brutos em informações estratégicas por meio da criação de relatórios interativos e dashboards dinâmicos.",
    loading: "Carga horária: 30h",
    bullets: [
      "Conceitos básicos de Business Intelligence e análise de dados",
      "Conexão e importação de diferentes fontes de dados",
      "Transformação e limpeza de dados com o Power Query",
      "Criação de medidas e cálculos com a linguagem DAX",
      "Construção de dashboards interativos e relatórios visuais",
      "Publicação e compartilhamento de relatórios no Power BI Service",
    ],
    heroImageUrl:
      "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGJ1c2luZXNzJTIwaW50ZWxsaWdlbmNlJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MzMzNTYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
    enrollmentKey: "power-bi",
    examQuestions: [
      {
        id: "q1",
        text: "No Microsoft Power BI, qual é a principal função do Power Query?",
        options: [
          "Criar dashboards interativos para apresentação final",
          "Realizar tratamento, limpeza e transformação de dados antes da análise",
          "Publicar relatórios na nuvem",
          "Criar gráficos avançados com animações",
        ],
        correctIndex: 1,
        correctLabel: "B",
      },
      {
        id: "q2",
        text: "Qual linguagem é utilizada no Power BI para criação de medidas e cálculos personalizados?",
        options: ["SQL", "Python", "DAX", "VBA"],
        correctIndex: 2,
        correctLabel: "C",
      },
    ],
  },
  python: {
    id: "python",
    name: "Python",
    title: "Python - Fundamentos de Programação",
    description:
      "O curso Python Fundamentos apresenta os conceitos essenciais de programação em Python, uma das linguagens mais populares e versáteis do mercado.",
    longDescription:
      "Amplie seus conhecimentos em desenvolvimento e ciência de dados através da criação de scripts, automação de tarefas e análise de informações.",
    loading: "Carga horária: 40h",
    bullets: [
      "Variáveis, tipos de dados e operações básicas em Python",
      "Estruturas de controle (if/else, loops)",
      "Funções e módulos",
      "Manipulação de arquivos e entrada/saída",
      "Bibliotecas populares (NumPy, Pandas)",
      "Introdução a orientação a objetos",
    ],
    heroImageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXRob24lMjBwcm9ncmFtbWluZ3xlbnwxfHx8fDE3NzMzMzU3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    enrollmentKey: "python",
    examQuestions: [
      {
        id: "pyq1",
        text: "Qual das alternativas abaixo representa um tipo de dado primitivo em Python?",
        options: [
          "Lista (list)",
          "Dicionário (dict)",
          "Inteiro (int)",
          "Tupla (tuple)",
        ],
        correctIndex: 2,
        correctLabel: "C",
      },
      {
        id: "pyq2",
        text: "Qual é a forma correta de exibir texto na saída padrão em Python?",
        options: [
          "echo('Olá, mundo!')",
          "print('Olá, mundo!')",
          "System.out.println('Olá, mundo!')",
          "console.log('Olá, mundo!')",
        ],
        correctIndex: 1,
        correctLabel: "B",
      },
      {
        id: "pyq3",
        text: "Em Python, qual palavra-chave é usada para definir uma função?",
        options: ["function", "func", "def", "fn"],
        correctIndex: 2,
        correctLabel: "C",
      },
    ],
  },
};

export function getCourseConfig(courseId: string): CourseConfig | null {
  return coursesConfig[courseId] || null;
}

export function isValidCourseId(courseId: string): boolean {
  return courseId in coursesConfig;
}

export function getAllCourseIds(): string[] {
  return Object.keys(coursesConfig);
}
