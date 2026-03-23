import { create } from "zustand";

/**
 * Course enrollment store state and actions
 * Manages courses that the current user is enrolled in
 * and dual-role course access (professor with student role in specific courses)
 *
 * ⚠️ ARCHITECTURE NOTE:
 * This store manages UI state only. Permission/authorization validation
 * must occur on the backend. The courseStudentRoles field indicates
 * courses where a user (typically a professor) also has student access.
 * This is provided by the backend and should not be modified client-side.
 */
interface CourseStore {
  // State
  enrolledCourses: string[];
  courseStudentRoles: string[];

  // Actions
  enrollInCourse: (courseId: string) => void;
  unenrollFromCourse: (courseId: string) => void;
  isEnrolledInCourse: (courseId: string) => boolean;
  hasCourseStudentRole: (courseId: string) => boolean;
  setCourseStudentRoles: (courseIds: string[]) => void;
}

/**
 * Zustand course enrollment store
 * Tracks courses the user is enrolled in and their roles within courses
 *
 * Usage:
 * const { enrolledCourses, enrollInCourse, isEnrolledInCourse } = useCourseStore();
 *
 * ⚠️ ZERO TRUST CLIENT:
 * - Enrollment actions are UI-driven only
 * - Backend must validate all authorization
 * - Do NOT use client-side enrollment state for security decisions
 * - Authorization checks must ALWAYS occur server-side
 */
export const useCourseStore = create<CourseStore>((set, get) => ({
  enrolledCourses: [],
  courseStudentRoles: [],

  /**
   * Enroll user in a course
   * Adds courseId to enrolledCourses if not already present
   *
   * ⚠️ NOTE: This is UI state only.
   * The backend must validate authorization before processing the enrollment.
   *
   * @param courseId - Unique identifier of the course to enroll in
   */
  enrollInCourse: (courseId: string) => {
    set((state) => {
      if (state.enrolledCourses.includes(courseId)) {
        return state;
      }
      return {
        enrolledCourses: [...state.enrolledCourses, courseId],
      };
    });
  },

  /**
   * Unenroll user from a course
   * Removes courseId from enrolledCourses
   *
   * ⚠️ NOTE: This is UI state only.
   * The backend must validate authorization before processing the unenrollment.
   *
   * @param courseId - Unique identifier of the course to unenroll from
   */
  unenrollFromCourse: (courseId: string) => {
    set((state) => ({
      enrolledCourses: state.enrolledCourses.filter((id) => id !== courseId),
    }));
  },

  /**
   * Check if user is enrolled in a course
   *
   * @param courseId - Unique identifier of the course
   * @returns true if user is enrolled, false otherwise
   */
  isEnrolledInCourse: (courseId: string): boolean => {
    const state = get();
    return state.enrolledCourses.includes(courseId);
  },

  /**
   * Check if user has student role within a specific course
   * This is used when a user (typically professor) has dual roles
   * and needs student-level access to specific courses
   *
   * @param courseId - Unique identifier of the course
   * @returns true if user has student role in the course, false otherwise
   */
  hasCourseStudentRole: (courseId: string): boolean => {
    const state = get();
    return state.courseStudentRoles.includes(courseId);
  },

  /**
   * Set the list of courses where user has student role
   * This should be called after user authentication with backend-provided data
   *
   * ⚠️ SECURITY: This state comes from backend authorization.
   * Do NOT modify this client-side based on user input.
   *
   * @param courseIds - List of course IDs where user has student role
   */
  setCourseStudentRoles: (courseIds: string[]) => {
    set({ courseStudentRoles: courseIds });
  },
}));
