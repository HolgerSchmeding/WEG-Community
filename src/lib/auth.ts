import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { Role } from '@/lib/types/roles';
import { redirect } from 'next/navigation';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/signin');
  }
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  const userRoles = (session.user as any)?.roles || ['resident'];

  const hasPermission = allowedRoles.some(role => userRoles.includes(role));
  if (!hasPermission) {
    redirect('/unauthorized');
  }

  return session;
}

export async function requireAdmin() {
  return await requireRole(['admin']);
}

export async function requireBoard() {
  return await requireRole(['admin', 'board']);
}

export function hasRole(userRoles: Role[], requiredRoles: Role[]): boolean {
  return requiredRoles.some(role => userRoles.includes(role));
}

export function isAdmin(userRoles: Role[]): boolean {
  return userRoles.includes('admin');
}

export function isBoardMember(userRoles: Role[]): boolean {
  return userRoles.includes('board') || userRoles.includes('admin');
}
