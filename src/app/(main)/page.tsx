'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Home,
  BookOpen,
  Megaphone,
  Mail,
  Store,
  Calendar,
  CheckSquare,
  Building,
  PartyPopper,
  User,
  ChevronRight,
  Info,
} from 'lucide-react';
import { BackButton } from '@/components/back-button';
import ClientRef from '@/components/_client-ref';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const initialAppointments = [
  {
    date: new Date(2024, 6, 28).toISOString(),
    title: 'Grünschnitt-Sammlung',
    author: 'Hausverwaltung',
    type: 'Offiziell',
    description:
      'Bitte legen Sie Ihren Grünschnitt bis 07:00 Uhr morgens an der Sammelstelle bereit.',
    subline: 'Entsorgung von Gartenabfällen.',
  },
  {
    date: new Date(2024, 7, 3).toISOString(),
    title: 'Einladung zum Parkfest',
    author: 'WEG-Verwaltungsbeirat',
    type: 'Gemeinschaft',
    description:
      'Wir laden alle Bewohnerinnen und Bewohner herzlich zum diesjährigen Parkfest auf der Festwiese ein. Für Speis und Trank ist gesorgt!',
    subline: 'Gemütliches Beisammensein für alle Nachbarn.',
  },
  {
    date: new Date(2024, 7, 10).toISOString(),
    title: 'Geburtstagsfeier Familie Schmidt (Whg. 12)',
    author: 'Familie Schmidt',
    type: 'Private Info',
    description:
      'Wir feiern einen runden Geburtstag. Es könnte am Abend etwas lauter werden. Wir bitten um Ihr Verständnis.',
    subline: 'Info über mögliche Lärmbelästigung am Abend.',
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Offiziell':
      return Building;
    case 'Gemeinschaft':
      return PartyPopper;
    case 'Private Info':
      return User;
    default:
      return Info;
  }
};

interface Appointment {
  date: string;
  title: string;
  author: string;
  type: string;
  description: string;
  subline?: string;
}

export default function DashboardPage() {
  const [upcomingAppointments, setUpcomingAppointments] = React.useState<
    Appointment[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    try {
      const storedAppointments = localStorage.getItem('appointments');
      if (storedAppointments) {
        setUpcomingAppointments(
          JSON.parse(storedAppointments)
            .filter((a: Appointment) => new Date(a.date) >= new Date())
            .sort(
              (a: Appointment, b: Appointment) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 3)
        );
      } else {
        setUpcomingAppointments(
          initialAppointments
            .filter((a: Appointment) => new Date(a.date) >= new Date())
            .sort(
              (a: Appointment, b: Appointment) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 3)
        );
        localStorage.setItem(
          'appointments',
          JSON.stringify(initialAppointments)
        );
      }
    } catch (error) {
      console.error('Could not load appointments from localStorage', error);
      setUpcomingAppointments(
        initialAppointments
          .filter((a: Appointment) => new Date(a.date) >= new Date())
          .sort(
            (a: Appointment, b: Appointment) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 3)
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="container py-8">
      <ClientRef />
      <BackButton text="Zurück zur Übersicht" />

      <div className="text-center max-w-2xl mx-auto my-8">
        <div className="inline-block bg-primary/20 p-3 rounded-lg mb-4">
          <Home className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Bewohner-Cockpit
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Hier finden Sie alle wichtigen Informationen und Services für Ihren
          Alltag in der Wohnanlage Silberbach.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <DashboardCard
          href="/documents"
          icon={BookOpen}
          title="Hausordnung"
          description="Die wichtigsten Regeln für das Zusammenleben"
          iconBg="bg-primary"
        />
        <DashboardCard
          href="/announcements"
          icon={Megaphone}
          title="Aushangbrett"
          description="Aktuelle Mitteilungen und Ankündigungen"
          iconBg="bg-cyan-500"
        />
        <DashboardCard
          href="/contact"
          icon={Mail}
          title="Kontakt & Anfragen"
          description="Anliegen an die Hausverwaltung senden"
          iconBg="bg-emerald-500"
        />
        <DashboardCard
          href="/marketplace"
          icon={Store}
          title="Nachbarschafts-Marktplatz"
          description="Tauschen, helfen und finden"
          iconBg="bg-purple-500"
        />
        <DashboardCard
          href="/resident-appointments"
          icon={Calendar}
          title="Termine & Events"
          description="Alle Termine und Events im Blick"
          iconBg="bg-blue-500"
        />
        <DashboardCard
          href="/surveys"
          icon={CheckSquare}
          title="Umfragen & Abstimmungen"
          description="An gemeinschaftlichen Entscheidungen teilnehmen"
          iconBg="bg-orange-500"
        />
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-lg">
              Nächste Termine
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Wichtige Termine und Aktivitäten in der Wohnanlage
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/resident-appointments">
              Alle Termine
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
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
                const Icon = getTypeIcon(item.type);
                return (
                  <li
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex flex-col items-center justify-center w-16 text-center">
                      <span className="font-bold text-lg">
                        {format(itemDate, 'dd.')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(itemDate, 'MMM', { locale: de })}
                      </span>
                    </div>
                    <div className="h-12 w-px bg-border" />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.title}</p>
                      {item.subline && (
                        <p className="text-sm text-muted-foreground">
                          {item.subline}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <Icon className="h-3 w-3" />
                        <span>{item.author}</span>
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.type === 'Offiziell' ? 'secondary' : 'outline'
                      }
                      className={
                        item.type === 'Gemeinschaft'
                          ? 'bg-purple-100 text-purple-800'
                          : item.type === 'Private Info'
                            ? 'bg-amber-100 text-amber-800'
                            : ''
                      }
                    >
                      {item.type}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block bg-muted p-4 rounded-lg mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Derzeit sind keine Termine geplant.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardCard({
  href,
  icon: Icon,
  title,
  description,
  iconBg,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  iconBg: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all">
        <CardContent className="p-6 flex items-center gap-6">
          <div className={`p-3 rounded-lg ${iconBg}`}>
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
