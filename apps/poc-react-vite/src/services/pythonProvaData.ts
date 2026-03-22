/** Dados da prova do curso Python Iniciante — Módulo 01 */

export interface PythonQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  correctLabel: string;
}

export const PYTHON_QUESTIONS: PythonQuestion[] = [
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

export const PYTHON_OPTION_LABELS = ["A", "B", "C", "D"];
