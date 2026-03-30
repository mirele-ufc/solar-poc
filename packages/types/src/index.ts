// ============================================================================
// TYPE VERSIONING & EXPORTS
// ============================================================================

/**
 * Semantic version for all exported types
 * Incremented when types change in breaking ways
 */
export const TYPES_VERSION = "1.0.0";

// ============================================================================
// DOMAIN MODELS (Business entities from backend DB)
// ============================================================================

/**
 * Authenticated user session with role-based access control
 * Role must align with backend: PROFESSOR → "professor", ALUNO → "student", ADMIN → "admin"
 */
export interface IUserSession {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  fotoUrl?: string;
  role: "professor" | "student" | "admin";
  status: "ATIVO" | "INATIVO";
}

/**
 * Course entity with nested modules and lessons
 */
export interface ICourse {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  cargaHoraria: string;
  thumbnail?: string;
  status: "RASCUNHO" | "PUBLICADO" | "ARQUIVADO";
  professorId: string;
  modulos: IModule[];
}

/**
 * Module within a course
 */
export interface IModule {
  id: string;
  titulo: string;
  ordem: number;
  aulas: ILesson[];
}

/**
 * Lesson (aula) within a module
 */
export interface ILesson {
  id: string;
  titulo: string;
  conteudo: string;
  urlVideo?: string;
  tipo: "video" | "texto" | "quiz";
}

/**
 * Quiz (prova) with questions
 */
export interface IQuiz {
  id: string;
  titulo: string;
  perguntas: IQuestion[];
  pontuacao?: number;
}

/**
 * Question within a quiz
 */
export interface IQuestion {
  id: string;
  texto: string;
  opcoes: string[];
  indiceRespostaCorreta: number;
}

/**
 * Student submission for course/quiz
 */
export interface IStudentSubmission {
  studentId: string;
  courseId: string;
  progressPercentage: number;
  completedLessons: string[];
}

// ============================================================================
// API REQUEST / RESPONSE CONTRACTS
// ============================================================================

/**
 * Login request payload
 */
export interface ILoginRequest {
  email: string;
  senha: string;
}

/**
 * Login response with tokens and user data
 */
export interface ILoginResponse {
  accessToken: string;
  refreshToken?: string;
  usuario?: IUserSession;
}

/**
 * Standardized error response object
 * Ensures all API errors are handled consistently across the application
 */
export interface IApiError {
  message: string;
  status?: number;
  statusText?: string;
  timestamp: string;
}

/**
 * Payload interface for course creation
 * Request data structure for creating a new course
 */
export interface ICreateCoursePayload {
  titulo: string;
  descricao: string;
  categoria: string;
  cargaHoraria: string;
  requerEndereco?: boolean;
  requerGenero?: boolean;
  requerIdade?: boolean;
}

/**
 * Payload interface for course updates
 * Request data structure for updating course information
 */
export interface IUpdateCoursePayload {
  titulo?: string;
  descricao?: string;
  categoria?: string;
  cargaHoraria?: string;
}

/**
 * Single question answer submitted by a student
 * Represents one answer in a quiz submission
 */
export interface IQuestionAnswer {
  questionId: string;
  selectedAnswerIndex: number;
}

/**
 * Payload interface for quiz submission
 * Complete request data when submitting a quiz
 */
export interface ISubmitQuizPayload {
  studentId: string;
  courseId: string;
  answers: IQuestionAnswer[];
}

/**
 * Response interface for quiz submission results
 * Server-calculated score and feedback for a quiz submission
 */
export interface IQuizSubmissionResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  feedback: string;
  passedThreshold: boolean;
  timestamp: string;
}

// ============================================================================
// ROUTE TYPES & NAVIGATION
// ============================================================================

/**
 * User role types for route protection and RBAC
 */
export type UserRole = "admin" | "professor" | "student";

/**
 * Props for protected route component wrapper
 */
export interface ProtectedRouteProps {
  allowedRoles: ReadonlyArray<UserRole>;
  redirectTo?: string;
}

/**
 * Extended props for role-based route wrapper
 */
export interface RoleBasedRouteProps extends ProtectedRouteProps {
  allowedRoles: UserRole[];
}

// ============================================================================
// COMPONENT PROPS (React-specific, shared across components)
// ============================================================================

/**
 * Props for course card component
 * Used in CoursesPage and MyCoursesPage
 */
export interface ICourseCardProps {
  courseId: string;
  title: string;
  description: string;
  thumbnail: string;
  isEnrolled?: boolean;
  onEnroll?: () => void;
  onViewDetails?: (courseId: string) => void;
}

/**
 * Shared props for accordion-like message cards
 * Used in MessagesPage and StudentMessagesPage
 */
export interface IMessageCardProps {
  message: SentMessage;
  isExpanded: boolean;
  onToggle: () => void;
  isUnread?: boolean;
}

/**
 * Breadcrumb item for navigation
 * Used in PageHeader component
 */
export interface IBreadcrumb {
  label: string;
  href?: string;
}

/**
 * Props for PageHeader shared component
 */
export interface IPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: IBreadcrumb[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Lesson item used in course management and exam builder pages
 */
export interface ICourseManageLesson {
  id: string;
  name: string;
}

/**
 * Module item used in course management and exam builder pages
 */
export interface ICourseManageModule {
  id: string;
  name: string;
  lessons: ICourseManageLesson[];
}

/**
 * Type selector for ModulesPage and PythonModulesPage items
 * Used to differentiate lesson and module rendering
 */
export type ModuleItemType = "lesson" | "exam";

/**
 * Lesson or exam item rendered within a module
 * Used in ModulesPage and PythonModulesPage
 */
export interface ILessonItem {
  id: string;
  label: string;
  type: ModuleItemType;
  modId?: string;
}

/**
 * Module structure rendered in course module pages
 * Used in ModulesPage and PythonModulesPage
 */
export interface IModuleData {
  id: string;
  title: string;
  items: ILessonItem[];
}

/**
 * Props for module progress bars
 * Used in ModulesPage and PythonModulesPage
 */
export interface IProgressBarProps {
  visited: number;
  total: number;
}

/**
 * Shared props for enrollment declaration modals
 * Used in ModulesPage and PythonModulesPage
 */
export interface IEnrollmentDeclarationModal {
  onClose: () => void;
  studentName: string;
  validationCode: string;
  emissionDate: Date;
}

/**
 * Shared props for completion declaration modals
 * Used in ModulesPage and PythonModulesPage
 */
export interface ICompletionDeclarationModal {
  onClose: () => void;
  studentName: string;
  validationCode: string;
  emissionDate: Date;
  conclusionDate: Date;
}

/**
 * Shared props for requirements alert modals
 * Used in ModulesPage and PythonModulesPage
 */
export interface IRequirementsAlert {
  totalLessons: number;
  visitedLessons: number;
  totalExams: number;
  visitedExams: number;
  onClose: () => void;
}

// ============================================================================
// STORE TYPES (Zustand store state interfaces)
// ============================================================================

/**
 * User profile data structure for auth store
 * Contains public user information used throughout the application
 */
export interface UserProfile {
  name: string;
  cpf: string;
  email: string;
  photoUrl: string | null;
  role: "professor" | "student" | "admin";
}

/**
 * Message sent by a user to recipients
 * Used in the messaging system
 */
export interface SentMessage {
  id: string;
  recipientId: string;
  recipientLabel: string;
  subject: string;
  body: string;
  sentAt: string;
}

// ============================================================================
// GENERIC STATE HELPERS (Utility types for component state management)
// ============================================================================

/**
 * Generic form state for React Hook Form integration
 * Can be extended for specific forms
 */
export interface IFormState<T> {
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  errors: Partial<Record<keyof T, string>>;
}

/**
 * Generic modal state management
 */
export interface IModalState {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Generic pagination state
 */
export interface IPaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Generic async operation state
 * Used for tracking loading, success, and error states
 */
export interface IAsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
}
