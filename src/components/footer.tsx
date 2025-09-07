import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-border/40">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-bold mb-4">Eiswirth Johannes, Dipl.-Ing.</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Immobilien- u. Vermögensverwaltung GmbH
            </p>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p>Sebastianstraße 5</p>
                  <p>76456 Kuppenheim</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href="mailto:j.eiswirth@t-online.de"
                  className="hover:text-primary transition-colors"
                >
                  j.eiswirth@t-online.de
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a
                  href="tel:+4972224747"
                  className="hover:text-primary transition-colors"
                >
                  07222 47477
                </a>
              </div>
              <p className="text-xs mt-3">
                <span className="font-medium">Geschäftsführer:</span> Daniel
                Maier
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Schnellzugriff</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/documents"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Hausordnung
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Kontakt & Anfrage
                </Link>
              </li>
              <li>
                <Link
                  href="/resident-appointments"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Termine & Events
                </Link>
              </li>
            </ul>

            {/* Trennlinie */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Demo-Zugang für Hausverwaltung */}
            <div className="mt-6">
              <h4 className="font-medium text-sm text-gray-500 mb-2">
                Demo-Zugang
              </h4>
              <Link
                href="/admin"
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors text-sm"
              >
                <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
                Hausverwaltung
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>© 2025 WEG Silberbach</li>
              <li>Alle Rechte vorbehalten</li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
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
