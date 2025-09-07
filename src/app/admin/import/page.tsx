'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Database,
  Upload,
  CheckCircle,
  AlertCircle,
  FileImage,
  FileText,
  Video,
  Server,
  ArrowLeft,
  Clock,
  HardDrive,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const importCategories = [
  {
    type: 'Apache2-Bereich',
    bereich: 'System',
    umfang: 600,
    icon: Server,
    color: 'bg-orange-100 text-orange-800',
    description: 'Webserver-Konfiguration und Logs',
  },
  {
    type: 'MySQL Dump',
    bereich: 'Datenbank',
    umfang: 0.2,
    icon: Database,
    color: 'bg-blue-100 text-blue-800',
    description: 'Strukturierte Verwaltungsdaten',
  },
  {
    type: 'Bilder (*.jpg)',
    bereich: 'Beirat',
    umfang: 470,
    icon: FileImage,
    color: 'bg-green-100 text-green-800',
    description: 'Fotos von Versammlungen und Dokumenten',
  },
  {
    type: 'Bilder (*.jpg)',
    bereich: 'EG',
    umfang: 65,
    icon: FileImage,
    color: 'bg-green-100 text-green-800',
    description: 'Eigentümergemeinschaft Bildarchiv',
  },
  {
    type: 'Dokumente (*.pdf)',
    bereich: 'WEG-Archiv',
    umfang: 10,
    icon: FileText,
    color: 'bg-purple-100 text-purple-800',
    description: 'Allgemeine WEG-Dokumente (öffentlich für Bewohner)',
  },
  {
    type: 'Dokumente (*.pdf)',
    bereich: 'Beirat (WEG)',
    umfang: 180,
    icon: FileText,
    color: 'bg-purple-100 text-purple-800',
    description: 'Beirats-Protokolle und Beschlüsse (öffentlich)',
  },
  {
    type: 'Dokumente (*.pdf)',
    bereich: 'EG (WEG)',
    umfang: 280,
    icon: FileText,
    color: 'bg-purple-100 text-purple-800',
    description: 'Eigentümerversammlung Unterlagen (öffentlich)',
  },
  {
    type: 'Interne Dokumente (*.pdf)',
    bereich: 'Hausverwaltung',
    umfang: 45,
    icon: FileText,
    color: 'bg-amber-100 text-amber-800',
    description: 'Verträge, interne Korrespondenz (nur Admin)',
  },
  {
    type: 'Video (*.mp4)',
    bereich: 'EG',
    umfang: 370,
    icon: Video,
    color: 'bg-red-100 text-red-800',
    description: 'Aufzeichnungen von Versammlungen',
  },
];

const totalSize = importCategories.reduce((sum, cat) => sum + cat.umfang, 0);

export default function ImportPage() {
  const [importStatus, setImportStatus] = useState<
    'pending' | 'running' | 'completed'
  >('pending');
  const [progress, setProgress] = useState(0);

  const handleStartImport = () => {
    setImportStatus('running');
    // Simulate import progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImportStatus('completed');
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Admin-Übersicht
          </Link>
        </Button>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-block bg-primary/20 p-3 rounded-lg mb-4">
          <Database className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Bestandsdaten Import
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Übernahme Ihrer vorhandenen WEG-Verwaltungsdaten in das neue System.
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <HardDrive className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
            <p className="text-sm text-muted-foreground">Gesamtdatenmenge</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Upload className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{importCategories.length}</div>
            <p className="text-sm text-muted-foreground">Import-Kategorien</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">~45 Min</div>
            <p className="text-sm text-muted-foreground">Geschätzte Dauer</p>
          </CardContent>
        </Card>
      </div>

      {/* Import Categories */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Import-Kategorien</CardTitle>
          <CardDescription>
            Übersicht der zu übertragenden Bestandsdaten aus Ihrem bisherigen
            System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {importCategories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <category.icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">{category.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {category.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={category.color}>
                    {category.bereich}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    {category.umfang >= 1
                      ? `${category.umfang} MB`
                      : `${category.umfang * 1000} KB`}
                  </div>
                  {category.bereich.includes('WEG') && (
                    <div className="text-xs text-green-600 mt-1">
                      📖 Öffentliches Archiv
                    </div>
                  )}
                  {category.bereich === 'Hausverwaltung' && (
                    <div className="text-xs text-amber-600 mt-1">
                      🔒 Internes Archiv
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Import Control */}
      <Card>
        <CardHeader>
          <CardTitle>Import starten</CardTitle>
          <CardDescription>
            {importStatus === 'pending' &&
              'Bereit für die Datenübernahme aus Ihrem bisherigen System.'}
            {importStatus === 'running' &&
              'Import läuft... Bitte warten Sie, bis alle Daten übertragen wurden.'}
            {importStatus === 'completed' &&
              'Import erfolgreich abgeschlossen! Alle Bestandsdaten wurden übernommen.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {importStatus === 'pending' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      Wichtige Hinweise
                    </h4>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1">
                      <li>
                        • Stellen Sie sicher, dass alle Quelldaten verfügbar
                        sind
                      </li>
                      <li>
                        • Der Import kann je nach Datenmenge 30-60 Minuten
                        dauern
                      </li>
                      <li>
                        • Während des Imports sollten keine anderen Aktionen
                        ausgeführt werden
                      </li>
                      <li>
                        • Eine automatische Sicherung wird vor dem Import
                        erstellt
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button onClick={handleStartImport} className="w-full" size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Bestandsdaten Import starten
              </Button>
            </div>
          )}

          {importStatus === 'running' && (
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <div className="text-center text-sm text-muted-foreground">
                {progress.toFixed(0)}% abgeschlossen -{' '}
                {((totalSize * progress) / 100).toFixed(1)} MB von{' '}
                {totalSize.toFixed(1)} MB übertragen
              </div>
            </div>
          )}

          {importStatus === 'completed' && (
            <div className="text-center space-y-4">
              <div className="inline-block bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-900">
                  Import erfolgreich!
                </h3>
                <p className="text-sm text-green-800 mt-1">
                  Alle {totalSize.toFixed(1)} MB Bestandsdaten wurden
                  erfolgreich übernommen.
                </p>
              </div>
              <Button asChild>
                <Link href="/admin">Zur Admin-Übersicht</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
