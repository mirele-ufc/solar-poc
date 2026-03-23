import { apiClient } from "./api";
import {
  IQuiz,
  IQuestion,
  IQuestionAnswer,
  ISubmitQuizPayload,
  IQuizSubmissionResult,
} from "@ava-poc/types";

/**
 * Fetch a specific quiz by its ID
 * Retrieves all questions and options for the quiz
 * Note: The correct answer index should NOT be disclosed to the client before submission
 * (This validation should be enforced by the back-end)
 *
 * @param quizId - Unique identifier of the quiz
 * @returns Promise<IQuiz> - Quiz object with all questions
 * @throws IApiError - If the request fails or quiz is not found
 */
export async function fetchQuizById(quizId: string): Promise<IQuiz> {
  try {
    const response = await apiClient.get<IQuiz>(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch quiz with ID ${quizId}:`, error);
    throw error;
  }
}

/**
 * Submit quiz answers and receive score
 * All validation of answers and score calculation MUST be performed on the back-end.
 * The front-end only collects user answers and sends them for server-side validation.
 *
 * SECURITY NOTES:
 * - Do NOT perform answer validation on the client
 * - Do NOT calculate the score on the client
 * - Do NOT store the correct answers in the browser state
 * - Trust only the server's response for final score and feedback
 *
 * @param quizId - Unique identifier of the quiz being submitted
 * @param payload - Student ID, course ID, and array of answers
 * @returns Promise<IQuizSubmissionResult> - Score, feedback, and result details
 * @throws IApiError - If the request fails
 */
export async function submitQuiz(
  quizId: string,
  payload: ISubmitQuizPayload,
): Promise<IQuizSubmissionResult> {
  try {
    const response = await apiClient.post<IQuizSubmissionResult>(
      `/quizzes/${quizId}/submit`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to submit quiz with ID ${quizId}:`, error);
    throw error;
  }
}

/**
 * Fetch user's quiz submissions history
 * Retrieves all previous quiz submissions for a student
 *
 * @param studentId - Unique identifier of the student
 * @returns Promise<IQuizSubmissionResult[]> - Array of past submission results
 * @throws IApiError - If the request fails
 */
export async function fetchStudentQuizHistory(
  studentId: string,
): Promise<IQuizSubmissionResult[]> {
  try {
    const response = await apiClient.get<IQuizSubmissionResult[]>(
      `/students/${studentId}/quiz-submissions`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch quiz history for student ${studentId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Fetch a specific quiz submission result
 * Retrieves the detailed results of a previously submitted quiz
 *
 * @param submissionId - Unique identifier of the quiz submission
 * @returns Promise<IQuizSubmissionResult> - Detailed submission results
 * @throws IApiError - If the request fails
 */
export async function fetchQuizSubmissionResult(
  submissionId: string,
): Promise<IQuizSubmissionResult> {
  try {
    const response = await apiClient.get<IQuizSubmissionResult>(
      `/quiz-submissions/${submissionId}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch quiz submission result with ID ${submissionId}:`,
      error,
    );
    throw error;
  }
}
