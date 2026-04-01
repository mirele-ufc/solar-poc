import { apiClient } from "./api";
import {
  ICourse,
  ICreateCoursePayload,
  IUpdateCoursePayload,
} from "@ava-poc/types";

type ApiEnvelope<T> = {
  data: T;
  message: string;
  status: number;
};

export type BackendCourseCreatePayload = {
  title: string;
  category: string;
  description: string;
};

export type BackendCourseResponse = {
  id: number;
  title: string;
  category: string;
  description: string;
  imagePath: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Fetch all courses from the back-end
 * Returns a list of all available courses
 *
 * @returns Promise<ICourse[]> - Array of course objects
 * @throws IApiError - If the request fails
 */
export async function fetchCourses(): Promise<ICourse[]> {
  try {
    const response = await apiClient.get<ICourse[]>("/courses");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    throw error;
  }
}

/**
 * Fetch a specific course by its ID
 * Retrieves detailed information about a single course including modules and lessons
 *
 * @param courseId - Unique identifier of the course
 * @returns Promise<ICourse> - Course object with full details
 * @throws IApiError - If the request fails or course is not found
 */
export async function fetchCourseById(courseId: string): Promise<ICourse> {
  try {
    const response = await apiClient.get<ICourse>(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch course with ID ${courseId}:`, error);
    throw error;
  }
}

/**
 * Create a new course
 * Authorization and validation should be handled by the back-end.
 * Front-end only provides populated form data.
 *
 * @param payload - Course creation data (title, description, thumbnail, creatorId)
 * @returns Promise<ICourse> - Newly created course object
 * @throws IApiError - If the request fails
 */
export async function createCourse(
  payload: ICreateCoursePayload,
): Promise<ICourse> {
  try {
    const response = await apiClient.post<ICourse>("/courses", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to create course:", error);
    throw error;
  }
}

/**
 * Create a course using the backend contract for PoC (multipart/form-data).
 * - `dados`: JSON part with title/category/description
 * - `imagem`: optional image file
 */
export async function createCourseWithBackend(
  payload: BackendCourseCreatePayload,
  imageFile?: File,
): Promise<BackendCourseResponse> {
  const formData = new FormData();
  formData.append(
    "dados",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
  );

  if (imageFile) {
    formData.append("imagem", imageFile);
  }

  const response = await apiClient.post<ApiEnvelope<BackendCourseResponse>>(
    "/courses",
    formData,
  );

  return response.data.data;
}

/**
 * Update an existing course
 * Only fields provided in the payload will be updated.
 * Authorization and validation should be handled by the back-end.
 *
 * @param courseId - Unique identifier of the course to update
 * @param payload - Partial course update data
 * @returns Promise<ICourse> - Updated course object
 * @throws IApiError - If the request fails
 */
export async function updateCourse(
  courseId: string,
  payload: IUpdateCoursePayload,
): Promise<ICourse> {
  try {
    const response = await apiClient.patch<ICourse>(
      `/courses/${courseId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update course with ID ${courseId}:`, error);
    throw error;
  }
}

/**
 * Delete a course
 * Authorization should be enforced by the back-end.
 * Front-end only sends the request to delete.
 *
 * @param courseId - Unique identifier of the course to delete
 * @returns Promise<void>
 * @throws IApiError - If the request fails
 */
export async function deleteCourse(courseId: string): Promise<void> {
  try {
    await apiClient.delete(`/courses/${courseId}`);
  } catch (error) {
    console.error(`Failed to delete course with ID ${courseId}:`, error);
    throw error;
  }
}
