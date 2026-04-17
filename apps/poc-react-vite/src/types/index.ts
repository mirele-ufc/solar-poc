/**
 * Re-export shared types from @ava-poc/types package
 * Allows local codebase to import from @ava-poc/types or from ./types
 * for convenience
 */
export type {
  // Domain Models
  IUserSession,
  ICourse,
  IModule,
  ILesson,
  IQuiz,
  IQuestion,
  IStudentSubmission,
  // API Contracts
  ILoginRequest,
  ILoginResponse,
  IApiError,
  ICreateCoursePayload,
  IUpdateCoursePayload,
  IQuestionAnswer,
  ISubmitQuizPayload,
  IQuizSubmissionResult,
  // Route Types
  UserRole,
  ProtectedRouteProps,
  RoleBasedRouteProps,
  // Component Props
  ICourseCardProps,
  IMessageCardProps,
  IBreadcrumb,
  IPageHeaderProps,
  ICourseManageLesson,
  ICourseManageModule,
  ModuleItemType,
  ILessonItem,
  IModuleData,
  IProgressBarProps,
  IEnrollmentDeclarationModal,
  ICompletionDeclarationModal,
  IRequirementsAlert,
  // Store Types
  UserProfile,
  SentMessage,
  // Generic State Helpers
  IFormState,
  IModalState,
  IPaginationState,
  IAsyncState,
} from "@ava-poc/types";

export { TYPES_VERSION } from "@ava-poc/types";
