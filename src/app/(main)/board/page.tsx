
"use client";

import Link from 'next/link';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, Users, MessageSquare, AlertCircle, FileText, FolderKanban, Mail, ArrowLeft, Calendar, UserCheck, Building, PartyPopper, User as UserIcon, Info, Scale } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const stats = [
  { title: "BENUTZER", value: "6", description: "von 6 gesamt", icon: Users, color: "text-blue-500" },
  { title: "AUSHÄNGE", value: "1", description: "aktive Mitteilungen", icon: MessageSquare, color: "text-green-500" },
  { title: "KONTAKTE", value: "1", description: "unbearbeitet", icon: AlertCircle, color: "text-red-500" },
  { title: "DOKUMENTE", value: "2", description: "gesamt", icon: FileText, color: "text-purple-500" }
];

const managementAreas = [
  { 
    title: "Aushang-Verwaltung", 
    description: "Mitteilungen erstellen, bearbeiten und verwalten",
    href: "/board/announcements",
    icon: MessageSquare,
    iconBg: "bg-blue-500"
  },
  { 
    title: "Dokumente verwalten", 
    description: "Wichtige Dokumente hochladen und organisieren",
    href: "/documents/archive",
    icon: FolderKanban,
    iconBg: "bg-green-500"
  },
  { 
    title: "Kontaktanfragen", 
    description: "Eingegangene Kontaktformulare bearbeiten",
    href: "/contact",
    icon: Mail,
    iconBg: "bg-red-500"
  },
  {
    title: "WEG Gesetz",
    description: "Rechtliche Hinweise & Leitfaden",
    href: "/board/law",
    icon: Scale,
    iconBg: "bg-orange-500"
  }
];


const residentAppointments = [
  {
    date: new Date(2024, 6, 28).toISOString(),
    title: "Grünschnitt-Sammlung",
    author: "Hausverwaltung",
    type: "Offiziell",
    description: "Bitte legen Sie Ihren Grünschnitt bis 07:00 Uhr morgens an der Sammelstelle bereit.",
    subline: "Entsorgung von Gartenabfällen."
  },
  {
    date: new Date(2024, 7, 3).toISOString(),
    title: "Einladung zum Parkfest",
    author: "WEG-Verwaltungsbeirat",
    type: "Gemeinschaft",
    description: "Wir laden alle Bewohnerinnen und Bewohner herzlich zum diesjährigen Parkfest auf der Festwiese ein. Für Speis und Trank ist gesorgt!",
    subline: "Gemütliches Beisammensein für alle Nachbarn."
  }
];

const ownerAppointments = [
  {
    date: new Date(2024, 8, 15).toISOString(), 
    title: "Ordentliche Eigentümerversammlung 2024",
    author: "Hausverwaltung",
    type: "Versammlung",
    description: "Die jährliche Eigentümerversammlung findet im Gemeinschaftsraum statt. Die offizielle Einladung mit Tagesordnung wurde fristgerecht versendet.",
    subline: "Jährliches Treffen aller Eigentümer."
  },
  {
    date: new Date(2024, 10, 5).toISOString(), 
    title: "Beiratssitzung Q4/2024",
    author: "WEG-Verwaltungsbeirat",
    type: "Beiratssitzung",
    description: "Der Verwaltungsbeirat bespricht die anstehenden Themen für das vierte Quartal, inkl. Budgetplanung 2025.",
    subline: "Interne Sitzung des Verwaltungsbeirats."
  },
  {
    date: new Date(2024, 6, 30).toISOString(), 
    title: "Begehung mit dem Dachdecker",
    author: "Hausverwaltung",
    type: "Sonstiges",
    description: "Vor-Ort-Termin mit der Firma Dachprofi zur Begutachtung der gemeldeten Schäden am Hauptdach.",
    subline: "Technische Begehung des Gemeinschaftseigentums."
  },
];

const combinedAppointments = [...residentAppointments, ...ownerAppointments];

const getTypeDetails = (type: string) => {
    switch(type) {
        case "Offiziell": return { icon: Building, color: 'secondary'};
        case "Gemeinschaft": return { icon: PartyPopper, color: 'bg-purple-100 text-purple-800' };
        case "Versammlung": return { icon: Users, color: 'bg-blue-100 text-blue-800' };
        case "Beiratssitzung": return { icon: UserCheck, color: 'bg-amber-100 text-amber-800' };
        default: return { icon: Info, color: 'outline'};
    }
}

interface Appointment {
  date: string;
  title: string;
  author: string;
  type: string;
  description: string;
  subline?: string;
}


export default function BoardPage() {
  const [upcomingAppointments, setUpcomingAppointments] = React.useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // In a real app, this data would come from a database
    const futureAppointments = combinedAppointments
        .filter((a) => new Date(a.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setUpcomingAppointments(futureAppointments.slice(0, 4));
    setIsLoading(false);
  }, []);

  return (
    <div className="container py-8 bg-slate-50">

      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
             <ArrowLeft className="mr-2 h-4 w-4" />
             Zurück zur Startseite
          </Link>
        </Button>
        <Badge variant="outline" className="text-base py-2 px-4 border-2">
            <Users className="mr-2 h-5 w-5" />
            WEG-Beirat
        </Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Management Areas */}
      <div>
        <h2 className="text-2xl font-bold font-headline mb-6">Verwaltungsbereiche</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementAreas.map((area) => (
                <Link href={area.href} key={area.title}>
                    <Card className="bg-white flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all">
                        <CardHeader>
                            <div className={`p-3 rounded-lg ${area.iconBg} w-fit mb-4`}>
                              <area.icon className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="font-headline text-lg">{area.title}</CardTitle>
                            <CardDescription>{area.description}</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
      </div>
      
       {/* Upcoming Appointments */}
       <div className="mt-12">
         <Card className="w-full bg-white">
            <CardHeader>
                <div>
                    <CardTitle className="font-headline text-lg">Nächste Termine</CardTitle>
                    <p className="text-sm text-muted-foreground">Alle wichtigen Termine der Bewohner & Eigentümer</p>
                </div>
            </CardHeader>
            <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : upcomingAppointments.length > 0 ? (
                    <ul className="space-y-4">
                        {upcomingAppointments.map((item, index) => {
                        const itemDate = new Date(item.date);
                        const typeDetails = getTypeDetails(item.type);
                        const Icon = typeDetails.icon;
                        return (
                            <li key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                                <div className="flex flex-col items-center justify-center w-16 text-center">
                                    <span className="font-bold text-lg">{format(itemDate, 'dd.')}</span>
                                    <span className="text-sm text-muted-foreground">{format(itemDate, 'MMM', { locale: de })}</span>
                                </div>
                                <div className="h-12 w-px bg-border" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.title}</p>
                                    {item.subline && <p className="text-sm text-muted-foreground">{item.subline}</p>}
                                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                        <Icon className="h-3 w-3" />
                                        <span>{item.author}</span>
                                    </p>
                                </div>
                                <Badge 
                                    variant={typeDetails.color.startsWith('bg-') ? 'outline' : typeDetails.color as any}
                                    className={typeDetails.color.startsWith('bg-') ? typeDetails.color : ''}
                                >
                                    {item.type}
                                </Badge>
                            </li>
                        )})}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-block bg-muted p-4 rounded-lg mb-4">
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">Derzeit sind keine Termine geplant.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
