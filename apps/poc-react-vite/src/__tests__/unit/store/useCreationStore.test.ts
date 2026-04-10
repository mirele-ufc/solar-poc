import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useCreationStore,
  type CourseCreationData,
  type ModuleData,
  type ExamData,
} from "@/store/useCreationStore";

describe("useCreationStore", () => {
  beforeEach(() => {
    // Clear localStorage and create fresh store instance for each test
    localStorage.clear();
  });

  afterEach(() => {
    // Cleanup after each test
    localStorage.clear();
  });

  describe("Course Data", () => {
    it("should set course data", () => {
      const { result } = renderHook(() => useCreationStore());
      const courseData: CourseCreationData = {
        image: "data:image/jpeg;base64,...",
        title: "Test Course",
        description: "A test course",
        category: "Technology",
        hours: "30h",
        requiredFields: ["Email"],
      };

      act(() => {
        result.current.setCourseData(courseData);
      });

      expect(result.current.courseData).toEqual(courseData);
    });

    it("should persist course data to localStorage", () => {
      const { result } = renderHook(() => useCreationStore());
      const courseData: CourseCreationData = {
        image: null,
        title: "Persisted Course",
        description: "Should persist",
        category: "Design",
        hours: "20h",
        requiredFields: [],
      };

      act(() => {
        result.current.setCourseData(courseData);
      });

      const stored = localStorage.getItem("creation-course-data");
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(courseData);
    });

    it("should clear course data", () => {
      const { result } = renderHook(() => useCreationStore());
      const courseData: CourseCreationData = {
        image: null,
        title: "Test",
        description: "Test",
        category: "Test",
        hours: "10h",
        requiredFields: [],
      };

      act(() => {
        result.current.setCourseData(courseData);
      });

      act(() => {
        result.current.clearCourseData();
      });

      expect(result.current.courseData).toBeNull();
      expect(localStorage.getItem("creation-course-data")).toBeNull();
    });

    it("should update course data partially", () => {
      const { result } = renderHook(() => useCreationStore());
      const initial: CourseCreationData = {
        image: null,
        title: "Original",
        description: "Original description",
        category: "Original category",
        hours: "10h",
        requiredFields: [],
      };

      act(() => {
        result.current.setCourseData(initial);
      });

      act(() => {
        result.current.updateCourseData({ title: "Updated" });
      });

      expect(result.current.courseData?.title).toBe("Updated");
      expect(result.current.courseData?.description).toBe(
        "Original description",
      );
    });
  });

  describe("Modules Data", () => {
    it("should add module", () => {
      const { result } = renderHook(() => useCreationStore());
      const module: ModuleData = {
        id: "mod-1",
        name: "Module 1",
        image: null,
        lessons: [],
      };

      act(() => {
        result.current.addModule(module);
      });

      expect(result.current.modules).toHaveLength(1);
      expect(result.current.modules[0]).toEqual(module);
    });

    it("should set modules and persist", () => {
      const { result } = renderHook(() => useCreationStore());
      const modules: ModuleData[] = [
        {
          id: "mod-1",
          name: "Module 1",
          image: null,
          lessons: [],
        },
        {
          id: "mod-2",
          name: "Module 2",
          image: "data:image/jpeg;base64,...",
          lessons: [],
        },
      ];

      act(() => {
        result.current.setModules(modules);
      });

      expect(result.current.modules).toHaveLength(2);
      const stored = localStorage.getItem("creation-modules-data");
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toHaveLength(2);
    });

    it("should clear all modules", () => {
      const { result } = renderHook(() => useCreationStore());
      const module: ModuleData = {
        id: "mod-1",
        name: "Module 1",
        image: null,
        lessons: [],
      };

      act(() => {
        result.current.addModule(module);
      });

      act(() => {
        result.current.clearModules();
      });

      expect(result.current.modules).toHaveLength(0);
      expect(localStorage.getItem("creation-modules-data")).toBeNull();
    });
  });

  describe("Exam Data", () => {
    it("should add question to exam", () => {
      const { result } = renderHook(() => useCreationStore());
      const question = {
        id: "q-1",
        text: "What is 2+2?",
        type: "multiple" as const,
        correctAnswer: "opt-1",
        alternatives: [
          { id: "opt-1", text: "4" },
          { id: "opt-2", text: "5" },
        ],
        points: 1,
      };

      act(() => {
        result.current.addQuestion(question);
      });

      expect(result.current.currentExam?.questions).toHaveLength(1);
      expect(result.current.currentExam?.questions[0]).toEqual(question);
    });

    it("should set exam and persist", () => {
      const { result } = renderHook(() => useCreationStore());
      const exam: ExamData = {
        questions: [
          {
            id: "q-1",
            text: "Question 1",
            type: "multiple" as const,
            correctAnswer: "opt-1",
            alternatives: [{ id: "opt-1", text: "Option 1" }],
            points: 1,
          },
        ],
      };

      act(() => {
        result.current.setExam(exam);
      });

      expect(result.current.currentExam).toEqual(exam);
      const stored = localStorage.getItem("creation-exam-data");
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(exam);
    });

    it("should remove question from exam", () => {
      const { result } = renderHook(() => useCreationStore());
      const question1 = {
        id: "q-1",
        text: "Q1",
        type: "multiple" as const,
        correctAnswer: "opt-1",
        alternatives: [{ id: "opt-1", text: "Opt1" }],
        points: 1,
      };
      const question2 = {
        id: "q-2",
        text: "Q2",
        type: "multiple" as const,
        correctAnswer: "opt-2",
        alternatives: [{ id: "opt-2", text: "Opt2" }],
        points: 2,
      };

      act(() => {
        result.current.addQuestion(question1);
        result.current.addQuestion(question2);
      });

      act(() => {
        result.current.removeQuestion("q-1");
      });

      expect(result.current.currentExam?.questions).toHaveLength(1);
      expect(result.current.currentExam?.questions[0]?.id).toBe("q-2");
    });

    it("should clear exam", () => {
      const { result } = renderHook(() => useCreationStore());
      const exam: ExamData = {
        questions: [
          {
            id: "q-1",
            text: "Question",
            type: "multiple" as const,
            correctAnswer: "opt-1",
            alternatives: [{ id: "opt-1", text: "Option" }],
            points: 1,
          },
        ],
      };

      act(() => {
        result.current.setExam(exam);
      });

      act(() => {
        result.current.clearExam();
      });

      expect(result.current.currentExam).toBeNull();
      expect(localStorage.getItem("creation-exam-data")).toBeNull();
    });
  });

  describe("Clear All Creation Data", () => {
    it("should clear all creation data and localStorage", () => {
      const { result } = renderHook(() => useCreationStore());

      const courseData: CourseCreationData = {
        image: null,
        title: "Test",
        description: "Test",
        category: "Test",
        hours: "10h",
        requiredFields: [],
      };
      const module: ModuleData = {
        id: "mod-1",
        name: "Module",
        image: null,
        lessons: [],
      };
      const exam: ExamData = {
        questions: [
          {
            id: "q-1",
            text: "Q",
            type: "multiple",
            correctAnswer: "opt-1",
            alternatives: [{ id: "opt-1", text: "Opt" }],
            points: 1,
          },
        ],
      };

      act(() => {
        result.current.setCourseData(courseData);
        result.current.addModule(module);
        result.current.setExam(exam);
      });

      act(() => {
        result.current.clearAllCreationData();
      });

      expect(result.current.courseData).toBeNull();
      expect(result.current.modules).toHaveLength(0);
      expect(result.current.currentExam).toBeNull();
      expect(localStorage.getItem("creation-course-data")).toBeNull();
      expect(localStorage.getItem("creation-modules-data")).toBeNull();
      expect(localStorage.getItem("creation-exam-data")).toBeNull();
    });
  });
});
