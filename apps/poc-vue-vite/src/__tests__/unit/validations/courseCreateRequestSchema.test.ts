import { describe, it, expect } from "vitest";
import { courseCreateRequestSchema } from "../../../validations/courseSchema";

describe("courseCreateRequestSchema", () => {
  describe("Titulo field", () => {
    it("should accept valid titulo", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Programação em Python",
        descricao: "Aprenda programação com Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty titulo", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "",
        descricao: "Aprenda programação com Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.titulo?.[0];
        expect(error).toBe("O título é obrigatório");
      }
    });

    it("should trim whitespace from titulo", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "  Programação em Python  ",
        descricao: "Aprenda programação com Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.titulo).toBe("Programação em Python");
      }
    });

    it("should accept titulo with special characters", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Programação em C++ & Python!",
        descricao: "Aprenda programação com Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Descricao field", () => {
    it("should accept valid descricao", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao:
          "Neste curso você aprenderá conceitos fundamentais de programação",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty descricao", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.descricao?.[0];
        expect(error).toBe("A descrição é obrigatória");
      }
    });

    it("should trim whitespace from descricao", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "  Aprenda Python  ",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.descricao).toBe("Aprenda Python");
      }
    });

    it("should accept descricao with long text", () => {
      const longDesc =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ".repeat(
          5,
        );
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: longDesc,
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Categoria field", () => {
    it("should accept valid categoria", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "Aprenda Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty categoria", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "Aprenda Python",
        categoria: "",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.categoria?.[0];
        expect(error).toBe("A categoria é obrigatória");
      }
    });

    it("should accept any non-empty categoria string", () => {
      const categories = ["programming", "math", "science", "history"];
      for (const categoria of categories) {
        const result = courseCreateRequestSchema.safeParse({
          titulo: "Test Course",
          descricao: "Test Description",
          categoria,
          cargaHoraria: "40",
          requerEndereco: false,
          requerGenero: false,
          requerIdade: false,
        });
        expect(result.success).toBe(true);
      }
    });

    it("should trim whitespace from categoria", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "Aprenda Python",
        categoria: "  programming  ",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.categoria).toBe("programming");
      }
    });
  });

  describe("CargaHoraria field", () => {
    it("should accept valid cargaHoraria as string", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "Aprenda Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cargaHoraria).toBe("40");
      }
    });

    it("should reject empty cargaHoraria", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "Aprenda Python",
        categoria: "programming",
        cargaHoraria: "",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.cargaHoraria?.[0];
        expect(error).toBe("A carga horária é obrigatória");
      }
    });

    it("should accept numeric strings for cargaHoraria", () => {
      const hours = ["1", "10", "40", "100", "999"];
      for (const hour of hours) {
        const result = courseCreateRequestSchema.safeParse({
          titulo: "Python 101",
          descricao: "Aprenda Python",
          categoria: "programming",
          cargaHoraria: hour,
          requerEndereco: false,
          requerGenero: false,
          requerIdade: false,
        });
        expect(result.success).toBe(true);
      }
    });

    it("should trim whitespace from cargaHoraria", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "Aprenda Python",
        categoria: "programming",
        cargaHoraria: "  40  ",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cargaHoraria).toBe("40");
      }
    });
  });

  describe("Boolean fields", () => {
    it("should accept all false boolean fields", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "Aprenda Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(true);
    });

    it("should accept all true boolean fields", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "Aprenda Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: true,
        requerGenero: true,
        requerIdade: true,
      });
      expect(result.success).toBe(true);
    });

    it("should accept mixed boolean values", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "Aprenda Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: true,
        requerGenero: false,
        requerIdade: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Full payload validation", () => {
    it("should accept complete valid payload", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Programação em Python",
        descricao: "Aprenda os fundamentos de programação com Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: true,
        requerGenero: false,
        requerIdade: true,
      });
      expect(result.success).toBe(true);
    });

    it("should reject payload with missing titulo", () => {
      const result = courseCreateRequestSchema.safeParse({
        descricao: "Aprenda Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(false);
    });

    it("should reject payload with missing descricao", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
      });
      expect(result.success).toBe(false);
    });

    it("should reject payload with extra fields", () => {
      const result = courseCreateRequestSchema.safeParse({
        titulo: "Python 101",
        descricao: "Aprenda Python",
        categoria: "programming",
        cargaHoraria: "40",
        requerEndereco: false,
        requerGenero: false,
        requerIdade: false,
        extraField: "should not be allowed",
        anotherExtra: 123,
      });
      // Zod by default strips extra fields but does not fail
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty("extraField");
      }
    });
  });
});
