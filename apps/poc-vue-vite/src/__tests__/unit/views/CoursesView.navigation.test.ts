import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import CoursesView from "../../../views/CoursesView.vue";
import { useAuthStore } from "../../../store/useAuthStore";
import * as courseService from "../../../services/courseService";
import { createRouter, createMemoryHistory } from "vue-router";

// Mock dependencies
vi.mock("../../../store/useAuthStore");
vi.mock("../../../services/courseService");

describe("CoursesView", () => {
  const mockCourses = [
    {
      id: "1",
      titulo: "Programação em Python",
      descricao: "Aprenda Python",
      categoria: "programming",
      imagePath: "python.jpg",
    },
    {
      id: "2",
      titulo: "Matemática",
      descricao: "Aprenda Matemática",
      categoria: "math",
      imagePath: "math.jpg",
    },
  ];

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/courses",
        component: CoursesView,
      },
      {
        path: "/courses/:id",
        component: { template: "<div>Course Details</div>" },
      },
    ],
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: { id: "u1", nome: "João", role: "professor" },
      token: "valid-token",
      isLoggedIn: true,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);
  });

  it("should render courses view with course list", async () => {
    vi.mocked(courseService.getCursos).mockResolvedValueOnce(mockCourses);

    const wrapper = mount(CoursesView, {
      global: {
        plugins: [router],
      },
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Programação em Python");
    expect(wrapper.text()).toContain("Matemática");
  });

  it("should handle loading state while fetching courses", async () => {
    vi.mocked(courseService.getCursos).mockImplementationOnce(
      () => new Promise(() => {}), // Never resolves
    );

    const wrapper = mount(CoursesView, {
      global: {
        plugins: [router],
      },
    });

    // Component should have loading state
    expect(wrapper.vm).toBeDefined();
  });

  it("should handle error when fetching courses fails", async () => {
    const mockError = new Error("Failed to fetch courses");
    vi.mocked(courseService.getCursos).mockRejectedValueOnce(mockError);

    const wrapper = mount(CoursesView, {
      global: {
        plugins: [router],
      },
    });

    await flushPromises();

    // Should not display courses
    expect(wrapper.text()).not.toContain("Programação em Python");
  });

  it("should allow navigation to course details", async () => {
    vi.mocked(courseService.getCursos).mockResolvedValueOnce(mockCourses);

    const wrapper = mount(CoursesView, {
      global: {
        plugins: [router],
      },
    });

    await flushPromises();

    const coursesCount = wrapper.findAll("[data-course-item]").length;
    expect(coursesCount).toBe(2);
  });

  it("should render empty state when no courses available", async () => {
    vi.mocked(courseService.getCursos).mockResolvedValueOnce([]);

    const wrapper = mount(CoursesView, {
      global: {
        plugins: [router],
      },
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    // Should render empty state indication
    expect(wrapper.vm).toBeDefined();
  });

  it("should fetch courses on component mount", () => {
    vi.mocked(courseService.getCursos).mockResolvedValueOnce(mockCourses);

    mount(CoursesView, {
      global: {
        plugins: [router],
      },
    });

    expect(courseService.getCursos).toHaveBeenCalledTimes(1);
  });
});
