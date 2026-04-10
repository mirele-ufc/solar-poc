import { describe, expect, it } from "vitest";
import { loginRequestSchema } from "@/validations/authSchema";

describe("loginRequestSchema — Comprehensive Validation", () => {
  describe("Email field", () => {
    it("should pass with valid email", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(true);
    });

    it("should pass with valid username (3-50 chars)", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao_silva.123",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(true);
    });

    it("should fail when email is empty", () => {
      const result = loginRequestSchema.safeParse({
        email: "",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.email?.[0];
        expect(error).toBe("Email ou usuário não informado");
      }
    });

    it("should fail with invalid email format (space in email)", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao silva@ufc.br",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.email?.[0];
        expect(error).toBe("Email ou usuário inválido");
      }
    });

    it("should fail with too short username", () => {
      const result = loginRequestSchema.safeParse({
        email: "ab",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.email?.[0];
        expect(error).toBe("Email ou usuário inválido");
      }
    });

    it("should fail with too long username (>50 chars)", () => {
      const result = loginRequestSchema.safeParse({
        email: "a".repeat(51),
        senha: "SecurePass123",
      });
      expect(result.success).toBe(false);
    });

    it("should trim whitespace from email", () => {
      const result = loginRequestSchema.safeParse({
        email: "  joao@ufc.br  ",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(true);
      expect(result.data?.email).toBe("joao@ufc.br");
    });

    it("should accept email with subdomain", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@mail.ufc.br",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(true);
    });

    it("should accept username with dots and dashes", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao.silva-123",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Senha field", () => {
    it("should pass with valid password", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(true);
    });

    it("should fail when senha is empty", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
        senha: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.senha?.[0];
        expect(error).toBe("Senha não informada");
      }
    });

    it("should fail when senha has less than 6 characters", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
        senha: "12345",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.senha?.[0];
        expect(error).toBe("A senha deve ter ao menos 6 caracteres");
      }
    });

    it("should pass when senha is exactly 6 characters", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
        senha: "123456",
      });
      expect(result.success).toBe(true);
    });

    it("should trim whitespace from senha", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
        senha: "  SecurePass123  ",
      });
      expect(result.success).toBe(true);
      expect(result.data?.senha).toBe("SecurePass123");
    });

    it("should accept long passwords", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
        senha: "VeryLongPasswordWith123SpecialChars!@#",
      });
      expect(result.success).toBe(true);
    });

    it("should accept password with special characters", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
        senha: "Pass@123!#",
      });
      expect(result.success).toBe(true);
    });

    it("should accept password with spaces", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
        senha: "Pass word 123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Full payload validation", () => {
    it("should pass with valid email and password", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("joao@ufc.br");
        expect(result.data.senha).toBe("SecurePass123");
      }
    });

    it("should pass with valid username and password", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao_silva",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("joao_silva");
        expect(result.data.senha).toBe("SecurePass123");
      }
    });

    it("should fail when missing email", () => {
      const result = loginRequestSchema.safeParse({
        senha: "SecurePass123",
      });
      expect(result.success).toBe(false);
    });

    it("should fail when missing senha", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao@ufc.br",
      });
      expect(result.success).toBe(false);
    });

    it("should fail when both fields are invalid", () => {
      const result = loginRequestSchema.safeParse({
        email: "invalid",
        senha: "12345",
      });
      expect(result.success).toBe(false);
    });

    it("should accept email with numbers and special chars", () => {
      const result = loginRequestSchema.safeParse({
        email: "joao.silva+tag@ufc.br",
        senha: "SecurePass123",
      });
      expect(result.success).toBe(true);
    });
  });
});
