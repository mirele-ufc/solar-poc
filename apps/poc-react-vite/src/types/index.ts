/**
 * Shared React Types & Component Props
 *
 * This directory contains TypeScript types and interfaces that are:
 * - Shared across multiple components/pages
 * - React-specific (not domain/business logic)
 * - Not related to a single component's internal logic
 *
 * Component-specific prop interfaces remain colocated with their components.
 * Domain models are imported from @ava-poc/types.
 */

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
 * Props for message card component
 * Used in MessagesPage and StudentMessagesPage
 */
export interface IMessageCardProps {
  messageId: string;
  senderName: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  onClickMessage?: (messageId: string) => void;
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
 * Type selector for ModulesPage and PythonModulesPage items
 * Used to differentiate lesson and module rendering
 */
export type ModuleItemType = "lesson" | "module";

/**
 * Lesson item data structure for module rendering
 * Used in ModulesPage and PythonModulesPage
 */
export interface ILessonItem {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  isCompleted: boolean;
  order: number;
}

/**
 * Module data structure with lessons
 * Used in ModulesPage and PythonModulesPage
 */
export interface IModuleData {
  id: string;
  title: string;
  order: number;
  lessons: ILessonItem[];
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

/**
 * Props for progress bar component showing module progress
 * Used in ModulesPage and PythonModulesPage
 */
export interface IProgressBarProps {
  completed: number;
  total: number;
  showPercentage?: boolean;
}

/**
 * Modal data for enrollment declaration
 * Used in ModulesPage
 */
export interface IEnrollmentDeclarationModal {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal data for completion declaration
 * Used in ModulesPage
 */
export interface ICompletionDeclarationModal {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Alert data structure for requirements display
 * Used in ModulesPage
 */
export interface IRequirementsAlert {
  isVisible: boolean;
  title: string;
  requirements: string[];
  onClose: () => void;
}

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
