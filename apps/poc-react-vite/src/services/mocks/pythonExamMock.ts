/**
 * Python Exam Mock API — Python Beginner Course Module 01
 * Simulates asynchronous API calls for Python exam data
 */

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  correctLabel: string;
}

const examData: Question[] = [
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
];

export const optionLabels = ["A", "B", "C", "D"];

/**
 * Simulates fetching Python exam questions from an API
 * @returns Promise resolving to Python exam questions
 */
export const fetchPythonExamQuestions = async (): Promise<Question[]> => {
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
