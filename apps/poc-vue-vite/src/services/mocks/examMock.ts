/**
 * Exam Mock API — Power BI Fundamentals Course
 * Simula chamadas assíncronas de API para dados da prova
 */

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  correctLabel: string;
};

const examData: Question[] = [
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
  {
    id: "q3",
    text: "O que significa a sigla DAX?",
    options: [
      "Data Analysis Expressions",
      "Digital Analysis Experience",
      "Data Analytics Extension",
      "Direct Access XML",
    ],
    correctIndex: 0,
    correctLabel: "A",
  },
  // Adicione mais questões conforme necessário para chegar a 10
];

export const optionLabels = ["A", "B", "C", "D"];

/**
 * Simula a busca de questões da prova de uma API
 * @returns Promise que resolve com as questões
 */
export const fetchExamQuestions = async (): Promise<Question[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(examData);
    }, 500); // Simula latência de rede de 500ms
  });
};

/**
 * Simula a busca dos labels das opções (A, B, C, D)
 * @returns Promise que resolve com os labels
 */
export const fetchOptionLabels = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(optionLabels);
    }, 300);
  });
};