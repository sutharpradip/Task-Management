"use client";

import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/utils/permissions";

/**
 * RoleGate component to conditionally render children based on user permissions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if permission matches
 * @param {string} props.permission - Required permission string (from PERMISSIONS)
 * @param {React.ReactNode} props.fallback - Optional content to render if no permission
 */
export const RoleGate = ({ children, permission, fallback = null }) => {
  const { profile, loading } = useAuth();

  if (loading) return null;

  const canAccess = hasPermission(profile?.role, permission);

  if (!canAccess) {
    return fallback;
  }

  return <>{children}</>;
};
