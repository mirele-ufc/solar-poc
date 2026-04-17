import type { Curso } from "@/services/api/courseService";

const CATEGORIES = [
  "Programação",
  "Design",
  "Data Science",
  "DevOps",
  "Mobile",
  "Segurança",
  "Cloud",
  "IA & Machine Learning",
];

/**
 * Gera N cursos mock para testes de stress (scroll, rendering, memory).
 * Uso: descomentar import + chamada em courseService.getCourses().
 */
export function generateMockCourses(count = 1000): Curso[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Curso Stress Test #${i + 1} — ${CATEGORIES[i % CATEGORIES.length]}`,
    category: CATEGORIES[i % CATEGORIES.length],
    description: `Descrição sintética do curso ${i + 1} para teste de performance com ${count} itens.`,
    imagePath: "",
    createdAt: new Date(2025, 0, 1 + (i % 365)).toISOString(),
    updatedAt: new Date(2025, 6, 1 + (i % 180)).toISOString(),
  }));
}
