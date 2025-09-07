'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Send,
  Sparkles,
  FileText,
  Users,
  Calendar,
  AlertTriangle,
  PartyPopper,
  Wrench,
  Euro,
  Copy,
  Eye,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

// Newsletter Templates
const newsletterTemplates = [
  {
    id: 'monthly',
    title: 'Monatlicher Newsletter',
    description: 'Regelmäßige Informationen für alle Bewohner',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-800',
    template: {
      subject: 'Monatliche WEG-Informationen - {{MONAT}} {{JAHR}}',
      content: `Liebe Bewohnerinnen und Bewohner,

mit unserem monatlichen Newsletter möchten wir Sie über alle wichtigen Ereignisse und Neuigkeiten in unserer WEG informieren.

**Aktuelle Themen:**
{{THEMEN_LISTE}}

**Termine im {{MONAT}}:**
{{TERMINE_LISTE}}

**Wichtige Mitteilungen:**
{{MITTEILUNGEN}}

Bei Fragen oder Anregungen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
{{HAUSVERWALTUNG_NAME}}
{{KONTAKT_INFO}}`,
    },
  },
  {
    id: 'maintenance',
    title: 'Wartungsankündigung',
    description: 'Informationen zu geplanten Wartungsarbeiten',
    icon: Wrench,
    color: 'bg-orange-100 text-orange-800',
    template: {
      subject: 'Wichtige Information: {{WARTUNG_ART}} am {{DATUM}}',
      content: `Liebe Bewohnerinnen und Bewohner,

hiermit informieren wir Sie über geplante Wartungsarbeiten in unserer Wohnanlage.

**Art der Arbeiten:** {{WARTUNG_ART}}
**Datum:** {{DATUM}}
**Uhrzeit:** {{UHRZEIT}}
**Betroffene Bereiche:** {{BEREICHE}}

**Auswirkungen:**
{{AUSWIRKUNGEN}}

**Bitte beachten Sie:**
{{HINWEISE}}

Wir bitten um Ihr Verständnis für die entstehenden Unannehmlichkeiten.

Mit freundlichen Grüßen
{{HAUSVERWALTUNG_NAME}}`,
    },
  },
  {
    id: 'event',
    title: 'Veranstaltungseinladung',
    description: 'Einladung zu WEG-Events und Gemeinschaftsveranstaltungen',
    icon: PartyPopper,
    color: 'bg-purple-100 text-purple-800',
    template: {
      subject: 'Einladung: {{EVENT_NAME}} am {{DATUM}}',
      content: `Liebe Bewohnerinnen und Bewohner,

wir laden Sie herzlich zu unserem {{EVENT_NAME}} ein!

**Veranstaltung:** {{EVENT_NAME}}
**Datum:** {{DATUM}}
**Uhrzeit:** {{UHRZEIT}}
**Ort:** {{ORT}}

**Programm:**
{{PROGRAMM}}

**Wichtige Informationen:**
{{INFOS}}

Wir freuen uns auf Ihr Kommen und ein gemütliches Beisammensein!

Mit freundlichen Grüßen
{{WEG_VERWALTUNGSBEIRAT}}`,
    },
  },
  {
    id: 'financial',
    title: 'Finanzielle Mitteilungen',
    description: 'Hausgeld, Kostenverteilung und Budget-Informationen',
    icon: Euro,
    color: 'bg-green-100 text-green-800',
    template: {
      subject: 'Finanzielle Mitteilungen - {{QUARTAL}}/{{JAHR}}',
      content: `Liebe Eigentümerinnen und Eigentümer,

hiermit informieren wir Sie über die aktuellen finanziellen Angelegenheiten unserer WEG.

**Hausgeldzahlungen {{ZEITRAUM}}:**
{{HAUSGELD_INFO}}

**Kostenverteilung:**
{{KOSTEN_AUFSTELLUNG}}

**Geplante Ausgaben:**
{{GEPLANTE_AUSGABEN}}

**Wichtige Termine:**
{{TERMINE}}

Bei Fragen zur Abrechnung wenden Sie sich bitte an uns.

Mit freundlichen Grüßen
{{HAUSVERWALTUNG_NAME}}`,
    },
  },
];

// KI Keywords für verschiedene Kategorien
const aiKeywordCategories = [
  {
    category: 'Wartung & Reparaturen',
    keywords: [
      'Heizung',
      'Aufzug',
      'Dach',
      'Fassade',
      'Garten',
      'Reinigung',
      'Elektrik',
      'Sanitär',
      'Fenster',
      'Türen',
    ],
  },
  {
    category: 'Gemeinschaft & Events',
    keywords: [
      'Sommerfest',
      'Nachbarschaftstreffen',
      'Grillabend',
      'Weihnachtsfeier',
      'Frühjahrsputz',
      'Gartenpflege',
    ],
  },
  {
    category: 'Verwaltung & Termine',
    keywords: [
      'Eigentümerversammlung',
      'Beiratssitzung',
      'Hausordnung',
      'Parkplätze',
      'Müllentsorgung',
      'Winterdienst',
    ],
  },
  {
    category: 'Kosten & Finanzen',
    keywords: [
      'Hausgeld',
      'Nebenkosten',
      'Rücklage',
      'Sanierung',
      'Modernisierung',
      'Versicherung',
      'Steuern',
    ],
  },
];

export default function NewsletterPage() {
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');
  const [newsletterSubject, setNewsletterSubject] = React.useState('');
  const [newsletterContent, setNewsletterContent] = React.useState('');
  const [selectedKeywords, setSelectedKeywords] = React.useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = newsletterTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setNewsletterSubject(template.template.subject);
      setNewsletterContent(template.template.content);
    }
  };

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const generateAIContent = async () => {
    if (!aiPrompt.trim() && selectedKeywords.length === 0) return;

    setIsGenerating(true);

    // Simulierte KI-Generierung (in der Realität würde hier ein API-Call stattfinden)
    const keywords = selectedKeywords.join(', ');
    const prompt =
      aiPrompt || `Newsletter-Text erstellen mit den Themen: ${keywords}`;

    setTimeout(() => {
      const aiGeneratedContent = `Liebe Bewohnerinnen und Bewohner,

wir möchten Sie über folgende wichtige Themen informieren:

**${selectedKeywords.includes('Heizung') ? '🔥 Heizungsmodernisierung:' : '📋 Aktuelle Informationen:'}**
${selectedKeywords.includes('Heizung') ? 'Die geplante Modernisierung unserer Heizungsanlage wird voraussichtlich im Herbst beginnen. Wir werden Sie rechtzeitig über den genauen Zeitplan und mögliche Beeinträchtigungen informieren.' : 'Basierend auf Ihren Stichworten haben wir relevante Informationen für Sie zusammengestellt.'}

**Wichtige Termine:**
${selectedKeywords.includes('Eigentümerversammlung') ? '• Ordentliche Eigentümerversammlung: 15. September 2025, 19:00 Uhr\n• Beiratssitzung: 5. Oktober 2025, 18:30 Uhr' : '• Termine werden rechtzeitig bekanntgegeben'}

**${selectedKeywords.includes('Sommerfest') ? '🎉 Gemeinschaftsveranstaltung:' : '🏠 Hausverwaltung:'}**
${selectedKeywords.includes('Sommerfest') ? 'Unser diesjähriges Sommerfest findet am 3. September auf der Festwiese statt. Wir freuen uns auf Ihr Kommen!' : 'Bei Fragen oder Anliegen stehen wir Ihnen gerne zur Verfügung.'}

Ihr Prompt: "${prompt}"

Mit freundlichen Grüßen
Eiswirth Johannes, Dipl.-Ing.
Immobilien- u. Vermögensverwaltung GmbH`;

      setNewsletterContent(aiGeneratedContent);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newsletterContent);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Admin-Übersicht
          </Link>
        </Button>
        <Badge variant="outline" className="text-base py-2 px-4 border-2">
          <Send className="mr-2 h-5 w-5" />
          Newsletter-Center
        </Badge>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-block bg-sky-100 p-3 rounded-lg mb-4">
          <Send className="h-8 w-8 text-sky-600" />
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Newsletter & Rundschreiben
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Professionelle Kommunikation mit allen Bewohnern - Templates verwenden
          oder KI-gestützt erstellen.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Newsletter erstellen</TabsTrigger>
            <TabsTrigger value="templates">Vorlagen</TabsTrigger>
            <TabsTrigger value="ai-assistant">KI-Assistent</TabsTrigger>
          </TabsList>

          {/* Newsletter erstellen */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Newsletter-Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Betreff</Label>
                      <Input
                        id="subject"
                        value={newsletterSubject}
                        onChange={e => setNewsletterSubject(e.target.value)}
                        placeholder="Newsletter Betreff eingeben..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Inhalt</Label>
                      <Textarea
                        id="content"
                        value={newsletterContent}
                        onChange={e => setNewsletterContent(e.target.value)}
                        placeholder="Newsletter-Inhalt eingeben oder Template auswählen..."
                        rows={12}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline">
                        <Copy className="mr-2 h-4 w-4" />
                        Kopieren
                      </Button>
                      <Button
                        onClick={() => setPreviewMode(!previewMode)}
                        variant="outline"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {previewMode ? 'Editor' : 'Vorschau'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Versand-Einstellungen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Empfängergruppe</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            Alle Bewohner (128 Einheiten)
                          </SelectItem>
                          <SelectItem value="owners">
                            Nur Eigentümer (87 Personen)
                          </SelectItem>
                          <SelectItem value="tenants">
                            Nur Mieter (41 Personen)
                          </SelectItem>
                          <SelectItem value="board">
                            Nur Verwaltungsbeirat (7 Personen)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Versandzeitpunkt</Label>
                      <Select defaultValue="now">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="now">Sofort versenden</SelectItem>
                          <SelectItem value="schedule">
                            Geplanter Versand
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      Newsletter versenden
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {previewMode ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Live-Vorschau</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white border rounded-lg p-6 space-y-4">
                        <div className="border-b pb-2">
                          <div className="text-sm text-muted-foreground">
                            Von: hausverwaltung@eiswirth.de
                          </div>
                          <div className="text-sm text-muted-foreground">
                            An: alle-bewohner@weg-community.de
                          </div>
                          <div className="font-semibold">
                            {newsletterSubject || 'Newsletter Betreff'}
                          </div>
                        </div>
                        <div className="whitespace-pre-wrap text-sm">
                          {newsletterContent ||
                            'Newsletter-Inhalt wird hier angezeigt...'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Schnellauswahl Templates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        {newsletterTemplates.map(template => (
                          <div
                            key={template.id}
                            className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedTemplate === template.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border'
                            }`}
                            onClick={() => handleTemplateSelect(template.id)}
                          >
                            <div className="flex items-start gap-3">
                              <template.icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <div className="font-medium">
                                  {template.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {template.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Letzte Newsletter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          subject: 'Monatliche Informationen - August 2025',
                          date: '5. August 2025',
                          recipients: 128,
                        },
                        {
                          subject: 'Heizungsmodernisierung - Terminankündigung',
                          date: '28. Juli 2025',
                          recipients: 87,
                        },
                        {
                          subject: 'Einladung zum Sommerfest 2025',
                          date: '15. Juli 2025',
                          recipients: 128,
                        },
                      ].map((newsletter, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {newsletter.subject}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {newsletter.date} • {newsletter.recipients}{' '}
                              Empfänger
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsletterTemplates.map(template => (
                <Card
                  key={template.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${template.color.replace('text-', 'bg-').split(' ')[0]}`}
                      >
                        <template.icon
                          className={`h-5 w-5 ${template.color.split(' ')[1]}`}
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {template.title}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {template.description}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs font-semibold">
                          BETREFF-VORLAGE:
                        </Label>
                        <div className="text-sm bg-muted p-2 rounded font-mono">
                          {template.template.subject}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">
                          CONTENT-VORLAGE:
                        </Label>
                        <div className="text-sm bg-muted p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap font-mono">
                          {template.template.content.substring(0, 200)}...
                        </div>
                      </div>
                      <Button
                        onClick={() => handleTemplateSelect(template.id)}
                        className="w-full"
                        variant="outline"
                      >
                        Template verwenden
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* KI-Assistent */}
          <TabsContent value="ai-assistant">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      KI-Newsletter Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="ai-prompt">
                        Beschreibung / Stichworte
                      </Label>
                      <Textarea
                        id="ai-prompt"
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        placeholder="Beschreiben Sie, worum es in dem Newsletter gehen soll... z.B. 'Newsletter über geplante Heizungsmodernisierung im Herbst, Sommerfest und neue Hausordnung'"
                        rows={4}
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label>Themen-Kategorien auswählen</Label>
                      <div className="space-y-4 mt-2">
                        {aiKeywordCategories.map(category => (
                          <div key={category.category}>
                            <div className="text-sm font-medium mb-2">
                              {category.category}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {category.keywords.map(keyword => (
                                <Badge
                                  key={keyword}
                                  variant={
                                    selectedKeywords.includes(keyword)
                                      ? 'default'
                                      : 'outline'
                                  }
                                  className="cursor-pointer hover:bg-primary/20"
                                  onClick={() => handleKeywordToggle(keyword)}
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={generateAIContent}
                      className="w-full"
                      disabled={isGenerating}
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                          KI generiert...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Newsletter generieren
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ausgewählte Themen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedKeywords.map(keyword => (
                          <Badge key={keyword} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">
                        Wählen Sie Themen-Stichworte aus oder geben Sie eine
                        eigene Beschreibung ein.
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>KI-Tipps für bessere Newsletter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Klare Struktur:</strong> Verwenden Sie
                          Überschriften und Aufzählungen für bessere Lesbarkeit.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Zielgruppe:</strong> Wählen Sie die passende
                          Ansprache für Ihre Bewohner.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Termine:</strong> Fügen Sie immer konkrete
                          Daten und Uhrzeiten hinzu.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
