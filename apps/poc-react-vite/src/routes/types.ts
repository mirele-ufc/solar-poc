import type { ReactNode } from "react";

export type UserRole = "admin" | "professor" | "student";

export interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles: ReadonlyArray<UserRole>;
  redirectTo?: string;
}

export interface RoleBasedRouteProps extends ProtectedRouteProps {
  allowedRoles: UserRole[];
}
