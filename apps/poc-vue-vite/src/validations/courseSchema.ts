import { z } from "zod";
import { imageFileSchema } from "./fileSchema";

// Form Schemas (presentation layer)
export const courseCreateFormSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório"),
  description: z.string().trim().min(1, "A descrição é obrigatória"),
  category: z.string().trim().min(1, "A categoria é obrigatória"),
  hours: z.string().trim().min(1, "A carga horária é obrigatória"),
  requiredFields: z.array(z.string()),
  coverFile: imageFileSchema, // Reutiliza a validação de arquivo que criamos
});

// Validação individual de cada módulo
export const moduleImageSchema = z.object({
  imageFile: imageFileSchema.optional(),
});

// Validação da lista de módulos
export const courseModulesFormSchema = z.object({
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

// Export de tipos para o TypeScript
export type CourseCreateFormValues = z.infer<typeof courseCreateFormSchema>;
export type CourseModulesFormValues = z.infer<typeof courseModulesFormSchema>;