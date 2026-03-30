import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCourseStore = defineStore('course', () => {
  // State
  const enrolledCourses = ref<string[]>([]);
  const courseStudentRoles = ref<string[]>([]);

  // Actions
  function enrollInCourse(courseId: string) {
    if (!enrolledCourses.value.includes(courseId)) {
      enrolledCourses.value.push(courseId);
    }
  }

  function unenrollFromCourse(courseId: string) {
    enrolledCourses.value = enrolledCourses.value.filter(id => id !== courseId);
  }

  function isEnrolledInCourse(courseId: string): boolean {
    return enrolledCourses.value.includes(courseId);
  }

  function hasCourseStudentRole(courseId: string): boolean {
    return courseStudentRoles.value.includes(courseId);
  }

  function setCourseStudentRoles(courseIds: string[]) {
    courseStudentRoles.value = courseIds;
  }

  return {
    enrolledCourses,
    courseStudentRoles,
    enrollInCourse,
    unenrollFromCourse,
    isEnrolledInCourse,
    hasCourseStudentRole,
    setCourseStudentRoles
  };
});