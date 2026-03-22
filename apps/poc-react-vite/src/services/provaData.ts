export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  correctLabel: string;
};

export const PROVA_QUESTIONS: Question[] = [
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

export const OPTION_LABELS = ["A", "B", "C", "D"];
