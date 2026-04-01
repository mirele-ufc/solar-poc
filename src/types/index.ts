/**
 * Tipos globais da aplicação
 * Reutilizáveis em React, Next, Vue, etc
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ AUTENTICAÇÃO E USUÁRIO
// ═══════════════════════════════════════════════════════════════════════════════

export type UserRole = 'PROFESSOR' | 'ALUNO' | 'ADMIN';
export type UserStatus = 'ATIVO' | 'INATIVO';

export interface User {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  perfil: UserRole;
  status: UserStatus;
  fotoPerfil?: string | null;
  criadoEm?: string; // ISO date
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number; // em segundos
  tokenType?: string; // "Bearer"
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ CURSOS
// ═══════════════════════════════════════════════════════════════════════════════

export type CourseStatus = 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO';

export interface Course {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  cargaHoraria: string; // ex: "30h"
  capa?: string;
  status: CourseStatus;
  requerEndereco: boolean;
  requerGenero: boolean;
  requerIdade: boolean;
  professorId: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CourseListResponse {
  items: Course[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ MÓDULOS
// ═══════════════════════════════════════════════════════════════════════════════

export interface Module {
  id: string;
  nome: string;
  ordem: number;
  capa?: string;
  cursoId: string;
  aulas?: Lesson[];
  prova?: Quiz;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ AULAS
// ═══════════════════════════════════════════════════════════════════════════════

export type FileType = 'PDF' | 'VIDEO' | 'IMAGE';

export interface Lesson {
  id: string;
  nome: string;
  ordem: number;
  arquivo?: string;
  tipoArquivo?: FileType;
  conteudoCkEditor?: string; // HTML
  conteudoGerado?: string; // HTML gerado por IA
  moduloId: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ PROVAS
// ═══════════════════════════════════════════════════════════════════════════════

export interface Quiz {
  id: string;
  moduloId: string;
  mostrarRespostasErradas: boolean;
  mostrarRespostasCorretas: boolean;
  mostrarValores: boolean;
  perguntas?: Question[];
}

export interface Question {
  id: string;
  enunciado: string;
  pontos: number;
  ordem: number;
  provaId: string;
  alternativas?: Option[];
}

export interface Option {
  id: string;
  texto: string;
  correta: boolean;
  perguntaId: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ PAGINAÇÃO
// ═══════════════════════════════════════════════════════════════════════════════

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ RESPOSTA DE API PADRÃO
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status: 'success' | 'error';
  timestamp?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp?: string;
}
