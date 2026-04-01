/**
 * Tipos de Request/Response específicos da API
 * Mapeamento direto com os DTOs do backend
 */

import type { User, Course, Module, Lesson, Quiz, Question, Option } from './index';

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ AUTH REQUESTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  data: User;
  message: string;
  status: 'success';
}

export interface CadastroRequest {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  perfil: 'PROFESSOR' | 'ALUNO';
}

export interface CadastroResponse {
  data: User;
  message: string;
  status: 'success';
}

export interface RecuperarSenhaRequest {
  email: string;
}

export interface RecuperarSenhaResponse {
  message: string;
  status: 'success';
}

export interface RedefinirSenhaRequest {
  token: string;
  novaSenha: string;
}

export interface RedefinirSenhaResponse {
  message: string;
  status: 'success';
}

export interface AlterarSenhaRequest {
  senhaAtual: string;
  senhaNova: string;
}

export interface AlterarSenhaResponse {
  message: string;
  status: 'success';
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ PERFIL REQUESTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface GetPerfilResponse {
  data: User;
  message: string;
  status: 'success';
}

export interface UploadFotoRequest {
  arquivo: File;
}

export interface UploadFotoResponse {
  data: { fotoPerfil: string };
  message: string;
  status: 'success';
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ CURSOS REQUESTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CreateCourseRequest {
  titulo: string;
  descricao: string;
  categoria: string;
  cargaHoraria: string;
  capa?: File;
  requerEndereco?: boolean;
  requerGenero?: boolean;
  requerIdade?: boolean;
}

export interface UpdateCourseRequest {
  titulo?: string;
  descricao?: string;
  categoria?: string;
  cargaHoraria?: string;
  capa?: File;
  status?: string;
  requerEndereco?: boolean;
  requerGenero?: boolean;
  requerIdade?: boolean;
}

export interface GetCourseResponse {
  data: Course;
  message: string;
  status: 'success';
}

export interface ListCoursesResponse {
  data: {
    items: Course[];
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
  };
  message: string;
  status: 'success';
}

export interface DeleteCourseResponse {
  message: string;
  status: 'success';
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ MÓDULOS REQUESTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CreateModuleRequest {
  nome: string;
  ordem: number;
  capa?: File;
}

export interface UpdateModuleRequest {
  nome?: string;
  ordem?: number;
  capa?: File;
}

export interface GetModuleResponse {
  data: Module;
  message: string;
  status: 'success';
}

export interface ReorderModuleRequest {
  ordem: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ AULAS REQUESTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CreateLessonRequest {
  nome: string;
  ordem: number;
  arquivo?: File;
  tipoArquivo?: string;
  conteudoCkEditor?: string;
}

export interface UpdateLessonRequest {
  nome?: string;
  ordem?: number;
  arquivo?: File;
  tipoArquivo?: string;
  conteudoCkEditor?: string;
}

export interface GenerateLessonContentRequest {
  topico?: string;
}

export interface GenerateLessonContentResponse {
  data: {
    conteudoGerado: string;
  };
  message: string;
  status: 'success';
}

export interface ConfirmLessonContentRequest {
  conteudoGerado: string;
}

export interface ConfirmLessonContentResponse {
  data: Lesson;
  message: string;
  status: 'success';
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ PROVAS REQUESTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CreateQuizRequest {
  mostrarRespostasErradas?: boolean;
  mostrarRespostasCorretas?: boolean;
  mostrarValores?: boolean;
}

export interface UpdateQuizRequest {
  mostrarRespostasErradas?: boolean;
  mostrarRespostasCorretas?: boolean;
  mostrarValores?: boolean;
}

export interface GetQuizResponse {
  data: Quiz;
  message: string;
  status: 'success';
}

export interface GenerateQuizRequest {
  topico?: string;
  quantidade?: number;
}

export interface GenerateQuizResponse {
  data: {
    perguntas: Question[];
  };
  message: string;
  status: 'success';
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ PERGUNTAS REQUESTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CreateQuestionRequest {
  enunciado: string;
  pontos: number;
  ordem: number;
}

export interface UpdateQuestionRequest {
  enunciado?: string;
  pontos?: number;
  ordem?: number;
}

export interface GetQuestionResponse {
  data: Question;
  message: string;
  status: 'success';
}

// ═══════════════════════════════════════════════════════════════════════════════
// ◆ ALTERNATIVAS REQUESTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CreateOptionRequest {
  texto: string;
  correta: boolean;
}

export interface UpdateOptionRequest {
  texto?: string;
  correta?: boolean;
}

export interface GetOptionResponse {
  data: Option;
  message: string;
  status: 'success';
}
