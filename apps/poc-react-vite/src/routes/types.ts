import type { ReactNode } from "react";
import type { UserRole, ProtectedRouteProps as BaseProtectedRouteProps, RoleBasedRouteProps } from "@ava-poc/types";

export type { UserRole, RoleBasedRouteProps };

export interface ProtectedRouteProps extends BaseProtectedRouteProps {
  children?: ReactNode;
}
