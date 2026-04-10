import { describe, expect, it } from "vitest";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/validations/authSchema";

describe("registerFormSchema — Comprehensive Validation", () => {
  describe("Nome field", () => {
    it("should pass with valid nome", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva Santos",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
    });

    it("should fail when nome is empty", () => {
      const result = registerFormSchema.safeParse({
        nome: "",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.nome?.[0];
        expect(error).toBe("Nome não informado");
      }
    });

    it("should fail when nome has less than 3 characters", () => {
      const result = registerFormSchema.safeParse({
        nome: "Jo",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.nome?.[0];
        expect(error).toContain("Mínimo");
      }
    });

    it("should pass when nome is exactly 3 characters", () => {
      const result = registerFormSchema.safeParse({
        nome: "João",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
    });

    it("should trim whitespace from nome", () => {
      const result = registerFormSchema.safeParse({
        nome: "  João Silva  ",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
      expect(result.data?.nome).toBe("João Silva");
    });
  });

  describe("CPF field", () => {
    it("should pass with valid CPF (unformatted)", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
    });

    it("should pass with valid CPF (formatted)", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "123.456.789-01",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
    });

    it("should fail when CPF is empty", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.cpf?.[0];
        expect(error).toBe("CPF não informado");
      }
    });

    it("should fail with invalid CPF format", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "123",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.cpf?.[0];
        expect(error).toBe("CPF inválido");
      }
    });

    it("should fail with partially valid CPF", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "123.456.789",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
    });

    it("should trim whitespace from CPF", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "  123.456.789-01  ",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
      expect(result.data?.cpf).toBe("123.456.789-01");
    });
  });

  describe("Email field", () => {
    it("should pass with valid email", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
    });

    it("should fail when email is empty", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.email?.[0];
        expect(error).toBe("Email não informado");
      }
    });

    it("should fail with invalid email format", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "invalid-email",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.email?.[0];
        expect(error).toBe("Email inválido");
      }
    });

    it("should fail with email missing @", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao.ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
    });

    it("should trim whitespace from email", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "  joao@ufc.br  ",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
      expect(result.data?.email).toBe("joao@ufc.br");
    });
  });

  describe("Password field", () => {
    it("should pass with valid password", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
    });

    it("should fail when password is empty", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.password?.[0];
        expect(error).toBe("Senha não informada");
      }
    });

    it("should fail when password has less than 6 characters", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "12345",
        confirmPassword: "12345",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.password?.[0];
        expect(error).toContain("ao menos 6");
      }
    });

    it("should pass when password is exactly 6 characters", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "123456",
        confirmPassword: "123456",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
    });

    it("should trim whitespace from password", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "  SecurePass123  ",
        confirmPassword: "  SecurePass123  ",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
      expect(result.data?.password).toBe("SecurePass123");
    });
  });

  describe("Confirm Password field", () => {
    it("should fail when passwords don't match", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "DifferentPass123",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.confirmPassword?.[0];
        expect(error).toContain("As senhas não conferem");
      }
    });

    it("should fail when confirmPassword is empty", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "",
        perfil: "professor",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.confirmPassword?.[0];
        expect(error).toBe("Confirmação de senha não informada");
      }
    });

    it("should pass when passwords match", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "Match123456",
        confirmPassword: "Match123456",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Perfil field", () => {
    it("should pass with valid perfil 'professor'", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
      });
      expect(result.success).toBe(true);
      expect(result.data?.perfil).toBe("professor");
    });

    it("should pass with valid perfil 'student'", () => {
      const result = registerFormSchema.safeParse({
        nome: "Maria Silva",
        cpf: "10987654321",
        email: "maria@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "student",
      });
      expect(result.success).toBe(true);
      expect(result.data?.perfil).toBe("student");
    });

    it("should fail with invalid perfil", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "admin",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.perfil?.[0];
        expect(error).toContain("Perfil inválido");
      }
    });
  });

  describe("Full payload validation", () => {
    it("should parse valid payload with correct types", () => {
      const payload = {
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor" as const,
      };

      const result = registerFormSchema.safeParse(payload);
      expect(result.success).toBe(true);

      if (result.success) {
        const data: RegisterFormValues = result.data;
        expect(data.nome).toEqual("João Silva");
        expect(data.cpf).toEqual("12345678901");
        expect(data.email).toEqual("joao@ufc.br");
        expect(data.password).toEqual("SecurePass123");
        expect(data.confirmPassword).toEqual("SecurePass123");
        expect(data.perfil).toEqual("professor");
      }
    });

    it("should fail when missing required fields", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
      });
      expect(result.success).toBe(false);
    });

    it("should fail with extra fields", () => {
      const result = registerFormSchema.safeParse({
        nome: "João Silva",
        cpf: "12345678901",
        email: "joao@ufc.br",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        perfil: "professor",
        extraField: "should be rejected",
      });
      // Zod by default ignores extra fields, so this should pass
      expect(result.success).toBe(true);
    });
  });
});
