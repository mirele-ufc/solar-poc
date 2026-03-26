import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore, type UserProfile } from "@/store/useAuthStore";

export interface ProtectedRouteProps {
  allowedRoles: ReadonlyArray<UserProfile["role"]>;
  children?: ReactNode;
  loginPath?: string;
}

const DEFAULT_LOGIN_PATH = "/";
const UNAUTHORIZED_PATH = "/unauthorized";

function isRoleAllowed(
  role: UserProfile["role"],
  allowedRoles: ReadonlyArray<UserProfile["role"]>,
): boolean {
  return allowedRoles.includes(role);
}

export function ProtectedRoute({
  allowedRoles,
  children,
  loginPath = DEFAULT_LOGIN_PATH,
}: ProtectedRouteProps) {
  const { isLoggedIn, currentUser } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to={loginPath} replace />;
  }

  if (!isRoleAllowed(currentUser.role, allowedRoles)) {
    return <Navigate to={UNAUTHORIZED_PATH} replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
}