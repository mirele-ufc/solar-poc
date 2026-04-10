import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCourseFlow } from "@/composables/useCourseFlow";
import { flushPromises } from "@vue/test-utils";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(() => ({
    params: { id: "python" },
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock("@/services/api/courseService", () => ({
  getCourseById: vi.fn(async (id: string) => ({
    id: id === "python" ? 1 : 2,
    title: `Course ${id}`,
    description: "Test course",
    category: "test",
    imagePath: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

  it("valida courseId contra config", async () => {
    const { courseId, isValid } = useCourseFlow();

    expect(courseId).toBe("python");

    // Aguarda o fetch assíncrono
    await flushPromises();

    // isValid é um computed que retorna !!course.value
    expect(isValid.value).toBe(true);
  });

  it("retorna courseConfig válido", async () => {
    const { courseConfig } = useCourseFlow();

    // Aguarda o fetch assíncrono
    await flushPromises();

    // courseConfig é um computed que retorna course.value
    expect(courseConfig.value).toBeDefined();
    expect(courseConfig.value?.title).toContain("Course");
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
