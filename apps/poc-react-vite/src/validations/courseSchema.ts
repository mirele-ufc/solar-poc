import { z } from "zod";
import { imageFileSchema } from "./fileSchema";
import type {
  ICreateCoursePayload,
  IUpdateCoursePayload,
} from "@ava-poc/types";

// API Request Schemas (contract-first)
export const courseCreateRequestSchema = z.object({
  titulo: z.string().trim().min(1, "O título é obrigatório"),
  descricao: z.string().trim().min(1, "A descrição é obrigatória"),
  categoria: z.string().trim().min(1, "A categoria é obrigatória"),
  cargaHoraria: z.string().trim().min(1, "A carga horária é obrigatória"),
  requerEndereco: z.boolean(),
  requerGenero: z.boolean(),
  requerIdade: z.boolean(),
}) satisfies z.ZodType<ICreateCoursePayload>;

export const courseUpdateRequestSchema = z
  .object({
    titulo: z.string().trim().min(1, "O título é obrigatório").optional(),
    descricao: z.string().trim().min(1, "A descrição é obrigatória").optional(),
    categoria: z.string().trim().min(1, "A categoria é obrigatória").optional(),
    cargaHoraria: z
      .string()
      .trim()
      .min(1, "A carga horária é obrigatória")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualização",
  }) satisfies z.ZodType<IUpdateCoursePayload>;

// Form Schemas (presentation layer)
export const courseCreateFormSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório"),
  description: z.string().trim().min(1, "A descrição é obrigatória"),
  category: z.string().trim().min(1, "A categoria é obrigatória"),
  hours: z.string().trim().min(1, "A carga horária é obrigatória"),
  requiredFields: z.array(z.string()),
  coverFile: imageFileSchema.optional(),
});

export const moduleImageSchema = z.object({
  imageFile: imageFileSchema.optional(),
});

export const courseModulesFormSchema = z.object({
  modules: z.array(moduleImageSchema).min(1, "Adicione ao menos um módulo"),
});

// Type exports for form components
export type CourseCreateFormValues = z.infer<typeof courseCreateFormSchema>;
export type CourseModulesFormValues = z.infer<typeof courseModulesFormSchema>;

export function toCourseCreateRequest(
  values: CourseCreateFormValues,
): ICreateCoursePayload {
  return {
    titulo: values.title,
    descricao: values.description,
    categoria: values.category,
    cargaHoraria: values.hours,
    requerEndereco: values.requiredFields.includes("Endereço"),
    requerGenero: values.requiredFields.includes("Gênero"),
    requerIdade: values.requiredFields.includes("Idade"),
  };
}
