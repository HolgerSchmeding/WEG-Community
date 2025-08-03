
"use client";

import * as React from "react";
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Mail,
  Pencil,
  Trash2,
  CheckCircle,
  Clock,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { UserEditDialog } from "@/components/admin/user-edit-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export type Role = "admin" | "resident" | "owner" | "board";

export type User = {
  id: string;
  salutation: "Herr" | "Frau" | "Divers";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: Role[];
  credentialsSent: boolean;
  createdAt: Date;
};

const initialUsersData: User[] = [
  {
    id: "usr_1",
    salutation: "Herr",
    firstName: "Max",
    lastName: "Mustermann",
    email: "max.mustermann@example.com",
    phone: "0176 12345678",
    roles: ["owner"],
    credentialsSent: true,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "usr_2",
    salutation: "Frau",
    firstName: "Erika",
    lastName: "Musterfrau",
    email: "erika.musterfrau@example.com",
    phone: "0176 87654321",
    roles: ["resident"],
    credentialsSent: false,
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "usr_3",
    salutation: "Herr",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    roles: ["owner", "board"],
    credentialsSent: true,
    createdAt: new Date("2022-11-10"),
  },
  {
    id: "usr_4",
    salutation: "Frau",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "0151 11223344",
    roles: ["admin"],
    credentialsSent: true,
    createdAt: new Date("2022-10-01"),
  },
  {
    id: "usr_5",
    salutation: "Herr",
    firstName: "Peter",
    lastName: "Schmidt",
    email: "peter.schmidt@example.com",
    roles: ["owner", "resident"],
    credentialsSent: false,
    createdAt: new Date("2024-03-12"),
  },
];

export const roleLabels: Record<Role, string> = {
  admin: "Admin",
  resident: "Bewohner",
  owner: "Eigentümer",
  board: "Beirat",
};

export default function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    // Load users on the client side to avoid SSR issues with `new Date()`
    setUsers(initialUsersData);
    setIsLoading(false);
  }, []);

  const sortedUsers = React.useMemo(() => {
    return [...users].sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [users]);

  const filteredUsers = React.useMemo(() => {
    if (isLoading) return [];
    return sortedUsers.filter(
      (user) =>
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedUsers, searchQuery, isLoading]);

  const handleAddNewUser = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleSaveUser = (user: Omit<User, 'id' | 'createdAt' | 'credentialsSent'> & { id?: string }) => {
    if (user.id) {
      // Update existing user
      setUsers(users.map((u) => (u.id === user.id ? { ...u, ...user } : u)));
      toast({ title: "Benutzer aktualisiert", description: `Die Daten für ${user.firstName} ${user.lastName} wurden gespeichert.` });
    } else {
      // Add new user
      const newUser: User = { 
        ...user, 
        id: `usr_${Date.now()}`,
        credentialsSent: false,
        createdAt: new Date(),
      };
      setUsers([...users, newUser]);
       toast({ title: "Benutzer erstellt", description: `${user.firstName} ${user.lastName} wurde erfolgreich angelegt.` });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    // Add a confirmation dialog in a real app
    setUsers(users.filter((u) => u.id !== userId));
    toast({ variant: "destructive", title: "Benutzer gelöscht", description: "Der Benutzer wurde dauerhaft entfernt." });
  };
  
  const handleSendCredentials = (userId: string) => {
     // Simulate sending credentials and updating state
    setUsers(users.map(u => u.id === userId ? { ...u, credentialsSent: true } : u));
    toast({ title: "Zugangsdaten versendet", description: "Die initialen Zugangsdaten wurden per E-Mail versendet." });
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <Button variant="ghost" asChild className="pl-0 mb-6">
          <Link href="/admin">
             <ArrowLeft className="mr-2 h-4 w-4" />
             Zurück zur Admin-Übersicht
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Benutzerverwaltung
            </h1>
            <p className="text-muted-foreground">
              Benutzer anlegen, Rollen zuweisen und Zugangsdaten verwalten.
            </p>
          </div>
          <Button onClick={handleAddNewUser}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Benutzer anlegen
          </Button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen nach Name, E-Mail..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Nachname</TableHead>
                  <TableHead>Vorname</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Rollen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">{user.lastName}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge key={role} variant="outline">{roleLabels[role]}</Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.credentialsSent ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Versendet
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            <Clock className="mr-2 h-4 w-4" />
                            Ausstehend
                          </Badge>
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
                            <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendCredentials(user.id)} disabled={user.credentialsSent}>
                              <Mail className="mr-2 h-4 w-4" />
                              Zugangsdaten senden
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Keine Benutzer gefunden.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <UserEditDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </>
  );
}

    