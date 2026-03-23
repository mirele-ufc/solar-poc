import { apiClient } from "./api";
import {
  ICourse,
  ICreateCoursePayload,
  IUpdateCoursePayload,
} from "@ava-poc/types";

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
