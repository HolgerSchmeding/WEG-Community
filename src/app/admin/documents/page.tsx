"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  Trash2,
  ArrowLeft,
  Lock,
  Search,
  Filter
} from "lucide-react";
import Link from 'next/link';

const internalDocuments = [
  {
    id: 1,
    name: "Dienstleistungsvertrag_Reinigungsfirma_2025.pdf",
    category: "Verträge",
    size: "2.3 MB",
    uploadDate: "2025-01-15",
    confidential: true,
    description: "Vertrag mit der Reinigungsfirma Sauber & Co."
  },
  {
    id: 2,
    name: "Kostenvoranschlag_Dachsanierung.pdf", 
    category: "Angebote",
    size: "1.8 MB",
    uploadDate: "2025-01-10",
    confidential: true,
    description: "Detaillierter Kostenvoranschlag für die Dachsanierung"
  },
  {
    id: 3,
    name: "Versicherungskorrespondenz_Wasserschaden.pdf",
    category: "Korrespondenz",
    size: "0.9 MB", 
    uploadDate: "2025-01-05",
    confidential: true,
    description: "Briefwechsel mit der Gebäudeversicherung"
  },
  {
    id: 4,
    name: "Handwerker_Notfallkontakte_2025.pdf",
    category: "Betrieb",
    size: "0.4 MB",
    uploadDate: "2024-12-20",
    confidential: false,
    description: "Aktuelle Kontaktliste für Notfälle"
  },
  {
    id: 5,
    name: "Interne_Checkliste_Versammlungsorganisation.pdf",
    category: "Arbeitsanweisungen",
    size: "0.7 MB",
    uploadDate: "2024-12-15",
    confidential: false,
    description: "Schritt-für-Schritt Anleitung für ETV-Organisation"
  }
];

const categories = [
  { name: "Verträge", count: 1, color: "bg-red-100 text-red-800" },
  { name: "Angebote", count: 1, color: "bg-blue-100 text-blue-800" },
  { name: "Korrespondenz", count: 1, color: "bg-purple-100 text-purple-800" },
  { name: "Betrieb", count: 1, color: "bg-green-100 text-green-800" },
  { name: "Arbeitsanweisungen", count: 1, color: "bg-yellow-100 text-yellow-800" }
];

export default function InternalDocumentsPage() {
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
        <div className="inline-block bg-amber-100 p-3 rounded-lg mb-4">
          <Lock className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Interne Dokumentenverwaltung
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Vertrauliche Hausverwaltungsunterlagen - nur für berechtigtes Personal zugänglich.
        </p>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {categories.map((category, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Badge variant="outline" className={`${category.color} mb-2`}>
                {category.name}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {category.count} {category.count === 1 ? 'Dokument' : 'Dokumente'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Dokumente durchsuchen..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Dokument hochladen
        </Button>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-600" />
            Interne Dokumente
          </CardTitle>
          <CardDescription>
            Vertrauliche Unterlagen der Hausverwaltung - getrennt vom öffentlichen WEG-Archiv
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {internalDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{doc.name}</div>
                    <div className="text-sm text-muted-foreground">{doc.description}</div>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className={categories.find(c => c.name === doc.category)?.color}>
                        {doc.category}
                      </Badge>
                      {doc.confidential && (
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          <Lock className="mr-1 h-3 w-3" />
                          Vertraulich
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{doc.size}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.uploadDate).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Lock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Unterschied zu WEG-Dokumenten</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Interne Dokumente:</strong> Nur für Hausverwaltung und Administratoren zugänglich</li>
                <li>• <strong>WEG-Dokumente:</strong> Für Bewohner und Eigentümer im öffentlichen Archiv einsehbar</li>
                <li>• <strong>Automatische Trennung:</strong> Import-Funktion unterscheidet automatisch zwischen beiden Archiven</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
