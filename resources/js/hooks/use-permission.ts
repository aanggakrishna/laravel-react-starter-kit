import { usePage } from '@inertiajs/react';
import { SharedData } from '../types';

export function usePermission() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const hasRole = (role: string | string[]): boolean => {
        if (!user || !user.roles) return false;
        
        const roles = Array.isArray(role) ? role : [role];
        return roles.some(r => user.roles.includes(r));
    };

    const hasPermission = (permission: string | string[]): boolean => {
        if (!user || !user.permissions) return false;
        
        const permissions = Array.isArray(permission) ? permission : [permission];
        return permissions.some(p => user.permissions.includes(p));
    };

    return {
        hasRole,
        hasPermission,
    };
}