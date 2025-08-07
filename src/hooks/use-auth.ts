"use client";

import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'board' | 'owner' | 'resident' | 'hausverwalter';

interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  fullName: string; // Vollständiger Name für Tickets
}

/**
 * Hook zur Simulation der Benutzeranmeldung und Rollenverwaltung
 * In einer echten Anwendung würde dies über Firebase Auth oder ein anderes System erfolgen
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation der Benutzeranmeldung - lädt Rolle aus localStorage für Demo
    let demoRole: UserRole = 'resident'; // Standard
    
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('demo-role') as UserRole;
      if (savedRole && ['admin', 'board', 'owner', 'resident', 'hausverwalter'].includes(savedRole)) {
        demoRole = savedRole;
      }
    }

    const simulatedUser: User = {
      id: 'sim_user_1',
      name: 'Demo Benutzer',
      email: 'demo@silberbach.de',
      fullName: 'Herr Schmidt', // Für Konsistenz mit bestehenden Mock-Daten
      roles: [demoRole]
    };

    setTimeout(() => {
      setUser(simulatedUser);
      setIsLoading(false);
    }, 100);
  }, []);

  const hasRole = (role: UserRole): boolean => {
    return user?.roles.includes(role) ?? false;
  };

  const canCreateAnnouncements = (): boolean => {
    return hasRole('admin') || hasRole('board');
  };

  const canManageUsers = (): boolean => {
    return hasRole('admin');
  };

  const canViewBoardArea = (): boolean => {
    return hasRole('admin') || hasRole('board');
  };

  const canViewOwnerContent = (): boolean => {
    return hasRole('admin') || hasRole('board') || hasRole('owner');
  };

  const canCreateTicketsAsAdmin = (): boolean => {
    return hasRole('admin') || hasRole('hausverwalter');
  };

  const switchRole = (newRole: UserRole) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo-role', newRole);
      window.location.reload();
    }
  };

  return {
    user,
    isLoading,
    hasRole,
    canCreateAnnouncements,
    canManageUsers,
    canViewBoardArea,
    canViewOwnerContent,
    canCreateTicketsAsAdmin,
    switchRole,
  };
}
