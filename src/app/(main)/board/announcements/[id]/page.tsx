'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Loader2, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock data - in a real app, this would come from an API
const mockAnnouncements = [
  {
    id: '1',
    title: 'Wartung der Aufzugsanlage',
    author: 'Hausverwaltung',
    status: 'Aktiv',
    content:
      'Sehr geehrte Bewohnerinnen und Bewohner, bitte beachten Sie, dass am kommenden Freitag, den 19. Juli 2024, zwischen 8:00 und 12:00 Uhr die jährliche Wartung der Aufzugsanlage stattfindet. In diesem Zeitraum wird der Aufzug außer Betrieb sein. Wir bitten um Ihr Verständnis.',
    visibility: { residents: true, owners: true },
    expiresAt: new Date(2024, 6, 20), // July 20, 2024
  },
];

export default function AnnouncementFormPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const id = params.id as string;
  const isNew = id === 'new';

  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [author, setAuthor] = React.useState('WEG-Verwaltungsbeirat');
  const [status, setStatus] = React.useState('Entwurf');
  const [visibility, setVisibility] = React.useState({
    residents: true,
    owners: false,
  });
  const [expiresAt, setExpiresAt] = React.useState<Date | undefined>(undefined);

  const [isLoading, setIsLoading] = React.useState(!isNew);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isNew) {
      // Simulate fetching data
      setTimeout(() => {
        const announcement = mockAnnouncements.find(a => a.id === id);
        if (announcement) {
          setTitle(announcement.title);
          setContent(announcement.content);
          setAuthor(announcement.author);
          setStatus(announcement.status);
          setVisibility(announcement.visibility);
          setExpiresAt(announcement.expiresAt);
        } else {
          toast({
            variant: 'destructive',
            title: 'Fehler',
            description: 'Aushang nicht gefunden.',
          });
          router.push('/board/announcements');
        }
        setIsLoading(false);
      }, 500);
    }
  }, [isNew, id, router, toast]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    // Simulate saving data
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: isNew ? 'Aushang erstellt' : 'Änderungen gespeichert',
        description: `Der Aushang "${title}" wurde erfolgreich gesichert.`,
      });
      router.push('/board/announcements');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <BackButton text="Zurück zur Übersicht" />
        <div className="max-w-2xl mx-auto mt-8">
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <BackButton text="Zurück zur Übersicht" />

      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {isNew ? 'Neuen Aushang erstellen' : 'Aushang bearbeiten'}
            </CardTitle>
            <CardDescription>
              Füllen Sie die Felder aus, um den Aushang zu erstellen oder zu
              aktualisieren.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Titel des Aushangs"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Inhalt</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Vollständiger Text des Aushangs..."
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Select value={author} onValueChange={setAuthor}>
                    <SelectTrigger id="author">
                      <SelectValue placeholder="Autor auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEG-Verwaltungsbeirat">
                        WEG-Verwaltungsbeirat
                      </SelectItem>
                      <SelectItem value="Hausverwaltung">
                        Hausverwaltung
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <RadioGroup
                    value={status}
                    onValueChange={setStatus}
                    className="flex items-center space-x-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Entwurf" id="status-draft" />
                      <Label htmlFor="status-draft" className="font-normal">
                        Entwurf
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Aktiv" id="status-active" />
                      <Label htmlFor="status-active" className="font-normal">
                        Veröffentlichen
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Sichtbarkeit</Label>
                  <div className="flex items-center space-x-4 pt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="residents"
                        checked={visibility.residents}
                        onCheckedChange={checked =>
                          setVisibility(v => ({ ...v, residents: !!checked }))
                        }
                      />
                      <Label htmlFor="residents" className="font-normal">
                        Für Bewohner
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="owners"
                        checked={visibility.owners}
                        onCheckedChange={checked =>
                          setVisibility(v => ({ ...v, owners: !!checked }))
                        }
                      />
                      <Label htmlFor="owners" className="font-normal">
                        Für Eigentümer
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Verfällt am (optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !expiresAt && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiresAt ? (
                          format(expiresAt, 'dd. MMMM yyyy', { locale: de })
                        ) : (
                          <span>Datum auswählen</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={expiresAt}
                        onSelect={setExpiresAt}
                        initialFocus
                        locale={de}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Speichern
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
