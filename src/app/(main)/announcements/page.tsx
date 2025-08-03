
"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from "@/lib/firebase"; // Unsere neue Firebase-DB-Verbindung
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { BackButton } from "@/components/back-button";
import { Megaphone, AlertTriangle, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, UserSquare } from "lucide-react";


// Wir definieren einen Typ für unsere Aushänge, inkl. der ID
interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  author: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Diese Funktion lädt die Daten aus Firestore
    const fetchAnnouncements = async () => {
      try {
        // Wir erstellen eine Anfrage, die die Aushänge nach Erstellungsdatum sortiert
        const announcementsQuery = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(announcementsQuery);

        if (querySnapshot.empty) {
            setError("Es wurden keine Aushänge in der Datenbank gefunden.");
        }

        const fetchedAnnouncements = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || "Ohne Titel",
          content: doc.data().content || "Kein Inhalt",
          createdAt: doc.data().createdAt,
          author: doc.data().author || "Unbekannt",
        })) as Announcement[];

        setAnnouncements(fetchedAnnouncements);
      } catch (error) {
        console.error("Fehler beim Laden der Aushänge: ", error);
        setError("Ein Fehler ist beim Laden der Aushänge aufgetreten. Bitte versuchen Sie es später erneut.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []); // Der leere Array sorgt dafür, dass dies nur einmal beim Laden der Seite passiert

    const getAuthorIcon = (author: string) => {
        return author === "Hausverwaltung" ? Building : UserSquare;
    }

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
          Hier finden Sie alle aktuellen Mitteilungen der Hausverwaltung oder des Verwaltungsbeirats.
        </p>
      </div>
      
      <div className="flex justify-end max-w-3xl mx-auto mb-4">
        <Button asChild>
            <Link href="/admin/announcements/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Neuer Aushang
            </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto mt-12 space-y-6">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error ? (
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle />
                    Fehler beim Laden
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {error}
                  </p>
                   <p className="text-xs text-muted-foreground mt-4">Bitte überprüfen Sie, ob die Sammlung "announcements" in Firestore existiert, mindestens einen Eintrag enthält und die Firestore-Regeln den Lesezugriff erlauben.</p>
                </CardContent>
              </Card>
        ) : (
             announcements.map((item) => {
                const AuthorIcon = getAuthorIcon(item.author);
                return (
                    <Card key={item.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="font-headline text-xl mb-1">{item.title}</CardTitle>
                                    <CardDescription>{format(new Date(item.createdAt.seconds * 1000), 'PPP', { locale: de })}</CardDescription>
                                </div>
                                <Badge variant="outline" className="flex items-center gap-2">
                                   <AuthorIcon className="h-4 w-4" />
                                   {item.author}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line">{item.content}</p>
                        </CardContent>
                    </Card>
                )
            })
        )}
      </div>
    </div>
  );
}
