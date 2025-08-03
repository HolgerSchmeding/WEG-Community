
"use client"

import * as React from "react";
import { format } from "date-fns";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Building, UserCheck, GanttChartSquare, ChevronRight, Info } from "lucide-react";
import { de } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const initialOwnerAppointments = [
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

const getTypeDetails = (type: string) => {
    switch(type) {
        case "Versammlung": return { icon: Building, color: "bg-blue-500" };
        case "Beiratssitzung": return { icon: UserCheck, color: "bg-purple-500" };
        case "Sonstiges": return { icon: Info, color: "bg-amber-500" };
        default: return { icon: GanttChartSquare, color: "bg-gray-500" };
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

export default function AppointmentsPage() {
    const [appointments, setAppointments] = React.useState<Appointment[]>(initialOwnerAppointments);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        try {
            const storedAppointments = localStorage.getItem("owner_appointments");
            if (storedAppointments) {
                setAppointments(JSON.parse(storedAppointments));
            } else {
                setAppointments(initialOwnerAppointments);
                localStorage.setItem("owner_appointments", JSON.stringify(initialOwnerAppointments));
            }
        } catch (error) {
            console.error("Could not load appointments from localStorage", error);
            setAppointments(initialOwnerAppointments);
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
                <div className="inline-block bg-purple-500/20 p-4 rounded-lg mb-6">
                    <CalendarIcon className="h-10 w-10 text-purple-500" />
                </div>
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Termine für Eigentümer
                </h1>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Eine Übersicht aller wichtigen Termine, die für Sie als Wohnungseigentümer relevant sind.
                </p>
            </div>

            <div className="max-w-3xl mx-auto mt-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Anstehende Termine</CardTitle>
                        <CardDescription>
                            Alle zukünftigen Termine für die Eigentümergemeinschaft.
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
                                   const Icon = getTypeDetails(item.type).icon;
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
                                                <Badge variant={item.type === 'Versammlung' ? 'secondary' : 'outline'} className={getTypeDetails(item.type).color.replace('bg-', 'bg-').replace('500', '500/10') + ' ' + getTypeDetails(item.type).color.replace('bg-', 'text-')}>
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
                                <p>Derzeit sind keine spezifischen Termine für Eigentümer geplant.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
