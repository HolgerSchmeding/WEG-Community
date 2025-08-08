
"use client"

import * as React from "react";
import { format } from "date-fns";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Building, PartyPopper, User, Info } from "lucide-react";
import { de } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const initialResidentAppointments = [
  {
    date: new Date(2025, 7, 28).toISOString(), // 28. August 2025
    title: "Grünschnitt-Sammlung",
    author: "Hausverwaltung",
    type: "Offiziell",
    description: "Bitte legen Sie Ihren Grünschnitt bis 07:00 Uhr morgens an der Sammelstelle bereit.",
    subline: "Entsorgung von Gartenabfällen."
  },
  {
    date: new Date(2025, 8, 3).toISOString(), // 3. September 2025
    title: "Einladung zum Parkfest",
    author: "WEG-Verwaltungsbeirat",
    type: "Gemeinschaft",
    description: "Wir laden alle Bewohnerinnen und Bewohner herzlich zum diesjährigen Parkfest auf der Festwiese ein. Für Speis und Trank ist gesorgt!",
    subline: "Gemütliches Beisammensein für alle Nachbarn."
  },
  {
    date: new Date(2025, 8, 15).toISOString(), // 15. September 2025
    title: "Hausversammlung - Jahresabschluss 2024",
    author: "Hausverwaltung",
    type: "Offiziell", 
    description: "Wichtige Versammlung zur Besprechung des Jahresabschlusses 2024 und Planung für 2025. Alle Eigentümer sind herzlich eingeladen.",
    subline: "Pflichttermin für alle Eigentümer."
  },
  {
    date: new Date(2025, 9, 10).toISOString(), // 10. Oktober 2025
    title: "Geburtstagsfeier Familie Schmidt (Whg. 12)",
    author: "Familie Schmidt",
    type: "Private Info",
    description: "Wir feiern einen runden Geburtstag. Es könnte am Abend etwas lauter werden. Wir bitten um Ihr Verständnis.",
    subline: "Info über mögliche Lärmbelästigung am Abend."
  },
];

const getTypeDetails = (type: string) => {
    switch(type) {
        case "Offiziell": return { icon: Building, color: 'secondary'};
        case "Gemeinschaft": return { icon: PartyPopper, color: 'bg-purple-100 text-purple-800' };
        case "Private Info": return { icon: User, color: 'bg-amber-100 text-amber-800' };
        default: return { icon: Info, color: 'outline'};
    }
}

interface Appointment {
  date: string;
  title: string;
  author: string;
  type: string;
  description: string;
  subline: string;
}

export default function ResidentAppointmentsPage() {
    const [appointments, setAppointments] = React.useState<Appointment[]>(initialResidentAppointments);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        try {
            const storedAppointments = localStorage.getItem("resident_appointments");
            if (storedAppointments) {
                setAppointments(JSON.parse(storedAppointments));
            } else {
                setAppointments(initialResidentAppointments);
                localStorage.setItem("resident_appointments", JSON.stringify(initialResidentAppointments));
            }
        } catch (error) {
            console.error("Could not load appointments from localStorage", error);
            setAppointments(initialResidentAppointments);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // Sort appointments by date
    const sortedAppointments = React.useMemo(() => 
        [...appointments].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [appointments]);


    return (
        <div className="container py-8">
            <BackButton text="Zurück zum Cockpit" />

            <div className="max-w-4xl mx-auto mt-8 text-center">
                <div className="inline-block bg-blue-500/20 p-4 rounded-lg mb-6">
                    <CalendarIcon className="h-10 w-10 text-blue-500" />
                </div>
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Termine für Bewohner
                </h1>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Eine Übersicht aller wichtigen Termine, Ankündigungen und gemeinschaftlichen Events in der Wohnanlage.
                </p>
            </div>

            <div className="max-w-3xl mx-auto mt-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Anstehende Termine & Events</CardTitle>
                        <CardDescription>
                            Alle zukünftigen Termine für die Bewohner der WEG Silberbach.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       {isLoading ? (
                         <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                         </div>
                       ) : sortedAppointments.length > 0 ? (
                            <ul className="space-y-4">
                                {sortedAppointments.map((item, index) => {
                                   const itemDate = new Date(item.date);
                                   const typeDetails = getTypeDetails(item.type);
                                   const Icon = typeDetails.icon;
                                   return (
                                    <li key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-background">
                                        <div className="flex flex-col items-center justify-center w-20 text-center bg-muted p-3 rounded-md">
                                           <span className="font-bold text-2xl">{format(itemDate, 'dd.')}</span>
                                           <span className="text-sm text-muted-foreground">{format(itemDate, 'MMM yyyy', { locale: de })}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                     <h3 className="font-headline font-semibold text-lg">{item.title}</h3>
                                                     <p className="text-sm text-muted-foreground mt-1">{item.subline}</p>
                                                </div>
                                                <Badge 
                                                    variant={typeDetails.color.startsWith('bg-') ? 'outline' : typeDetails.color as any}
                                                    className={typeDetails.color.startsWith('bg-') ? typeDetails.color : ''}
                                                >
                                                    <Icon className="mr-2 h-4 w-4" />
                                                    {item.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">{item.description}</p>
                                             <p className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
                                                <span>Organisiert von: {item.author}</span>
                                            </p>
                                        </div>
                                    </li>
                                )})}
                            </ul>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <div className="inline-block bg-muted p-4 rounded-lg mb-4">
                                    <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p>Derzeit sind keine spezifischen Termine für Bewohner geplant.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
