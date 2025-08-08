
"use client";

import Link from 'next/link';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/back-button';
import { 
  FileText,
  Archive,
  Calendar,
  Mail,
  Megaphone,
  Building,
  PartyPopper,
  Users,
  UserCheck,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function OwnerCockpitPage() {
  const [upcomingAppointments, setUpcomingAppointments] = React.useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Eigentümer-spezifische Termine (kombiniert aus den anderen Ansichten)
    const ownerAppointments = [
      {
        date: new Date(2025, 8, 15).toISOString(), // 15. September 2025
        title: "Ordentliche Eigentümerversammlung 2025",
        author: "Hausverwaltung",
        type: "Versammlung",
        description: "Die jährliche Eigentümerversammlung findet im Gemeinschaftsraum statt.",
        subline: "Jährliches Treffen aller Eigentümer."
      },
      {
        date: new Date(2025, 9, 5).toISOString(), // 5. Oktober 2025
        title: "Beiratssitzung Q4/2025",
        author: "WEG-Verwaltungsbeirat",
        type: "Beiratssitzung",
        description: "Der Verwaltungsbeirat bespricht die anstehenden Themen für das vierte Quartal.",
        subline: "Interne Sitzung des Verwaltungsbeirats."
      },
      {
        date: new Date(2025, 8, 30).toISOString(), // 30. September 2025
        title: "Begehung mit dem Dachdecker",
        author: "Hausverwaltung",
        type: "Offiziell",
        description: "Vor-Ort-Termin mit der Firma Dachprofi zur Begutachtung der gemeldeten Schäden am Hauptdach.",
        subline: "Technische Begehung des Gemeinschaftseigentums."
      },
      {
        date: new Date(2025, 8, 3).toISOString(), // 3. September 2025
        title: "Einladung zum Parkfest",
        author: "WEG-Verwaltungsbeirat",
        type: "Gemeinschaft",
        description: "Wir laden alle Bewohnerinnen und Bewohner herzlich zum diesjährigen Parkfest auf der Festwiese ein.",
        subline: "Gemütliches Beisammensein für alle Nachbarn."
      }
    ];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureAppointments = ownerAppointments
        .filter((a) => new Date(a.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setUpcomingAppointments(futureAppointments);
    setIsLoading(false);
  }, []);
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

      {/* Upcoming Appointments */}
      <div className="mt-12">
        <Card className="w-full bg-white">
           <CardHeader>
               <div>
                   <CardTitle className="font-headline text-lg">Nächste Termine</CardTitle>
                   <p className="text-sm text-muted-foreground">Ihre wichtigsten Termine als Eigentümer</p>
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
