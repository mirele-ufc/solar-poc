import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCourseFlow } from "@/composables/useCourseFlow";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(() => ({
    params: { id: "python" },
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock("@/config/coursesConfig", () => ({
  isValidCourseId: vi.fn((id: string) => ["python", "power-bi"].includes(id)),
  getCourseConfig: vi.fn((id: string) => ({
    id,
    title: `Course ${id}`,
    description: "Test course",
  })),
}));

describe("useCourseFlow composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lê courseId da rota", () => {
    const { courseId } = useCourseFlow();
    expect(courseId).toBe("python");
  });

  it("valida courseId contra config", () => {
    const { courseId, isValid, courseConfig } = useCourseFlow();

    expect(courseId).toBe("python");
    expect(isValid).toBe(true);
    expect(courseConfig).toBeDefined();
  });

  it("retorna courseConfig válido", () => {
    const { courseConfig } = useCourseFlow();

    expect(courseConfig).toBeDefined();
    expect(courseConfig?.title).toContain("Course");
  });

  it("navega para modules", () => {
    const { navigateTo, router } = useCourseFlow();

    navigateTo("modules");

    expect(router.push).toHaveBeenCalledWith("/courses/python/modules");
  });

  it("navega para enrollment", () => {
    const { navigateTo, router } = useCourseFlow();

    navigateTo("enrollment");

    expect(router.push).toHaveBeenCalledWith("/courses/python/enrollment");
  });

  it("navega para exam-instructions", () => {
    const { navigateTo, router } = useCourseFlow();

    navigateTo("exam-instructions");

    expect(router.push).toHaveBeenCalledWith(
      "/courses/python/exam/instructions",
    );
  });

  it("navega para exam", () => {
    const { navigateTo, router } = useCourseFlow();

    navigateTo("exam");

    expect(router.push).toHaveBeenCalledWith("/courses/python/exam");
  });

  it("navega para exam-results", () => {
    const { navigateTo, router } = useCourseFlow();

    navigateTo("exam-results");

    expect(router.push).toHaveBeenCalledWith("/courses/python/exam/results");
  });
});
