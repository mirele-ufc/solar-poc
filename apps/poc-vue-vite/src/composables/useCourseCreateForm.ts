import { ref, computed } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  courseCreateFormSchema,
  type CourseCreateFormValues,
} from "@/validations/courseSchema";

/**
 * Composable para gerenciar formulário de criar curso com vee-validate + Zod
 *
 * Padrão:
 * - Schema validação: Zod ({@link courseCreateFormSchema})
 * - Error handling: vee-validate nativo
 * - Mensagens: Português (validação)
 *
 * Uso:
 * ```vue
 * const { values, errors, handleSubmit } = useCourseCreateForm()
 * const onSubmit = handleSubmit(async (values) => {
 *   await courseService.createCourse(values)
 * })
 * ```
 */
export function useCourseCreateForm() {
  const isProcessing = ref(false);

  // Integração vee-validate + Zod
  const { values, errors, handleSubmit, resetForm, setFieldValue } = useForm({
    validationSchema: toTypedSchema(courseCreateFormSchema),
    initialValues: {
      title: "",
      description: "",
      category: "",
      hours: "",
      requiredFields: [],
      coverFile: undefined,
    } as CourseCreateFormValues,
  });

  // Computed para verificar se há erros
  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0;
  });

  // Handler genérico para submit
  const handleCourseCreateSubmit = handleSubmit(async (formValues) => {
    isProcessing.value = true;
    try {
      console.log("Course form submitted with values:", formValues);
      // Backend call seria aqui
      // await courseService.createCourse(formValues)
    } finally {
      isProcessing.value = false;
    }
  });

  // Reset manual
  const reset = () => {
    resetForm();
    isProcessing.value = false;
  };

  return {
    // Estado
    values,
    errors,
    hasErrors,
    isProcessing,

    // Métodos
    handleCourseCreateSubmit,
    reset,
    setFieldValue,
  };
}
