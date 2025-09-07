'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Info } from 'lucide-react';
import { useAuth, UserRole } from '@/hooks/use-auth';

interface PermissionGateProps {
  requiredRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showMessage?: boolean;
}

/**
 * Komponente für rollenbasierte Zugriffskontrolle
 * Zeigt Inhalt nur an, wenn der Benutzer die erforderlichen Rollen hat
 */
export function PermissionGate({
  requiredRoles,
  children,
  fallback,
  showMessage = true,
}: PermissionGateProps) {
  const { user, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return null; // Oder einen Loading-Spinner
  }

  if (!user) {
    return showMessage ? (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <Shield className="h-5 w-5" />
            Anmeldung erforderlich
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bitte melden Sie sich an, um diesen Inhalt zu sehen.
          </p>
        </CardContent>
      </Card>
    ) : (
      fallback || null
    );
  }

  const userHasRequiredRole = requiredRoles.some(role => hasRole(role));

  if (!userHasRequiredRole) {
    return showMessage ? (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Shield className="h-5 w-5" />
            Keine Berechtigung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            Sie haben keine Berechtigung für diesen Bereich.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Erforderliche Rollen:</p>
            <div className="flex gap-2 flex-wrap">
              {requiredRoles.map(role => (
                <Badge key={role} variant="outline">
                  {role === 'admin' && 'Hausverwaltung'}
                  {role === 'board' && 'Verwaltungsbeirat'}
                  {role === 'owner' && 'Wohnungseigentümer'}
                  {role === 'resident' && 'Bewohner'}
                </Badge>
              ))}
            </div>
            <p className="text-sm font-medium mt-2">Ihre Rollen:</p>
            <div className="flex gap-2 flex-wrap">
              {user.roles.map(role => (
                <Badge key={role} variant="secondary">
                  {role === 'admin' && 'Hausverwaltung'}
                  {role === 'board' && 'Verwaltungsbeirat'}
                  {role === 'owner' && 'Wohnungseigentümer'}
                  {role === 'resident' && 'Bewohner'}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    ) : (
      fallback || null
    );
  }

  return <>{children}</>;
}
