"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole, useAuth } from "@/hooks/use-auth";
import { Shield, User, Settings, Building2, Home, Briefcase, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/back-button";

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
    localStorage.setItem('demo-role', role);
    window.location.reload();
  };

  // Bestimme die Startseite basierend auf der aktuellen Rolle
  const getDefaultPageForRole = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'hausverwalter':
        return '/admin';
      case 'board':
        return '/board';
      case 'owner':
        return '/owner';
      case 'resident':
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation zurück zur Anwendung */}
        <div className="mb-6">
          <Button asChild className="mb-4" size="lg">
            <Link href={getDefaultPageForRole(currentRole)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Anwendung ({roles.find(r => r.role === currentRole)?.name})
            </Link>
          </Button>
        </div>

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
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm font-medium text-green-900 flex items-center gap-2">
                <Badge variant="default">{roles.find(r => r.role === currentRole)?.name || currentRole}</Badge>
                ist aktuell aktiv
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map(({ role, name, icon: Icon, description }) => (
                <Card key={role} className={currentRole === role ? 'ring-2 ring-primary bg-primary/5' : ''}>
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
                      disabled={currentRole === role}
                    >
                      {currentRole === role ? 'Aktuelle Rolle' : 'Rolle wechseln'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-3">Schnellzugriff für Tests:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <Link href="/announcements">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Aushangbrett
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <Link href="/admin">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Admin-Bereich
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <Link href="/board">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Beirats-Bereich
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zusätzlicher Hinweis */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
            <Settings className="h-4 w-4" />
            Demo-Modus: Rollenwechsel für Entwicklung und Präsentation
          </div>
        </div>
      </div>
    </div>
  );
}
