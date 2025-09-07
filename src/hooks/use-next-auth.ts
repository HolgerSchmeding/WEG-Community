'use client';

import { useSession } from 'next-auth/react';
import { Role } from '@/lib/types/roles';

export function useNextAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    roles: (session?.user as any)?.roles || [],
  };
}

export function useRequireNextAuth() {
  const { user, isLoading, isAuthenticated } = useNextAuth();

  if (!isLoading && !isAuthenticated) {
    window.location.href = '/auth/signin';
  }

  return { user, isLoading, isAuthenticated };
}

export function useHasRole(requiredRoles: Role[]) {
  const { roles } = useNextAuth();
  return requiredRoles.some(role => roles.includes(role));
}

export function useIsAdmin() {
  return useHasRole(['admin']);
}

export function useIsBoardMember() {
  return useHasRole(['admin', 'board']);
}
