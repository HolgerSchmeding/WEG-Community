'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { User } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  return (
    <header className="bg-white">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-md">
              <Logo className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold font-headline">Silberbach WEG</h1>
              <p className="text-sm text-muted-foreground">Baden-Baden</p>
            </div>
          </Link>
        </div>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Benutzer</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    benutzer@email.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin">Adminbereich</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ausloggen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </header>
  );
}
