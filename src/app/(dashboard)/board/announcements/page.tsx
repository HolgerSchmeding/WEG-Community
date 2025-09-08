'use client';

import * as React from 'react';
import Link from 'next/link';
import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mockAnnouncements = [
  {
    id: '1',
    title: 'Wartung der Aufzugsanlage',
    author: 'Hausverwaltung',
    date: '15. Juli 2024',
    status: 'Aktiv',
    visibility: { residents: true, owners: true },
    expiresAt: '20. Juli 2024',
  },
  {
    id: '2',
    title: 'Einladung zum Sommerfest',
    author: 'WEG-Verwaltungsbeirat',
    date: '12. Juli 2024',
    status: 'Aktiv',
    visibility: { residents: true, owners: false },
    expiresAt: '04. August 2024',
  },
  {
    id: '3',
    title: 'Reinigung der Tiefgarage',
    author: 'Hausverwaltung',
    date: '05. Juli 2024',
    status: 'Abgelaufen',
    visibility: { residents: true, owners: true },
    expiresAt: '23. Juli 2024',
  },
  {
    id: '4',
    title: 'Heizungsablesung (Entwurf)',
    author: 'WEG-Verwaltungsbeirat',
    date: '25. August 2024',
    status: 'Entwurf',
    visibility: { residents: false, owners: true },
    expiresAt: '15. September 2024',
  },
];

export default function ManageAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState(mockAnnouncements);

  const handleDelete = (id: string) => {
    // In a real app, you'd show a confirmation dialog first
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Aktiv':
        return 'secondary';
      case 'Entwurf':
        return 'outline';
      case 'Abgelaufen':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="container py-8">
      <BackButton text="Zurück zum Beirats-Cockpit" />

      <div className="flex justify-between items-center mt-8 mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold">
            Aushang-Verwaltung
          </h1>
          <p className="text-muted-foreground">
            Hier können Sie Aushänge erstellen, bearbeiten und veröffentlichen.
          </p>
        </div>
        <Button asChild>
          <Link href="/board/announcements/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Neuer Aushang
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sichtbar für</TableHead>
                <TableHead>Gültig bis</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {item.visibility.residents && (
                        <Badge variant="outline">Bewohner</Badge>
                      )}
                      {item.visibility.owners && (
                        <Badge variant="outline">Eigentümer</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.expiresAt || 'Unbefristet'}</TableCell>
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
                          <Link href={`/board/announcements/${item.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Bearbeiten
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive focus:text-destructive"
                        >
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
