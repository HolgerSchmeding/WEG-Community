
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BackButton } from '@/components/back-button';
import { 
  FileText,
  Archive,
  Calendar,
  Mail,
  Megaphone
} from 'lucide-react';

export default function OwnerCockpitPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <BackButton text="Zurück zur Übersicht" />
      </div>
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-block bg-primary/20 p-3 rounded-lg mb-4">
            <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Eigentümer-Cockpit
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
            Ihr zentraler Bereich für Dokumente, Termine und wichtige Informationen als Wohnungseigentümer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
        <DashboardCard href="/documents/archive" icon={Archive} title="Dokumentenarchiv" description="Alle wichtigen Unterlagen wie Protokolle, Beschlüsse und Abrechnungen." iconBg="bg-blue-500" />
        <DashboardCard href="/appointments" icon={Calendar} title="Termine & Events" description="Alle gemeinschaftlichen Termine und wichtigen Fristen im Blick." iconBg="bg-purple-500" />
        <DashboardCard href="/announcements" icon={Megaphone} title="Aushangbrett" description="Aktuelle Mitteilungen der Verwaltung und des Beirats einsehen." iconBg="bg-cyan-500" />
        <DashboardCard href="/contact" icon={Mail} title="Kontakt & Anfragen" description="Anliegen an die Verwaltung oder den Beirat senden." iconBg="bg-emerald-500" />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  iconBg: string;
}

function DashboardCard({ href, icon: Icon, title, description, iconBg }: DashboardCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all">
        <CardContent className="p-6 flex flex-col items-start text-left">
            <div className={`p-3 rounded-lg ${iconBg} mb-4`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-headline font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </CardContent>
      </Card>
    </Link>
  );
}
