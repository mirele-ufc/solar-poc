import { describe, it, expect } from "vitest";
import { enrollmentFormSchema } from "../../../validations/enrollmentSchema";

describe("enrollmentFormSchema", () => {
  describe("FirstName field", () => {
    it("should accept valid firstName", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty firstName", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.firstName?.[0];
        expect(error).toBe("Nome não informado");
      }
    });

    it("should trim whitespace from firstName", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "  João  ",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("João");
      }
    });

    it("should accept firstName with special characters", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "José-Maria",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(true);
    });

    it("should accept firstName with accents", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "Antônio",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("LastName field", () => {
    it("should accept valid lastName", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty lastName", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.lastName?.[0];
        expect(error).toBe("Sobrenome não informado");
      }
    });

    it("should trim whitespace from lastName", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "  Silva  ",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.lastName).toBe("Silva");
      }
    });

    it("should accept lastName with special characters", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva-Santos",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(true);
    });

    it("should accept lastName with accents", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "São Bento",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("City field", () => {
    it("should accept valid city", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty city", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        city: "",
        gender: "M",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.city?.[0];
        expect(error).toBe("Cidade não informada");
      }
    });

    it("should trim whitespace from city", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        city: "  Fortaleza  ",
        gender: "M",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.city).toBe("Fortaleza");
      }
    });

    it("should accept various city names", () => {
      const cities = [
        "São Paulo",
        "Rio de Janeiro",
        "Brasília",
        "Salvador",
        "Recife",
      ];
      for (const city of cities) {
        const result = enrollmentFormSchema.safeParse({
          firstName: "João",
          lastName: "Silva",
          city,
          gender: "M",
        });
        expect(result.success).toBe(true);
      }
    });
  });

  describe("Gender field", () => {
    it("should accept valid gender values", () => {
      const genders = ["M", "F", "Masculino", "Feminino", "Outro"];
      for (const gender of genders) {
        const result = enrollmentFormSchema.safeParse({
          firstName: "João",
          lastName: "Silva",
          city: "Fortaleza",
          gender,
        });
        expect(result.success).toBe(true);
      }
    });

    it("should reject empty gender", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.gender?.[0];
        expect(error).toBe("Gênero não informado");
      }
    });

    it("should trim whitespace from gender", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "  M  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.gender).toBe("M");
      }
    });
  });

  describe("Full payload validation", () => {
    it("should accept complete valid payload", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(true);
    });

    it("should reject payload with missing firstName", () => {
      const result = enrollmentFormSchema.safeParse({
        lastName: "Silva",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(false);
    });

    it("should reject payload with missing lastName", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        city: "Fortaleza",
        gender: "M",
      });
      expect(result.success).toBe(false);
    });

    it("should reject payload with missing city", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        gender: "M",
      });
      expect(result.success).toBe(false);
    });

    it("should reject payload with missing gender", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        city: "Fortaleza",
      });
      expect(result.success).toBe(false);
    });

    it("should reject payload with all empty fields", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "",
        lastName: "",
        city: "",
        gender: "",
      });
      expect(result.success).toBe(false);
    });

    it("should accept payload with extra fields (strips them)", () => {
      const result = enrollmentFormSchema.safeParse({
        firstName: "João",
        lastName: "Silva",
        city: "Fortaleza",
        gender: "M",
        extraField: "should not be present",
        anotherExtra: 123,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty("extraField");
      }
    });
  });
});
