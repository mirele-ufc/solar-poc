import { describe, expect, it } from "vitest";
import {
  loginRequestSchema,
  registerSchema,
} from "@/validations/authSchema";
import { profileImageDimensionSchema } from "@/validations/fileSchema";

describe("schemas contract alignment", () => {
  it("should fail on invalid login email", () => {
    const result = loginRequestSchema.safeParse({
      email: "invalid-email",
      senha: "123456",
    });

    expect(result.success).toBe(false);
  });

  it("should pass register with valid CPF", () => {
    const result = registerSchema.safeParse({
      cpf: "12345678901",
      email: "valid@ufc.br",
      password: "123456",
      confirmPassword: "123456",
      gender: "masculino",
    });

    expect(result.success).toBe(true);
  });

  it("should pass for 200x200 image metadata", () => {
    const result = profileImageDimensionSchema.safeParse({
      width: 200,
      height: 200,
    });

    expect(result.success).toBe(true);
  });

  it("should fail for 100x100 image metadata", () => {
    const result = profileImageDimensionSchema.safeParse({
      width: 100,
      height: 100,
    });

    expect(result.success).toBe(false);
  });
});
