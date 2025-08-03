
"use client";

import Link from "next/link";
import * as React from "react";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, ChevronRight, Eye, PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const allTickets = [
  {
    id: "T2024-07-001",
    subject: "Frage zur Nebenkostenabrechnung",
    requester: "Familie Mustermann",
    date: "19. Juli 2024",
    status: "Wartend",
    reminderDate: new Date(2024, 7, 1),
  },
  {
    id: "T2024-07-002",
    subject: "Defekte Glühbirne im Treppenhaus (3. OG)",
    requester: "Herr Schmidt",
    date: "18. Juli 2024",
    status: "Offen",
    reminderDate: null,
  },
  {
    id: "T2024-07-003",
    subject: "Meldung: Wasserfleck an der Garagendecke",
    requester: "Frau Meier",
    date: "15. Juli 2024",
    status: "Erledigt",
    reminderDate: null,
  },
   {
    id: "T2024-07-004",
    subject: "Regenrinne verstopft",
    requester: "Familie Huber",
    date: "14. Juli 2024",
    status: "Zur Erledigung",
    reminderDate: new Date(2024, 6, 25),
  },
];

// Simulate a logged-in user. In a real app, this would come from an auth context.
const currentUser = "Herr Schmidt";

const getStatusBadgeVariant = (status: string) => {
    switch(status) {
        case "Erledigt": return "default";
        case "In Bearbeitung": return "secondary";
        case "Wartend":
        case "Zur Erledigung":
        case "Offen": return "destructive";
        default: return "outline";
    }
}
const getStatusBadgeClass = (status: string) => {
    switch(status) {
        case "Erledigt": return "bg-green-600";
        case "In Bearbeitung": return "bg-blue-500 text-white";
        case "Wartend": return "bg-orange-500 text-white";
        case "Zur Erledigung": return "bg-yellow-500 text-yellow-950";
        case "Offen": return "bg-red-500 text-white";
        default: return "";
    }
}


export default function ContactManagementPage() {
    // For admins/board, show all. For users, filter by their name.
    // Here we simulate the user view.
    const [requests, setRequests] = React.useState(allTickets.filter(ticket => ticket.requester === currentUser));

  return (
    <div className="container py-8">
      <BackButton text="Zurück zum Cockpit" />

      <div className="max-w-6xl mx-auto mt-8">
        <div className="flex justify-between items-center mb-6">
            <div className="text-left">
                <h1 className="font-headline text-3xl font-bold tracking-tight">
                Meine Anfragen
                </h1>
                <p className="mt-1 text-muted-foreground">
                Senden Sie eine neue Anfrage oder sehen Sie den Status Ihrer bisherigen Anfragen ein.
                </p>
            </div>
             <Button asChild>
                <Link href="/contact/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Neue Anfrage erstellen
                </Link>
            </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Ihre Anfragen</CardTitle>
            <CardDescription>
                Hier sehen Sie eine Übersicht Ihrer offenen und abgeschlossenen Anfragen an die Verwaltung oder den Beirat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ticket-ID</TableHead>
                        <TableHead>Betreff</TableHead>
                        <TableHead>Erstellt</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Frist / Wiedervorlage</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell className="font-mono text-xs">{req.id}</TableCell>
                            <TableCell className="font-medium">{req.subject}</TableCell>
                            <TableCell>{req.date}</TableCell>
                            <TableCell>
                                <Badge variant={"outline"} className={getStatusBadgeClass(req.status)}>
                                    {req.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {req.reminderDate && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <CalendarIcon className="h-4 w-4" />
                                        {format(req.reminderDate, "dd.MM.yyyy")}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Menü öffnen</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/contact/${req.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ansehen & Bearbeiten
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             {requests.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <Mail className="mx-auto h-12 w-12 mb-4" />
                    <p>Sie haben noch keine Anfragen gestellt.</p>
                </div>
                )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
