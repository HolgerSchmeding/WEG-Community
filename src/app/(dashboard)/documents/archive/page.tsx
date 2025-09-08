'use client';

import * as React from 'react';
import Link from 'next/link';
import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Eye,
  GanttChartSquare,
  Archive,
  Search,
  FileX,
  KeyRound,
  Trash2,
  Pencil,
  Upload,
  MoreHorizontal,
  Users,
  UserCheck,
  FileUp,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { DocumentSummarizer } from '@/components/document-summarizer';
import {
  IntelligentDocumentSearch,
  type Document as SearchDocument,
} from '@/components/intelligent-document-search';
import { useAuth } from '@/hooks/use-auth';
import { CurrentBill } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const placeholderDocumentContent =
  "Dies ist ein sehr langes und detailliertes Protokoll der Eigentümerversammlung vom 12. Juni 2023. Es beginnt mit der Begrüßung durch die Verwaltung und der Feststellung der Beschlussfähigkeit. Es waren 35 von 50 Eigentümern anwesend, was einer Quote von 70% entspricht. TOP 1 war die Genehmigung der Tagesordnung, die einstimmig angenommen wurde. TOP 2 befasste sich mit dem Jahresabschluss 2022. Die Zahlen wurden von Herrn Müller von der Verwaltung im Detail vorgestellt. Es gab einige Rückfragen zur Position 'Sonstige Kosten', die zufriedenstellend beantwortet werden konnten. Der Jahresabschluss wurde mit großer Mehrheit genehmigt. TOP 3 war der Wirtschaftsplan für 2024. Die geplanten Ausgaben für die Instandhaltung des Daches führten zu einer längeren Diskussion. Mehrere Eigentümer forderten eine zweite Meinung von einem anderen Dachdeckerbetrieb. Nach einer hitzigen Debatte wurde beschlossen, den Wirtschaftsplan vorerst zurückzustellen und die Verwaltung zu beauftragen, zwei weitere Angebote einzuholen. TOP 4 war die Wahl des neuen Verwaltungsbeirats. Frau Schmidt und Herr Meier stellten sich zur Wiederwahl und wurden einstimmig in ihren Ämtern bestätigt. Herr Weber wurde neu in den Beirat gewählt. Die Versammlung endete um 21:30 Uhr. Alle Beteiligten waren froh, dass die wichtigsten Punkte geklärt werden konnten, auch wenn die Diskussion um den Wirtschaftsplan intensiv war.";

const allDocuments = [
  {
    id: 'doc_1',
    category: 'Dokumente',
    name: 'Wirtschaftsplan 2024',
    type: 'PDF',
    date: '5.12.2023',
    icon: FileText,
    visibility: ['owner', 'board'] as Role[],
    downloadable: true,
    content:
      'Der Wirtschaftsplan für 2024 sieht Ausgaben in Höhe von 150.000 Euro vor. Die größten Posten sind die Instandhaltungsrücklage mit 50.000 Euro, die Versicherungskosten mit 25.000 Euro und die Heizkosten mit 30.000 Euro. Aufgrund der gestiegenen Energiekosten wird eine Erhöhung des Hausgeldes um 10% vorgeschlagen. Dies ist notwendig, um die Liquidität der Gemeinschaft zu sichern und zukünftige Investitionen zu ermöglichen. Weitere Positionen umfassen Reinigung (15.000€), Gartenpflege (8.000€), Verwaltungskosten (12.000€) und eine Reserve für unvorhergesehene Reparaturen (10.000€). Die Finanzplanung berücksichtigt auch mögliche Modernisierungsmaßnahmen am Dach und der Fassade.',
  },
  {
    id: 'doc_2',
    category: 'Dokumente',
    name: 'Energieausweis 2022',
    type: 'PDF',
    date: '1.8.2022',
    icon: FileText,
    visibility: ['owner'] as Role[],
    downloadable: true,
    content:
      'Der Energieausweis vom 1.8.2022 weist einen Endenergiebedarf von 120 kWh/(m²*a) aus. Das Gebäude wird damit in die Effizienzklasse D eingestuft. Es wird empfohlen, die Fenster auszutauschen, um die Energieeffizienz zu verbessern. Die Heizungsanlage wurde 2018 erneuert und arbeitet mit Gas-Brennwerttechnik. Der Warmwasserverbrauch liegt bei 25 kWh/(m²*a). Potentielle Einsparungen durch Dämmmaßnahmen werden auf 20% geschätzt. Die nächste Überprüfung ist für 2032 vorgesehen.',
  },
  {
    id: 'doc_3',
    category: 'Dokumente',
    name: 'Teilungserklärung',
    type: 'PDF',
    date: '15.1.2020',
    icon: FileText,
    visibility: ['owner'] as Role[],
    downloadable: false,
    content:
      'Die Teilungserklärung vom 15.1.2020 regelt die Aufteilung des Eigentums in der Wohnanlage Silberbach. Sie definiert das Sondereigentum und das Gemeinschaftseigentum und legt die Stimmrechte der einzelnen Eigentümer fest. Die Anlage umfasst 50 Wohneinheiten mit Miteigentumsanteilen zwischen 1,8% und 3,2%. Gemeinschaftseigentum sind alle tragenden Wände, das Dach, Treppenhäuser, Tiefgarage und Außenanlagen. Balkone und Terrassen gelten als Sondereigentum mit Sondernutzungsrecht.',
  },
  {
    id: 'doc_4',
    category: 'Protokolle',
    name: 'Protokoll Eigentümerversammlung 2023',
    type: 'PDF',
    date: '12.06.2023',
    icon: GanttChartSquare,
    visibility: ['owner', 'board'] as Role[],
    downloadable: true,
    content: placeholderDocumentContent,
  },
  {
    id: 'doc_5',
    category: 'Protokolle',
    name: 'Protokoll Beiratssitzung Q1 2024',
    type: 'PDF',
    date: '15.03.2024',
    icon: GanttChartSquare,
    visibility: ['board'] as Role[],
    downloadable: true,
    content:
      'In der Beiratssitzung wurden die Angebote für die Sanierung der Fassade besprochen. Firma A wurde favorisiert mit einem Angebot von 85.000€. Des Weiteren wurde die Organisation des Sommerfestes geplant. Termin: 15. Juli 2024. Anwesend waren alle drei Beiratsmitglieder. Die Heizungsreparatur in Haus B wurde abgeschlossen, Kosten: 2.400€. Neue Spielgeräte für den Kinderspielplatz werden für das nächste Jahr eingeplant. Der Hausmeister berichtet über kleine Schäden an der Tiefgaragenbeleuchtung, Reparatur erfolgt zeitnah.',
  },
  {
    id: 'doc_6',
    category: 'Sonstiges',
    name: 'Garagenordnung',
    type: 'PDF',
    date: '01.03.2019',
    icon: Archive,
    visibility: ['owner', 'resident'] as Role[],
    downloadable: false,
    content:
      'Die Garagenordnung regelt die Nutzung der Tiefgarage. Es ist verboten, brennbare Materialien zu lagern oder Reparaturen an Fahrzeugen durchzuführen. Die Stellplätze sind sauber zu halten. Öffnungszeiten: 6:00-22:00 Uhr. Nach 22:00 Uhr ist das Tor nur mit dem Notschlüssel zu öffnen. Maximalgeschwindigkeit in der Garage: Schrittgeschwindigkeit. Das Waschen von Fahrzeugen ist nur an den dafür vorgesehenen Plätzen erlaubt. Motorräder und Fahrräder haben eigene Abstellbereiche. Verstöße werden mit 50€ Ordnungsgeld geahndet.',
  },
  {
    id: 'doc_7',
    category: 'Dokumente',
    name: 'Hausordnung 2024',
    type: 'PDF',
    date: '1.1.2024',
    icon: FileText,
    visibility: ['owner', 'resident'] as Role[],
    downloadable: true,
    content:
      'Die neue Hausordnung 2024 regelt das Zusammenleben in der Wohnanlage. Ruhezeiten: 22:00-6:00 Uhr und 13:00-15:00 Uhr. Haustiere sind erlaubt, müssen aber angemeldet werden. Hunde an der Leine führen. Grillverbot auf Balkonen, außer mit Elektrogrills. Müll ist getrennt zu entsorgen. Gemeinschaftsräume nach Nutzung reinigen. Besucher sind bis 22:00 Uhr erlaubt, danach nur mit Zustimmung der Nachbarn. Kinderspielplatz bis zum Einbruch der Dunkelheit nutzbar. Fahrräder nur in den Fahrradkellern abstellen.',
  },
  {
    id: 'doc_8',
    category: 'Protokolle',
    name: 'Beiratssitzung September 2024',
    type: 'PDF',
    date: '15.09.2024',
    icon: GanttChartSquare,
    visibility: ['board'] as Role[],
    downloadable: true,
    content:
      'Sitzung des Verwaltungsbeirats vom 15.09.2024. TOP 1: Winterdienst wurde neu ausgeschrieben, Firma Schneeweiß erhält den Zuschlag für 4.500€. TOP 2: Beschwerden über Lärm in Haus C werden an die Hausverwaltung weitergeleitet. TOP 3: Anschaffung neuer Briefkästen wurde beschlossen, Budget 8.000€. TOP 4: Sanierung des Kinderspielplatzes - drei Angebote liegen vor, Entscheidung wird vertagt. TOP 5: Erhöhung der Hausmeister-Vergütung um 5% ab Oktober. Nächste Sitzung: 15.12.2024.',
  },
];

// Mock-Daten für aktuelle Abrechnungen
const mockCurrentBills: CurrentBill[] = [
  {
    id: 'bill_1',
    title: 'Nebenkostenabrechnung 2024',
    description: 'Jährliche Nebenkostenabrechnung für Wohnung 15',
    amount: -245.5, // Nachzahlung
    billingPeriod: {
      from: new Date('2024-01-01'),
      to: new Date('2024-12-31'),
    },
    dueDate: new Date('2025-09-15'),
    assignedToUserId: 'user_schmidt',
    assignedToUserName: 'Herr Schmidt',
    uploadDate: new Date('2025-08-01'),
    uploadedBy: 'Hausverwaltung Schmidt & Partner',
    content:
      'Nebenkostenabrechnung für das Kalenderjahr 2024. Wohnung 15, Miteigentumsanteil 2,1%. Heizkosten: 1.245€ (Anteil: 26,15€), Wasser/Abwasser: 485€ (Anteil: 10,19€), Müllentsorgung: 125€ (Anteil: 2,63€), Gartenpflege: 85€ (Anteil: 1,79€), Versicherung: 350€ (Anteil: 7,35€), Hausreinigung: 245€ (Anteil: 5,15€). Gesamtkosten: 53,26€. Vorauszahlungen: 298,76€. Guthaben: 245,50€',
    status: 'Neu',
    notificationSent: true,
  },
  {
    id: 'bill_2',
    title: 'Sonderumage Dachsanierung',
    description: 'Anteilige Kosten für Dachsanierung 2024',
    amount: 2850.0, // Nachzahlung
    billingPeriod: {
      from: new Date('2024-06-01'),
      to: new Date('2024-08-31'),
    },
    dueDate: new Date('2025-08-30'),
    assignedToUserId: 'user_mueller',
    assignedToUserName: 'Familie Müller',
    uploadDate: new Date('2025-08-05'),
    uploadedBy: 'Hausverwaltung Schmidt & Partner',
    content:
      'Sonderumlage für die Dachsanierung des Gebäudes. Gesamtkosten der Maßnahme: 135.500€. Ihr Miteigentumsanteil: 2,1%. Ihr Anteil: 2.845,50€. Die Arbeiten umfassten: Vollsanierung des Dachstuhls, neue Dämmung nach EnEV-Standard, Austausch aller Dachziegel, neue Dachrinnen und Fallrohre. Finanzierung teilweise über Instandhaltungsrücklage (1.500€), Rest als Sonderumlage.',
    status: 'Neu',
    notificationSent: false,
  },
];

type Document = (typeof allDocuments)[0];
type Role = 'owner' | 'resident' | 'board';
const roleIcons: Record<Role, React.ElementType> = {
  owner: KeyRound,
  resident: Users,
  board: UserCheck,
};
const roleLabels: Record<Role, string> = {
  owner: 'Eigentümer',
  resident: 'Bewohner',
  board: 'Beirat',
};

export default function DocumentsArchivePage() {
  const [documents, setDocuments] = React.useState<Document[]>(allDocuments);
  const [currentBills, setCurrentBills] =
    React.useState<CurrentBill[]>(mockCurrentBills);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isBillViewDialogOpen, setIsBillViewDialogOpen] = React.useState(false);
  const [isSummarizeDialogOpen, setIsSummarizeDialogOpen] =
    React.useState(false);
  const [selectedDocument, setSelectedDocument] =
    React.useState<Document | null>(null);
  const [selectedBill, setSelectedBill] = React.useState<CurrentBill | null>(
    null
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('browse');
  const { toast } = useToast();
  const { user, hasRole } = useAuth();

  // Filtere Abrechnungen für aktuellen Benutzer
  const userCurrentBills = React.useMemo(() => {
    if (!user) return [];
    if (hasRole('admin')) return currentBills; // Admin sieht alle
    return currentBills.filter(
      bill =>
        bill.assignedToUserId ===
        `user_${user.name.toLowerCase().replace(' ', '_')}`
    );
  }, [currentBills, user, hasRole]);

  // Konvertiere Dokumente für die Suchkomponente
  const searchDocuments: SearchDocument[] = allDocuments.map(doc => {
    // Intelligente Tags basierend auf Inhalt generieren
    const generateTags = (content: string, category: string, name: string) => {
      const baseTags = [category, doc.type];
      const contentWords = content.toLowerCase();

      // Thematische Tags hinzufügen
      if (
        contentWords.includes('heizung') ||
        contentWords.includes('energie') ||
        contentWords.includes('wärme')
      )
        baseTags.push('Heizung');
      if (
        contentWords.includes('geld') ||
        contentWords.includes('euro') ||
        contentWords.includes('kosten')
      )
        baseTags.push('Finanzen');
      if (
        contentWords.includes('reparatur') ||
        contentWords.includes('sanierung') ||
        contentWords.includes('instandhaltung')
      )
        baseTags.push('Instandhaltung');
      if (
        contentWords.includes('versammlung') ||
        contentWords.includes('protokoll') ||
        contentWords.includes('sitzung')
      )
        baseTags.push('Versammlung');
      if (
        contentWords.includes('garage') ||
        contentWords.includes('parkplatz') ||
        contentWords.includes('fahrzeug')
      )
        baseTags.push('Parken');
      if (
        contentWords.includes('müll') ||
        contentWords.includes('reinigung') ||
        contentWords.includes('sauberkeit')
      )
        baseTags.push('Ordnung');
      if (
        contentWords.includes('lärm') ||
        contentWords.includes('ruhe') ||
        contentWords.includes('nachbarschaft')
      )
        baseTags.push('Nachbarschaft');
      if (
        contentWords.includes('garten') ||
        contentWords.includes('spielplatz') ||
        contentWords.includes('außenanlage')
      )
        baseTags.push('Außenanlagen');

      return baseTags;
    };

    return {
      id: doc.id,
      title: doc.name,
      content: doc.content,
      category: doc.category,
      type: doc.type,
      date: doc.date,
      author:
        doc.category === 'Protokolle' ? 'Verwaltungsbeirat' : 'Hausverwaltung',
      tags: generateTags(doc.content, doc.category, doc.name),
      permissions: doc.visibility,
    };
  });

  const handleDocumentSelect = (searchDoc: SearchDocument) => {
    const originalDoc = allDocuments.find(d => d.id === searchDoc.id);
    if (originalDoc) {
      setSelectedDocument(originalDoc);
      setIsViewDialogOpen(true);
    }
  };

  const filteredDocs = documents.filter(
    doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const protocols = filteredDocs.filter(d => d.category === 'Protokolle');
  const officialDocs = filteredDocs.filter(d => d.category === 'Dokumente');
  const others = filteredDocs.filter(d => d.category === 'Sonstiges');
  const billDocs = filteredDocs.filter(d => d.category === 'Abrechnungen');

  // Prüfe ob User Berechtigung für Abrechnungen hat
  const canViewBills =
    user?.roles?.includes('owner') ||
    user?.roles?.includes('admin') ||
    user?.roles?.includes('hausverwalter');

  // Debug: Zeige aktuelle Benutzerrolle in der Konsole
  React.useEffect(() => {
    if (user) {
      console.log(
        'Current user roles:',
        user.roles,
        'canViewBills:',
        canViewBills
      );
    }
  }, [user, canViewBills]);

  // Filter for currentBills based on role and search
  const filteredBills = currentBills.filter(bill => {
    if (!canViewBills) return false;

    const matchesSearch =
      !searchQuery ||
      bill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.assignedToUserName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleViewClick = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewDialogOpen(true);
  };

  const handleViewBillClick = (bill: CurrentBill) => {
    setSelectedBill(bill);
    setIsBillViewDialogOpen(true);
  };

  const handleDownloadClick = (doc: Document) => {
    if (!doc.downloadable) {
      toast({
        title: 'Download nicht möglich',
        description: 'Dieses Dokument ist nur zur Ansicht freigegeben.',
        variant: 'destructive',
      });
      return;
    }
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const NoResults = () => (
    <div className="text-center py-16 text-muted-foreground">
      <FileX className="mx-auto h-12 w-12 mb-4" />
      <h3 className="font-headline text-xl font-semibold">
        Keine Dokumente gefunden
      </h3>
      <p>Ihre Suche nach "{searchQuery}" ergab keine Treffer.</p>
    </div>
  );

  const BillTable = ({
    bills,
    onViewBill,
  }: {
    bills: CurrentBill[];
    onViewBill: (bill: CurrentBill) => void;
  }) => (
    <>
      {bills.length === 0 && searchQuery ? (
        <NoResults />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titel</TableHead>
              <TableHead>Betrag</TableHead>
              <TableHead>Fällig bis</TableHead>
              <TableHead>Zugewiesen an</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map(bill => (
              <TableRow key={bill.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{bill.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {bill.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell
                  className={`font-medium ${bill.amount > 0 ? 'text-red-600' : 'text-green-600'}`}
                >
                  {bill.amount > 0
                    ? `+${bill.amount.toFixed(2)}€`
                    : `${bill.amount.toFixed(2)}€`}
                </TableCell>
                <TableCell>
                  {bill.dueDate.toLocaleDateString('de-DE')}
                </TableCell>
                <TableCell>{bill.assignedToUserName}</TableCell>
                <TableCell>
                  <Badge
                    variant={bill.status === 'Neu' ? 'destructive' : 'default'}
                  >
                    {bill.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewBill(bill)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );

  const DocumentTable = ({ docs }: { docs: Document[] }) => (
    <>
      {docs.length === 0 && searchQuery ? (
        <NoResults />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[120px] text-center">Datum</TableHead>
              <TableHead className="w-[180px]">Sichtbar für</TableHead>
              <TableHead className="text-right w-[150px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map(doc => {
              return (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <doc.icon className="h-5 w-5 text-primary shrink-0" />
                      <div className="flex flex-col">
                        <span>{doc.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {doc.type}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{doc.date}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {doc.visibility.map(role => {
                        const Icon = roleIcons[role as Role];
                        return (
                          <Badge
                            key={role}
                            variant="outline"
                            className="flex items-center gap-1.5"
                          >
                            <Icon className="h-3 w-3" />{' '}
                            {roleLabels[role as Role]}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menü öffnen</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewClick(doc)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ansehen & Zusammenfassen
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownloadClick(doc)}
                          disabled={!doc.downloadable}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Herunterladen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );

  return (
    <>
      <div className="container py-8">
        <div className="mb-8">
          <BackButton text="Zurück zum Cockpit" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-green-500/20 p-4 rounded-lg mb-6">
            <Archive className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Dokumentenarchiv
          </h1>
          <p className="mt-2 text-muted-foreground">
            Hier finden Sie alle wichtigen Dokumente, Protokolle und weitere
            Unterlagen der WEG Silberbach.
          </p>
          {!canViewBills && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Hinweis:</strong> Als{' '}
                {user?.roles?.[0] === 'resident'
                  ? 'Bewohner'
                  : user?.roles?.[0] === 'board'
                    ? 'Beiratsmitglied'
                    : 'Benutzer'}{' '}
                haben Sie keinen Zugriff auf das Abrechnungen-Archiv. Nur
                Eigentümer und Hausverwaltung können Abrechnungen einsehen.
                <Link href="/role-test" className="underline ml-2">
                  Rolle für Demo-Zwecke wechseln →
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto mt-12">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Einfache Suche in Dokumenten..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant={activeTab === 'search' ? 'default' : 'outline'}
              onClick={() =>
                setActiveTab(activeTab === 'search' ? 'browse' : 'search')
              }
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {activeTab === 'search'
                ? 'Normale Ansicht'
                : 'Intelligente Suche'}
            </Button>
          </div>

          {/* Intelligente Suche */}
          {activeTab === 'search' ? (
            <IntelligentDocumentSearch
              documents={searchDocuments}
              onDocumentSelect={handleDocumentSelect}
              userRole={user?.roles?.[0] || 'resident'}
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="protokolle" className="w-full">
                  <TabsList
                    className={`grid w-full ${canViewBills ? 'grid-cols-4' : 'grid-cols-3'}`}
                  >
                    <TabsTrigger
                      value="protokolle"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                    >
                      Protokolle
                    </TabsTrigger>
                    <TabsTrigger
                      value="dokumente"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                    >
                      Dokumente
                    </TabsTrigger>
                    <TabsTrigger
                      value="sonstiges"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                    >
                      Sonstiges
                    </TabsTrigger>
                    {canViewBills && (
                      <TabsTrigger
                        value="abrechnungen"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                      >
                        Abrechnungen
                      </TabsTrigger>
                    )}
                  </TabsList>
                  <div className="p-6">
                    <TabsContent value="protokolle" className="mt-0">
                      <DocumentTable docs={protocols} />
                    </TabsContent>
                    <TabsContent value="dokumente" className="mt-0">
                      <DocumentTable docs={officialDocs} />
                    </TabsContent>
                    <TabsContent value="sonstiges" className="mt-0">
                      <DocumentTable docs={others} />
                    </TabsContent>
                    {canViewBills && (
                      <TabsContent value="abrechnungen" className="mt-0">
                        <BillTable
                          bills={filteredBills}
                          onViewBill={handleViewBillClick}
                        />
                      </TabsContent>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              Dokumentenansicht & KI-Zusammenfassung
            </DialogTitle>
            <DialogDescription>
              Hier sehen Sie den Inhalt des Dokuments "
              <span className="font-bold">{selectedDocument?.name}</span>".
              Nutzen Sie die KI, um eine schnelle Zusammenfassung zu erhalten.
            </DialogDescription>
          </DialogHeader>
          <DocumentSummarizer documentText={selectedDocument?.content || ''} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isBillViewDialogOpen}
        onOpenChange={setIsBillViewDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              {selectedBill?.title}
            </DialogTitle>
            <DialogDescription>
              Abrechnung für {selectedBill?.assignedToUserName} - Fällig bis{' '}
              {selectedBill?.dueDate.toLocaleDateString('de-DE')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Beschreibung
                </Label>
                <p className="text-sm">{selectedBill?.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Betrag
                </Label>
                <p
                  className={`text-lg font-bold ${selectedBill && selectedBill.amount > 0 ? 'text-red-600' : 'text-green-600'}`}
                >
                  {selectedBill && selectedBill.amount > 0
                    ? `+${selectedBill.amount.toFixed(2)}€`
                    : `${selectedBill?.amount.toFixed(2)}€`}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Abrechnungszeitraum
                </Label>
                <p className="text-sm">
                  {selectedBill?.billingPeriod.from.toLocaleDateString('de-DE')}{' '}
                  - {selectedBill?.billingPeriod.to.toLocaleDateString('de-DE')}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Status
                </Label>
                <Badge
                  variant={
                    selectedBill?.status === 'Neu' ? 'destructive' : 'default'
                  }
                >
                  {selectedBill?.status}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Details
              </Label>
              <div className="mt-2 p-4 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-wrap">
                  {selectedBill?.content}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
