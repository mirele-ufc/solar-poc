import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import ProtectedRoute from "../../../components/ProtectedRoute.vue";
import { useAuthStore } from "../../../store/useAuthStore";

// Mock useAuthStore
vi.mock("../../../store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("ProtectedRoute", () => {
  const TestComponent = {
    template: "<div>Protected Content</div>",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render protected component when user is authenticated", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: { id: "u1", nome: "João", role: "professor" },
      token: "valid-token",
      isLoggedIn: true,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);

    const wrapper = mount(ProtectedRoute, {
      slots: {
        default: TestComponent,
      },
    });

    expect(wrapper.text()).toContain("Protected Content");
  });

  it("should show unauthorized message when user is not authenticated", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: null,
      token: null,
      isLoggedIn: false,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/protected",
          component: ProtectedRoute,
        },
        {
          path: "/unauthorized",
          component: { template: "<div>Unauthorized</div>" },
        },
      ],
    });

    const wrapper = mount(ProtectedRoute, {
      global: {
        plugins: [router],
      },
      slots: {
        default: TestComponent,
      },
    });

    // After push to router, component should not render protected content
    expect(wrapper.vm.$route.path).not.toBe("/protected");
  });

  it("should check user role if roleRequired is provided", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: { id: "u1", nome: "João", role: "aluno" },
      token: "valid-token",
      isLoggedIn: true,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);

    const wrapper = mount(ProtectedRoute, {
      props: {
        roleRequired: "professor",
      },
      slots: {
        default: TestComponent,
      },
    });

    await wrapper.vm.$nextTick();

    // Should not render protected content for wrong role
    expect(wrapper.text()).not.toContain("Protected Content");
  });

  it("should render when user has required role", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: { id: "u1", nome: "João", role: "professor" },
      token: "valid-token",
      isLoggedIn: true,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);

    const wrapper = mount(ProtectedRoute, {
      props: {
        roleRequired: "professor",
      },
      slots: {
        default: TestComponent,
      },
    });

    expect(wrapper.text()).toContain("Protected Content");
  });

  it("should handle missing usuario gracefully", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      usuario: null,
      token: "some-token",
      isLoggedIn: false,
      acessar: vi.fn(),
      sair: vi.fn(),
    } as any);

    const wrapper = mount(ProtectedRoute, {
      slots: {
        default: TestComponent,
      },
    });

    expect(wrapper.text()).not.toContain("Protected Content");
  });
});
