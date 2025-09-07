'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const errorMessages: Record<string, string> = {
  Configuration: 'Es gibt ein Problem mit der Server-Konfiguration.',
  AccessDenied: 'Sie haben keine Berechtigung für diese Anwendung.',
  Verification: 'Der Verifizierungslink ist ungültig oder abgelaufen.',
  Default: 'Ein unerwarteter Fehler ist aufgetreten.',
};

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';

  const handleRetry = () => {
    router.push('/auth/signin');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Anmeldung fehlgeschlagen
          </CardTitle>
          <CardDescription className="text-gray-600">
            {errorMessages[error] || errorMessages.Default}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error === 'AccessDenied' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Nur registrierte Bewohner der WEG Silberbach haben Zugriff auf
                diese Plattform.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Erneut versuchen
            </Button>

            <Button onClick={handleGoBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Weitere Probleme? Kontaktieren Sie die Hausverwaltung.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
