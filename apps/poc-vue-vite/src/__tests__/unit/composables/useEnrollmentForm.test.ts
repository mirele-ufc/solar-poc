import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { ref } from "vue";
import { useEnrollmentForm } from "@/composables/useEnrollmentForm";

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

describe("useEnrollmentForm composable", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("inicializa com estado vazio", () => {
    const { isProcessing } = useEnrollmentForm();

    expect(isProcessing.value).toBe(false);
  });

  it("gerencia estado de processamento", () => {
    const { isProcessing } = useEnrollmentForm();

    isProcessing.value = true;
    expect(isProcessing.value).toBe(true);

    isProcessing.value = false;
    expect(isProcessing.value).toBe(false);
  });

  it("reset limpa estado", () => {
    const { isProcessing, reset } = useEnrollmentForm();

    isProcessing.value = true;
    reset();

    expect(isProcessing.value).toBe(false);
  });

  it("expõe métodos obrigatórios", () => {
    const { values, errors, hasErrors, handleEnrollmentSubmit, reset, setFieldValue } =
      useEnrollmentForm();

    expect(values).toBeDefined();
    expect(errors).toBeDefined();
    expect(hasErrors).toBeDefined();
    expect(handleEnrollmentSubmit).toBeDefined();
    expect(reset).toBeDefined();
    expect(setFieldValue).toBeDefined();
  });

  it("hasErrors é um computed", () => {
    const { hasErrors } = useEnrollmentForm();

    expect(hasErrors.value).toBeFalsy();
  });
});
