
"use client";

import * as React from "react";
import { BackButton } from "@/components/back-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { DocumentSummarizer } from "@/components/document-summarizer";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const placeholderDocumentContent =
  "Dies ist ein sehr langes und detailliertes Protokoll der Eigentümerversammlung vom 12. Juni 2023. Es beginnt mit der Begrüßung durch die Verwaltung und der Feststellung der Beschlussfähigkeit. Es waren 35 von 50 Eigentümern anwesend, was einer Quote von 70% entspricht. TOP 1 war die Genehmigung der Tagesordnung, die einstimmig angenommen wurde. TOP 2 befasste sich mit dem Jahresabschluss 2022. Die Zahlen wurden von Herrn Müller von der Verwaltung im Detail vorgestellt. Es gab einige Rückfragen zur Position 'Sonstige Kosten', die zufriedenstellend beantwortet werden konnten. Der Jahresabschluss wurde mit großer Mehrheit genehmigt. TOP 3 war der Wirtschaftsplan für 2024. Die geplanten Ausgaben für die Instandhaltung des Daches führten zu einer längeren Diskussion. Mehrere Eigentümer forderten eine zweite Meinung von einem anderen Dachdeckerbetrieb. Nach einer hitzigen Debatte wurde beschlossen, den Wirtschaftsplan vorerst zurückzustellen und die Verwaltung zu beauftragen, zwei weitere Angebote einzuholen. TOP 4 war die Wahl des neuen Verwaltungsbeirats. Frau Schmidt und Herr Meier stellten sich zur Wiederwahl und wurden einstimmig in ihren Ämtern bestätigt. Herr Weber wurde neu in den Beirat gewählt. Die Versammlung endete um 21:30 Uhr. Alle Beteiligten waren froh, dass die wichtigsten Punkte geklärt werden konnten, auch wenn die Diskussion um den Wirtschaftsplan intensiv war.";

const allDocuments = [
  {
    id: "doc_1",
    category: "Dokumente",
    name: "Wirtschaftsplan 2024",
    type: "PDF",
    date: "5.12.2023",
    icon: FileText,
    visibility: ["owner", "board"] as Role[],
    downloadable: true,
    content:
      "Der Wirtschaftsplan für 2024 sieht Ausgaben in Höhe von 150.000 Euro vor. Die größten Posten sind die Instandhaltungsrücklage mit 50.000 Euro, die Versicherungskosten mit 25.000 Euro und die Heizkosten mit 30.000 Euro. Aufgrund der gestiegenen Energiekosten wird eine Erhöhung des Hausgeldes um 10% vorgeschlagen. Dies ist notwendig, um die Liquidität der Gemeinschaft zu sichern und zukünftige Investitionen zu ermöglichen.",
  },
  {
    id: "doc_2",
    category: "Dokumente",
    name: "Energieausweis 2022",
    type: "PDF",
    date: "1.8.2022",
    icon: FileText,
    visibility: ["owner"] as Role[],
    downloadable: true,
    content:
      "Der Energieausweis vom 1.8.2022 weist einen Endenergiebedarf von 120 kWh/(m²*a) aus. Das Gebäude wird damit in die Effizienzklasse D eingestuft. Es wird empfohlen, die Fenster auszutauschen, um die Energieeffizienz zu verbessern.",
  },
  {
    id: "doc_3",
    category: "Dokumente",
    name: "Teilungserklärung",
    type: "PDF",
    date: "15.1.2020",
    icon: FileText,
    visibility: ["owner"] as Role[],
    downloadable: false,
    content:
      "Die Teilungserklärung vom 15.1.2020 regelt die Aufteilung des Eigentums in der Wohnanlage Silberbach. Sie definiert das Sondereigentum und das Gemeinschaftseigentum und legt die Stimmrechte der einzelnen Eigentümer fest.",
  },
  {
    id: "doc_4",
    category: "Protokolle",
    name: "Protokoll Eigentümerversammlung 2023",
    type: "PDF",
    date: "12.06.2023",
    icon: GanttChartSquare,
    visibility: ["owner", "board"] as Role[],
    downloadable: true,
    content: placeholderDocumentContent,
  },
  {
    id: "doc_5",
    category: "Protokolle",
    name: "Protokoll Beiratssitzung Q1 2024",
    type: "PDF",
    date: "15.03.2024",
    icon: GanttChartSquare,
    visibility: ["board"] as Role[],
    downloadable: true,
    content:
      "In der Beiratssitzung wurden die Angebote für die Sanierung der Fassade besprochen. Firma A wurde favorisiert. Des Weiteren wurde die Organisation des Sommerfestes geplant.",
  },
  {
    id: "doc_6",
    category: "Sonstiges",
    name: "Garagenordnung",
    type: "PDF",
    date: "01.03.2019",
    icon: Archive,
    visibility: ["owner", "resident"] as Role[],
    downloadable: false,
    content:
      "Die Garagenordnung regelt die Nutzung der Tiefgarage. Es ist verboten, brennbare Materialien zu lagern oder Reparaturen an Fahrzeugen durchzuführen. Die Stellplätze sind sauber zu halten.",
  },
];

type Document = (typeof allDocuments)[0];
type Role = "owner" | "resident" | "board";
const roleIcons: Record<Role, React.ElementType> = {
    owner: KeyRound,
    resident: Users,
    board: UserCheck
}
const roleLabels: Record<Role, string> = {
    owner: "Eigentümer",
    resident: "Bewohner",
    board: "Beirat"
}

export default function DocumentsArchivePage() {
  const [documents, setDocuments] = React.useState<Document[]>(allDocuments);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { toast } = useToast();

  const filteredDocs = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const protocols = filteredDocs.filter((d) => d.category === "Protokolle");
  const officialDocs = filteredDocs.filter((d) => d.category === "Dokumente");
  const others = filteredDocs.filter((d) => d.category === "Sonstiges");

  const handleViewClick = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewDialogOpen(true);
  };
  
  const handleDownloadClick = (doc: Document) => {
    if (!doc.downloadable) {
        toast({
            title: "Download nicht möglich",
            description: "Dieses Dokument ist nur zur Ansicht freigegeben.",
            variant: "destructive"
        });
        return;
    }
    const blob = new Blob([doc.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
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
            {docs.map((doc) => {
                return (
                    <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <doc.icon className="h-5 w-5 text-primary shrink-0" />
                            <div className="flex flex-col">
                                <span>{doc.name}</span>
                                <span className="text-xs text-muted-foreground">{doc.type}</span>
                            </div>
                        </div>
                        </TableCell>
                        <TableCell className="text-center">{doc.date}</TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-1">
                                {doc.visibility.map(role => {
                                    const Icon = roleIcons[role as Role];
                                    return <Badge key={role} variant="outline" className="flex items-center gap-1.5"><Icon className="h-3 w-3" /> {roleLabels[role as Role]}</Badge>
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
                              <DropdownMenuItem onClick={() => handleDownloadClick(doc)} disabled={!doc.downloadable}>
                                <Download className="mr-2 h-4 w-4" />
                                Herunterladen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                    </TableRow>
                )
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
        </div>

        <div className="max-w-5xl mx-auto mt-12">
            <div className="flex items-center justify-between mb-6 gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Dokumente durchsuchen..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
          <Card>
            <CardContent className="p-0">
               <Tabs defaultValue="protokolle" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="protokolle" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">Protokolle</TabsTrigger>
                  <TabsTrigger value="dokumente" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">Dokumente</TabsTrigger>
                  <TabsTrigger value="sonstiges" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">Sonstiges</TabsTrigger>
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
                </div>
              </Tabs>
            </CardContent>
          </Card>
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
          <DocumentSummarizer documentText={selectedDocument?.content || ""} />
        </DialogContent>
      </Dialog>
    </>
  );
}
