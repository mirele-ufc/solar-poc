import { z } from "zod";
import { imageFileSchema } from "./fileSchema";

export const createCourseSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório"),
  description: z.string().trim().min(1, "A descrição é obrigatória"),
  category: z.string().trim().min(1, "A categoria é obrigatória"),
  hours: z.string().trim().min(1, "A carga horária é obrigatória"),
  requiredFields: z.array(z.string()),
  coverFile: imageFileSchema,
});

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
