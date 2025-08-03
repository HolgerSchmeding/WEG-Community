import Link from 'next/link';
import { MapPin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-bold mb-4">Hausverwaltung Silberbach GmbH</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>
                  Musterstraße 1<br />
                  12345 Musterstadt
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:info@weg-silberbach.de" className="hover:text-primary">
                  info@weg-silberbach.de
                </a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Schnellzugriff</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/admin" className="flex items-center gap-2 text-red-600 hover:underline">
                  <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                  Admin-Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>© 2025 WEG Silberbach</li>
              <li>Alle Rechte vorbehalten</li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Datenschutzerklärung
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
