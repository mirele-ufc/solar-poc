/**
 * Formatadores de dados
 * Reutilizáveis em toda a aplicação (RNF27 — Reusability)
 */

// Formatar CPF: "12345678901" → "123.456.789-01"
export const formatCPF = (cpf: string): string => {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Remover formatação de CPF: "123.456.789-01" → "12345678901"
export const unformatCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

// Formatar email em maiúsculas e trimmed
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// Truncar texto com ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
};

// Formatar nome próprio (primeira letra maiúscula)
export const formatProperName = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Formatar data para locale BR: 2024-01-15 → "15 de janeiro de 2024"
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

// Formatar data e hora: 2024-01-15T14:30:00 → "15/01/2024 14:30"
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

// Formatar carga horária: 30 → "30h"
export const formatWorkload = (hours: number): string => {
  return `${hours}h`;
};

// Extrair horas de carga horária: "30h" → 30
export const extractWorkloadHours = (workload: string): number => {
  const match = workload.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// Truncar UUID para exibição curta: "550e8400-e29b-41d4-a716-446655440000" → "550e8400"
export const truncateUUID = (uuid: string): string => {
  return uuid.slice(0, 8);
};
