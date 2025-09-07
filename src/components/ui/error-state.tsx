'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  showHomeButton?: boolean;
  variant?: 'default' | 'compact';
}

export function ErrorState({
  title = 'Ein Fehler ist aufgetreten',
  message = 'Entschuldigung, etwas ist schief gelaufen. Bitte versuchen Sie es später erneut.',
  showRetry = true,
  onRetry,
  showHomeButton = false,
  variant = 'default',
}: ErrorStateProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="space-y-4">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-muted-foreground">{message}</p>
          {showRetry && onRetry && (
            <Button onClick={onRetry} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Erneut versuchen
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">{message}</p>

        <div className="flex flex-col gap-2">
          {showRetry && onRetry && (
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Erneut versuchen
            </Button>
          )}

          {showHomeButton && (
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Zur Startseite
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
