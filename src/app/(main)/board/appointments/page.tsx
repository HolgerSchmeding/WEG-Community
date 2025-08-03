
"use client";

import * as React from "react";
import Link from 'next/link';
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, KeyRound, Users, UserCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { de } from "date-fns/locale";

type Role = "owner" | "resident" | "board";

const roleIcons: Record<Role, React.ElementType> = {
    owner: KeyRound,
    resident: Users,
    board: UserCheck
}
const roleLabels: Record<Role, string> = {
    owner: "Eigentümer",
    resident: "Bewohner",
    board: "Beirat"
}

const mockAppointments = [
  {
    id: "1",
    title: "Ordentliche Eigentümerversammlung 2024",
    date: new Date(2024, 8, 15),
    status: "Anstehend",
    visibility: ["owner", "board"] as Role[],
  },
  {
    id: "2",
    title: "Sommerfest der Nachbarschaft",
    date: new Date(2024, 7, 3),
    status: "Anstehend",
    visibility: ["resident", "owner", "board"] as Role[],
  },
  {
    id: "3",
    title: "Wartung der Heizungsanlage",
    date: new Date(2024, 6, 25),
    status: "Vergangen",
    visibility: ["resident", "owner", "board"] as Role[],
  },
  {
    id: "4",
    title: "Beiratssitzung Q3 (Entwurf)",
    date: new Date(2024, 8, 1),
    status: "Entwurf",
    visibility: ["board"] as Role[],
  },
];

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = React.useState(mockAppointments);

  const handleDelete = (id: string) => {
    // In a real app, you'd show a confirmation dialog first
    setAppointments(appointments.filter(a => a.id !== id));
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
        case "Anstehend": return "secondary";
        case "Entwurf": return "outline";
        case "Vergangen": return "destructive";
        default: return "default";
    }
  }

  return (
    <div className="container py-8">
      <BackButton text="Zurück zum Admin-Dashboard" />
      
      <div className="flex justify-between items-center mt-8 mb-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Termin-Verwaltung</h1>
            <p className="text-muted-foreground">Hier können Sie alle Termine erstellen, bearbeiten und verwalten.</p>
        </div>
        <Button asChild>
          <Link href="/board/appointments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Neuer Termin
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sichtbar für</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{format(item.date, "PPP", { locale: de })}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {item.visibility.map(role => {
                            const Icon = roleIcons[role];
                            return <Badge key={role} variant="outline" className="flex items-center gap-1.5"><Icon className="h-3 w-3" /> {roleLabels[role]}</Badge>
                        })}
                    </div>
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
                          <Link href={`/board/appointments/${item.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Bearbeiten
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
