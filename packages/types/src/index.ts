export interface IUserSession {
  id: string;
  name: string;
  email: string;
  role: "student" | "creator" | "admin";
}

export interface ICourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  creatorId: string;
  modules: IModule[];
}

export interface IModule {
  id: string;
  title: string;
  order: number;
  lessons: ILesson[];
}

export interface ILesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  type: "video" | "text" | "quiz";
}

export interface IQuiz {
  id: string;
  title: string;
  questions: IQuestion[];
  score: number;
}

export interface IQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IStudentSubmission {
  studentId: string;
  courseId: string;
  progressPercentage: number;
  completedLessons: string[];
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
  title: string;
  description: string;
  thumbnail: string;
  creatorId: string;
}

/**
 * Payload interface for course updates
 * Request data structure for updating course information
 */
export interface IUpdateCoursePayload {
  title?: string;
  description?: string;
  thumbnail?: string;
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
