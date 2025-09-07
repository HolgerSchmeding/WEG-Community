'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useNextAuth } from '@/hooks/use-next-auth';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, isAuthenticated, isLoading } = useNextAuth();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  if (isLoading) {
    return (
      <header className="bg-white border-b border-border/40" role="banner">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <div
            className="animate-pulse bg-gray-200 rounded-full h-10 w-10"
            aria-label="Benutzermenü wird geladen"
            role="status"
          ></div>
        </div>
      </header>
    );
  }

  if (!isAuthenticated) {
    return (
      <header className="bg-white border-b border-border/40" role="banner">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <Button asChild>
            <Link href="/auth/signin" aria-label="Bei WEG-Community anmelden">
              Anmelden
            </Link>
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-border/40" role="banner">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Zur Startseite von Silberbach WEG"
          >
            <div className="bg-primary/20 p-2 rounded-md">
              <Logo className="h-6 w-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold font-headline">Silberbach WEG</h1>
              <p className="text-sm text-muted-foreground">Baden-Baden</p>
            </div>
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
              aria-label={`Benutzermenü für ${user?.name || 'Benutzer'}`}
            >
              <User className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || 'Benutzer'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'benutzer@email.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/marketplace">Marktplatz</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/documents">Dokumente</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/board">Verwaltungsbeirat</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/contact">Kontakt</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/surveys">Umfragen</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin">Hausverwalter</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Abmelden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
