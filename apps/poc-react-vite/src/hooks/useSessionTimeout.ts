import { useEffect, useCallback, useRef } from "react";
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
 * Hook de session timeout por inatividade (OWASP A07 — Authentication Hardening)
 * Auto-logout após 30 minutos sem interação do usuário.
 * Deve ser usado no componente de rota protegida ou layout autenticado.
 */
export function useSessionTimeout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Registra listeners de atividade do usuário
    USER_ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true }),
    );

    // Verifica periodicamente se a sessão expirou
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed > SESSION_TIMEOUT_MS) {
        logout();
        if (
          window.location.pathname !== "/" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/";
        }
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      USER_ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
      clearInterval(interval);
    };
  }, [isLoggedIn, logout, resetTimer]);
}
