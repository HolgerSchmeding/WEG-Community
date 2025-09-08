'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { BackButton } from '@/components/back-button';
import { Megaphone, AlertTriangle, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, UserSquare } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { LoadingState } from '@/components/ui/loading-state';
import { NoAnnouncements } from '@/components/ui/empty-state';

// Mock-Daten für Aushänge - mit sicheren Zeitstempeln
const mockAnnouncements = [
  {
    id: '1',
    title: 'Hausordnung - Reminder für alle Bewohner',
    content:
      'Liebe Bewohner,\n\nbitte beachten Sie die folgenden Punkte unserer Hausordnung:\n\n• Nachtruhe von 22:00 - 06:00 Uhr\n• Mülltonnen nur am Abholtag bereitstellen\n• Fahräder nur in den dafür vorgesehenen Bereichen abstellen\n• Hausflure und Treppenhäuser freihalten\n\nVielen Dank für Ihr Verständnis!\n\nIhre Hausverwaltung',
    createdAt: '2025-08-05T10:00:00.000Z',
    author: 'Hausverwaltung',
  },
  {
    id: '2',
    title: 'Ankündigung: Herbstputz im September',
    content:
      'Sehr geehrte Eigentümer und Mieter,\n\nhiermit informieren wir Sie über den geplanten Herbstputz:\n\n📅 Zeitraum: 10. - 14. September 2025\n🕐 Arbeitszeiten: 08:00 - 16:00 Uhr\n\nBitte beachten Sie:\n• Fenster sollten geschlossen bleiben\n• Balkon-/Terrassenmöbel nach Möglichkeit abräumen\n• Parkplätze vor dem Gebäude ggf. kurzzeitig gesperrt\n\nBei Fragen wenden Sie sich gerne an die Hausverwaltung.\n\nMit freundlichen Grüßen\nIhr Verwaltungsbeirat',
    createdAt: '2025-08-03T14:30:00.000Z',
    author: 'Verwaltungsbeirat',
  },
  {
    id: '3',
    title: 'Einladung zur Eigentümerversammlung 2025',
    content:
      'Sehr geehrte Damen und Herren,\n\nhiermit laden wir Sie herzlich zur jährlichen Eigentümerversammlung ein:\n\n📅 Datum: 15. September 2025\n🕕 Uhrzeit: 18:00 Uhr\n📍 Ort: Gemeinschaftsraum im Erdgeschoss\n\nTagesordnung:\n1. Bericht der Hausverwaltung\n2. Jahresabrechnung 2024\n3. Wirtschaftsplan 2026\n4. Instandhaltungsmaßnahmen\n5. Verschiedenes\n\nDie vollständigen Unterlagen erhalten Sie separat per Post.\n\nWir freuen uns auf Ihr Erscheinen!\n\nIhre Hausverwaltung Schmidt & Partner',
    createdAt: '2025-08-01T16:00:00.000Z',
    author: 'Hausverwaltung',
  },
];

// Wir definieren einen Typ für unsere Aushänge, inkl. der ID
interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { canCreateAnnouncements, user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Mock-Daten laden (simuliert Firebase-Aufruf)
    const fetchAnnouncements = async () => {
      try {
        // Simuliere Lade-Zeit
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock-Daten nach Datum sortieren (neueste zuerst)
        const sortedAnnouncements = [...mockAnnouncements].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setAnnouncements(sortedAnnouncements);
      } catch (error) {
        console.error('Fehler beim Laden der Aushänge: ', error);
        setError(
          'Ein Fehler ist beim Laden der Aushänge aufgetreten. Bitte versuchen Sie es später erneut.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []); // Der leere Array sorgt dafür, dass dies nur einmal beim Laden der Seite passiert

  const getAuthorIcon = (author: string) => {
    return author === 'Hausverwaltung' ? Building : UserSquare;
  };

  return (
    <div className="container py-8">
      <BackButton text="Zurück zum Cockpit" />

      <div className="max-w-4xl mx-auto mt-8 text-center">
        <div className="inline-block bg-cyan-500/20 p-4 rounded-lg mb-6">
          <Megaphone className="h-10 w-10 text-cyan-500" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Aushangbrett
        </h1>
        <p className="mt-2 text-muted-foreground">
          Hier finden Sie alle aktuellen Mitteilungen der Hausverwaltung oder
          des Verwaltungsbeirats.
        </p>

        {/* Anzeige der aktuellen Benutzerrolle (nur in der Entwicklung) */}
        {process.env.NODE_ENV === 'development' && user && (
          <div className="mt-4 p-2 bg-blue-50 text-blue-700 text-sm rounded">
            Demo-Benutzer: {user.name} | Rollen: {user.roles.join(', ')}
            {canCreateAnnouncements() && ' | ✅ Kann Aushänge erstellen'}
          </div>
        )}
      </div>

      {/* Button nur für Admin und Beirat anzeigen */}
      {canCreateAnnouncements() && (
        <div className="flex justify-end max-w-3xl mx-auto mb-4">
          <Button asChild>
            <Link href="/admin/announcements/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Neuer Aushang
            </Link>
          </Button>
        </div>
      )}

      <div className="max-w-3xl mx-auto mt-12 space-y-6">
        {loading ? (
          <LoadingState type="list" items={3} />
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle />
                Fehler beim Laden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
              <p className="text-xs text-muted-foreground mt-4">
                Bitte überprüfen Sie, ob die Sammlung "announcements" in
                Firestore existiert, mindestens einen Eintrag enthält und die
                Firestore-Regeln den Lesezugriff erlauben.
              </p>
            </CardContent>
          </Card>
        ) : announcements.length > 0 ? (
          announcements.map(item => {
            const AuthorIcon = getAuthorIcon(item.author);
            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-headline text-xl mb-1">
                        {item.title}
                      </CardTitle>
                      <CardDescription>
                        {typeof window !== 'undefined'
                          ? format(new Date(item.createdAt), 'PPP', {
                              locale: de,
                            })
                          : new Date(item.createdAt).toLocaleDateString(
                              'de-DE'
                            )}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <AuthorIcon className="h-4 w-4" />
                      {item.author}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <NoAnnouncements
            onCreateNew={
              canCreateAnnouncements()
                ? () => (window.location.href = '/admin/announcements/new')
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
