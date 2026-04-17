/**
 * Exam Mock API — Power BI Fundamentals Course
 * Simulates asynchronous API calls for exam data
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
];

export const optionLabels = ["A", "B", "C", "D"];

/**
 * Simulates fetching exam questions from an API
 * @returns Promise resolving to exam questions
 */
export const fetchExamQuestions = async (): Promise<Question[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(examData);
    }, 500); // Simulate 500ms network latency
  });
};

/**
 * Simulates fetching option labels from an API
 * @returns Promise resolving to option labels
 */
export const fetchOptionLabels = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(optionLabels);
    }, 300);
  });
};
