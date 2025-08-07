"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole, useAuth } from "@/hooks/use-auth";
import { Shield, User, Settings, Building2, Home, Briefcase } from "lucide-react";
import Link from "next/link";

export default function RoleTestPage() {
  const { user } = useAuth();
  const currentRole = user?.roles?.[0] || 'resident';

  const roles: { role: UserRole; name: string; icon: React.ElementType; description: string }[] = [
    {
      role: 'admin',
      name: 'Hausverwaltung',
      icon: Settings,
      description: 'Vollzugriff auf alle Bereiche, kann Aushänge erstellen und Benutzer verwalten'
    },
    {
      role: 'hausverwalter',
      name: 'Hausverwalter (Außendienst)',
      icon: Briefcase,
      description: 'Kann vor Ort Tickets erstellen, Zugriff auf Admin-Bereich'
    },
    {
      role: 'board', 
      name: 'Verwaltungsbeirat',
      icon: Shield,
      description: 'Kann Aushänge erstellen, Zugriff auf Beiratsbereich'
    },
    {
      role: 'owner',
      name: 'Wohnungseigentümer', 
      icon: Building2,
      description: 'Kann Aushänge nur lesen, Zugriff auf Eigentümerinhalte'
    },
    {
      role: 'resident',
      name: 'Bewohner',
      icon: Home,
      description: 'Kann Aushänge nur lesen, Grundzugriff'
    }
  ];

  // Diese Funktion würde in der echten App die Benutzerrolle ändern
  const switchRole = (role: UserRole) => {
    // In der echten App würden Sie hier den Auth-State aktualisieren
    localStorage.setItem('demo-role', role);
    window.location.reload(); // Seite neu laden für Demo-Zwecke
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Rollen-Test für Entwicklung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Diese Seite ermöglicht es Ihnen, zwischen verschiedenen Benutzerrollen zu wechseln, 
              um die Berechtigungen zu testen.
            </p>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900">
                Aktuelle Rolle: <Badge variant="default">{roles.find(r => r.role === currentRole)?.name || currentRole}</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map(({ role, name, icon: Icon, description }) => (
                <Card key={role} className={currentRole === role ? 'ring-2 ring-primary' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5" />
                      {name}
                      {currentRole === role && (
                        <Badge variant="default">Aktiv</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {description}
                    </p>
                    <Button 
                      onClick={() => switchRole(role)}
                      variant={currentRole === role ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      {currentRole === role ? 'Aktuelle Rolle' : 'Rolle wechseln'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-3">Test-Links:</h3>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/announcements">Aushangbrett</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Admin-Bereich</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/board">Beirats-Bereich</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
