import { ref, watch, onUnmounted } from "vue";
import { useAuthStore } from "@/store/useAuthStore";

/** Timeout de inatividade: 30 minutos (RN09) */
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
/** Intervalo de verificação: 1 minuto */
const CHECK_INTERVAL_MS = 60 * 1000;

const USER_ACTIVITY_EVENTS = [
  "mousemove",
  "keydown",
  "click",
  "scroll",
  "touchstart",
] as const;

/**
 * Composable de session timeout por inatividade (OWASP A07 — Authentication Hardening)
 * Auto-logout após 30 minutos sem interação do usuário.
 * Deve ser usado no App.vue ou layout autenticado.
 */
export function useSessionTimeout() {
  const authStore = useAuthStore();
  const lastActivity = ref(Date.now());
  let interval: ReturnType<typeof setInterval> | null = null;

  const resetTimer = () => {
    lastActivity.value = Date.now();
  };

  const startMonitoring = () => {
    USER_ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true }),
    );

    interval = setInterval(() => {
      const elapsed = Date.now() - lastActivity.value;
      if (elapsed > SESSION_TIMEOUT_MS) {
        stopMonitoring();
        authStore.logout();
        if (
          window.location.pathname !== "/" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/";
        }
      }
    }, CHECK_INTERVAL_MS);
  };

  const stopMonitoring = () => {
    USER_ACTIVITY_EVENTS.forEach((event) =>
      window.removeEventListener(event, resetTimer),
    );
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  // Observa mudanças no estado de autenticação
  watch(
    () => authStore.isAuthenticated,
    (isAuth) => {
      if (isAuth) {
        lastActivity.value = Date.now();
        startMonitoring();
      } else {
        stopMonitoring();
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    stopMonitoring();
  });
}
