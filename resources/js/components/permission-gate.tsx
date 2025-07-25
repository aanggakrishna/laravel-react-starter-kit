import React, { ReactNode } from 'react';
import { usePermission } from '../hooks/use-permission';

interface PermissionGateProps {
    children: ReactNode;
    permission?: string | string[];
    role?: string | string[];
    fallback?: ReactNode;
}

export function PermissionGate({ children, permission, role, fallback = null }: PermissionGateProps) {
    const { hasPermission, hasRole } = usePermission();

    // If both permission and role are provided, check both
    if (permission && role) {
        return (hasPermission(permission) && hasRole(role)) ? <>{children}</> : <>{fallback}</>;
    }

    // Check permission only
    if (permission) {
        return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
    }

    // Check role only
    if (role) {
        return hasRole(role) ? <>{children}</> : <>{fallback}</>;
    }

    // If neither permission nor role is provided, render children
    return <>{children}</>;
}