import { z } from "zod";
import { imageFileSchema } from "./fileSchema";
import type { ICreateCoursePayload, IUpdateCoursePayload } from "@ava-poc/types";

export const createCourseSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório"),
  description: z.string().trim().min(1, "A descrição é obrigatória"),
  category: z.string().trim().min(1, "A categoria é obrigatória"),
  hours: z.string().trim().min(1, "A carga horária é obrigatória"),
  requiredFields: z.array(z.string()),
  coverFile: imageFileSchema,
});

export const courseCreateSchema = z.object({
  titulo: z.string().trim().min(1, "O título é obrigatório"),
  descricao: z.string().trim().min(1, "A descrição é obrigatória"),
  categoria: z.string().trim().min(1, "A categoria é obrigatória"),
  cargaHoraria: z.string().trim().min(1, "A carga horária é obrigatória"),
  requerEndereco: z.boolean().optional(),
  requerGenero: z.boolean().optional(),
  requerIdade: z.boolean().optional(),
}) satisfies z.ZodType<ICreateCoursePayload>;

export const courseUpdateSchema = z
  .object({
    titulo: z.string().trim().min(1, "O título é obrigatório").optional(),
    descricao: z.string().trim().min(1, "A descrição é obrigatória").optional(),
    categoria: z.string().trim().min(1, "A categoria é obrigatória").optional(),
    cargaHoraria: z.string().trim().min(1, "A carga horária é obrigatória").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualização",
  }) satisfies z.ZodType<IUpdateCoursePayload>;

export const moduleImageSchema = z.object({
  imageFile: imageFileSchema.optional(),
});

export const createModulesSchema = z.object({
  modules: z
    .array(moduleImageSchema)
    .min(1, "Adicione ao menos um módulo")
    .superRefine((modules, ctx) => {
      modules.forEach((moduleItem, index) => {
        if (!moduleItem.imageFile) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Imagem obrigatória",
            path: [index, "imageFile"],
          });
        }
      });
    }),
});

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;
export type CreateModulesFormValues = z.infer<typeof createModulesSchema>;

export function toCreateCoursePayload(
  values: CreateCourseFormValues,
): ICreateCoursePayload {
  return {
    titulo: values.title,
    descricao: values.description,
    categoria: values.category,
    cargaHoraria: values.hours,
    requerEndereco: values.requiredFields.includes("endereco"),
    requerGenero: values.requiredFields.includes("genero"),
    requerIdade: values.requiredFields.includes("idade"),
  };
}
