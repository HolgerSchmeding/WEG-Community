'use client';

import { signIn, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogIn, Shield, Users, Home } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already signed in
    getSession().then(session => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', {
        callbackUrl: '/',
        redirect: true,
      });
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                WEG Silberbach
              </CardTitle>
              <CardDescription className="text-gray-600">
                Community Hub
              </CardDescription>
            </div>
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-3 py-1">
                <Shield className="w-3 h-3 mr-1" />
                Sicher & Privat
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Willkommen zurück!</h2>
              <p className="text-sm text-gray-600">
                Melden Sie sich an, um auf Ihre Community-Plattform zuzugreifen.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                Zugang für alle Bewohner
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2" />
                Sichere Authentifizierung
              </div>
            </div>

            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full h-12 text-base"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? 'Anmeldung läuft...' : 'Mit Google anmelden'}
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Durch die Anmeldung stimmen Sie unseren
                <br />
                Nutzungsbedingungen und Datenschutzrichtlinien zu.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Probleme beim Anmelden?
            <br />
            Kontaktieren Sie die Hausverwaltung.
          </p>
        </div>
      </div>
    </div>
  );
}
