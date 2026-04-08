import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { enrollmentFormSchema, type EnrollmentFormValues } from '@/validations/enrollmentSchema';

/**
 * Composable para gerenciar formulário de inscrição com vee-validate + Zod
 *
 * Padrão:
 * - Schema validação: Zod ({@link enrollmentFormSchema})
 * - Error handling: vee-validate nativo
 * - Mensagens: Português (validação)
 *
 * Uso:
 * ```vue
 * const { values, errors, isSubmitting, handleSubmit } = useEnrollmentForm()
 * const onSubmit = handleSubmit(async (values) => {
 *   await api.post('/enroll', values)
 * })
 * ```
 */
export function useEnrollmentForm() {
  const isProcessing = ref(false);

  // Integração vee-validate + Zod
  const { values, errors, handleSubmit, resetForm, setFieldValue } = useForm({
    validationSchema: toTypedSchema(enrollmentFormSchema),
    initialValues: {
      firstName: '',
      lastName: '',
      city: '',
      gender: '',
    } as EnrollmentFormValues,
  });

  // Computed para verificar se há erros
  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0;
  });

  // Handler genérico para submit
  const handleEnrollmentSubmit = handleSubmit(async (formValues) => {
    isProcessing.value = true;
    try {
      console.log('Form submitted with values:', formValues);
      // Backend call seria aqui
      // await enrollmentService.enroll(formValues)
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
    handleEnrollmentSubmit,
    reset,
    setFieldValue,
  };
}
