import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { IUserSession } from "@ava-poc/types";

export interface ProtectedRouteProps {
  allowedRoles: ReadonlyArray<IUserSession["role"]>;
  children?: ReactNode;
  loginPath?: string;
}

const DEFAULT_LOGIN_PATH = "/";
const UNAUTHORIZED_PATH = "/unauthorized";

function isRoleAllowed(
  role: IUserSession["role"],
  allowedRoles: ReadonlyArray<IUserSession["role"]>,
): boolean {
  return allowedRoles.includes(role);
}

export function ProtectedRoute({
  allowedRoles,
  children,
  loginPath = DEFAULT_LOGIN_PATH,
}: ProtectedRouteProps) {
  const { isLoggedIn, currentUser } = useAuthStore();

  if (!isLoggedIn || !currentUser) {
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
