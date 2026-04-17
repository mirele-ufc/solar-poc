import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import type { ProtectedRouteProps } from "./types";

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const currentUser = useAuthStore((state) => state.currentUser);

  // Session timeout: auto-logout após 30min de inatividade (OWASP A07)
  useSessionTimeout();

  if (!isLoggedIn || !currentUser) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
}
