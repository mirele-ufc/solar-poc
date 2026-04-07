/**
 * Python Exam Mock API — Python Beginner Course Module 01
 * Simula chamadas assíncronas de API para os dados da prova de Python
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
 * Simula a procura de questões da prova de Python através de uma API
 * @returns Promise que resolve com as questões da prova
 */
export const fetchPythonExamQuestions = async (): Promise<Question[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(examData);
    }, 500); // Simula uma latência de rede de 500ms
  });
};

/**
 * Simula a procura dos labels das opções (A, B, C, D) através de uma API
 * @returns Promise que resolve com os labels das opções
 */
export const fetchOptionLabels = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(optionLabels);
    }, 300); // Simula uma latência de rede de 300ms
  });
};