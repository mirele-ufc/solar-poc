import { ref } from 'vue'
import { useAuthStore } from '../store/useAuthStore'
import { useRouter } from 'vue-router'

export function useLogin() {
  const authStore = useAuthStore()
  const router = useRouter()

  const username = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const showErrors = ref(false)
  const generalError = ref('')

  const usernameInvalid = ref(false)
  const passwordInvalid = ref(false)

  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  function validate(): boolean {
    usernameInvalid.value = !username.value.trim()
    passwordInvalid.value = !password.value.trim()
    return !usernameInvalid.value && !passwordInvalid.value
  }

  async function handleSubmit() {
    if (!validate()) {
      generalError.value = 'Por favor, preencha os campos destacados para acessar'
      showErrors.value = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const ok = authStore.login(username.value.trim(), password.value)
    if (ok) {
      generalError.value = ''
      showErrors.value = false
      router.push('/courses')
    } else {
      generalError.value = 'Usuário ou senha incorretos'
      showErrors.value = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return {
    username,
    password,
    showPassword,
    showErrors,
    generalError,
    usernameInvalid,
    passwordInvalid,
    togglePassword,
    handleSubmit,
  }
}