import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { ArrowLeft } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo className="h-6 w-6" />
          <div className="h-6 w-px bg-border" />
          <span className="font-bold sm:inline-block font-headline text-muted-foreground">
            Adminbereich
          </span>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur App
          </Link>
        </Button>
      </div>
    </header>
  );
}
