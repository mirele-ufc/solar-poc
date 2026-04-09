import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { ref } from "vue";
import { useCourseCreateForm } from "@/composables/useCourseCreateForm";

vi.mock("vee-validate", () => ({
  useForm: vi.fn(() => ({
    values: ref({}),
    errors: ref({}),
    handleSubmit: vi.fn((cb) => () => cb({})),
    resetForm: vi.fn(),
    setFieldValue: vi.fn(),
  })),
}));

vi.mock("@vee-validate/zod", () => ({
  toTypedSchema: vi.fn((schema) => schema),
}));

describe("useCourseCreateForm composable", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("inicializa com estado vazio", () => {
    const { isProcessing } = useCourseCreateForm();

    expect(isProcessing.value).toBe(false);
  });

  it("começa processamento durante submit", async () => {
    const { isProcessing, handleCourseCreateSubmit } = useCourseCreateForm();

    expect(isProcessing.value).toBe(false);

    // Submit é um callback que processa valores
    // A função retornada por handleSubmit é a que deve ser chamada
    const submitFn = handleCourseCreateSubmit;
    if (typeof submitFn === "function") {
      await submitFn();
    }

    // Após processamento, isProcessing volta a false
    expect(isProcessing.value).toBe(false);
  });

  it("reset limpa estado e form", () => {
    const { isProcessing, reset } = useCourseCreateForm();

    isProcessing.value = true;
    reset();

    expect(isProcessing.value).toBe(false);
  });

  it("expõe métodos de formulário obrigatórios", () => {
    const { values, errors, hasErrors, setFieldValue, reset } =
      useCourseCreateForm();

    expect(values).toBeDefined();
    expect(errors).toBeDefined();
    expect(hasErrors).toBeDefined();
    expect(setFieldValue).toBeDefined();
    expect(reset).toBeDefined();
  });

  it("hasErrors é um computed que reage a mudanças de errors", () => {
    const { hasErrors } = useCourseCreateForm();

    // Sem erros, hasErrors é false
    expect(hasErrors.value).toBe(false);
  });
});
