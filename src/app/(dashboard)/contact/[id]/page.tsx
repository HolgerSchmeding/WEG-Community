'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  SendHorizonal,
  Paperclip,
  Clock,
  Info,
  CheckCircle,
  User,
  Building,
  Save,
  PlusCircle,
  Loader2,
  CalendarIcon,
  Calendar as CalendarIconComponent,
  Mail,
  Phone,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const mockTicketDetails = {
  id: 'T2024-07-001',
  subject: 'Frage zur Nebenkostenabrechnung',
  status: 'In Bearbeitung',
  requester: 'Familie Mustermann',
  email: 'max.mustermann@example.com',
  phone: '0176 12345678',
  assignedTo: 'Hausverwaltung',
  createdAt: '19. Juli 2024, 10:32 Uhr',
  description:
    "Sehr geehrte Damen und Herren, ich habe eine Frage zu meiner Nebenkostenabrechnung vom letzten Jahr. Könnten Sie mir bitte die Position 'Sonstige Betriebskosten' genauer aufschlüsseln? Vielen Dank im Voraus.",
  reminderDate: null as Date | null,
  activities: [
    {
      actor: 'Hausverwaltung',
      avatarFallback: 'HV',
      date: '20. Juli 2024, 14:15 Uhr',
      comment:
        'Sehr geehrte/r Herr/Frau Mustermann, vielen Dank für Ihre Anfrage. Wir prüfen die Abrechnung und melden uns in Kürze mit einer detaillierten Aufschlüsselung bei Ihnen. Mit freundlichen Grüßen, Ihre Hausverwaltung',
    },
    {
      actor: 'Benutzer',
      avatarFallback: 'BM',
      date: '20. Juli 2024, 16:40 Uhr',
      comment:
        'Vielen Dank für die schnelle Rückmeldung. Ich warte auf Ihre Antwort.',
    },
  ],
};

type Activity = (typeof mockTicketDetails.activities)[0];
type Ticket = typeof mockTicketDetails;

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const id = params.id as string;
  const isNew = id === 'new';

  const [ticket, setTicket] = React.useState<Ticket | null>(
    isNew ? null : mockTicketDetails
  );
  const [newReply, setNewReply] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);

  // Form state for new tickets and reminder date
  const [subject, setSubject] = React.useState('');
  const [requester, setRequester] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [reminderDate, setReminderDate] = React.useState<Date | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (ticket?.reminderDate) {
      setReminderDate(new Date(ticket.reminderDate));
    }
  }, [ticket?.reminderDate]);

  const handleReplySubmit = () => {
    if (!newReply.trim() || !ticket) return;
    setIsSending(true);

    const newActivity: Activity = {
      actor: ticket.assignedTo,
      avatarFallback: ticket.assignedTo === 'Hausverwaltung' ? 'HV' : 'WB',
      date:
        new Date().toLocaleString('de-DE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' Uhr',
      comment: newReply,
    };

    setTimeout(() => {
      setTicket(prevTicket =>
        prevTicket
          ? {
              ...prevTicket,
              activities: [...prevTicket.activities, newActivity],
            }
          : null
      );
      setNewReply('');
      setIsSending(false);
      toast({
        title: 'Antwort gesendet',
        description: 'Ihre Antwort wurde dem Ticket-Verlauf hinzugefügt.',
      });
    }, 500);
  };

  const handleCreateTicket = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: 'Ticket erstellt',
        description: `Das Ticket "${subject}" wurde erfolgreich angelegt.`,
      });
      router.push('/contact');
    }, 1000);
  };

  const handleStatusChange = (newStatus: string) => {
    if (!ticket) return;
    const shouldKeepReminderDate = ['Wartend', 'Zur Erledigung'].includes(
      newStatus
    );
    setTicket(prev =>
      prev
        ? {
            ...prev,
            status: newStatus,
            reminderDate: shouldKeepReminderDate ? prev.reminderDate : null,
          }
        : null
    );

    if (!shouldKeepReminderDate) {
      setReminderDate(undefined);
    }

    toast({
      title: 'Status aktualisiert',
      description: `Der Status wurde auf "${newStatus}" gesetzt.`,
    });
  };

  const handleAssignmentChange = (newAssignee: string) => {
    if (!ticket) return;
    setTicket(prev => (prev ? { ...prev, assignedTo: newAssignee } : null));
    toast({
      title: 'Zuständigkeit geändert',
      description: `Das Ticket wurde an "${newAssignee}" zugewiesen.`,
    });
  };

  const handleReminderDateChange = (date: Date | undefined) => {
    setReminderDate(date);
    if (!ticket) return;
    setTicket(prev => (prev ? { ...prev, reminderDate: date || null } : null));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Erledigt':
        return 'bg-green-600';
      case 'In Bearbeitung':
        return 'bg-blue-500 text-white';
      case 'Wartend':
        return 'bg-orange-500 text-white';
      case 'Zur Erledigung':
        return 'bg-yellow-500 text-yellow-950';
      case 'Offen':
        return 'bg-red-500 text-white';
      default:
        return '';
    }
  };

  if (isNew) {
    return (
      <div className="container py-8">
        <BackButton text="Zurück zur Übersicht" />
        <div className="max-w-3xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Neues Ticket erstellen
              </CardTitle>
              <CardDescription>
                Erfassen Sie eine neue Anfrage im Namen eines Bewohners oder
                Eigentümers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requester">Anfragesteller</Label>
                  <Input
                    id="requester"
                    value={requester}
                    onChange={e => setRequester(e.target.value)}
                    placeholder="z.B. Familie Mustermann"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail Adresse</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="max.mustermann@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonnummer (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0176 12345678"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Betreff</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Kurze Beschreibung des Anliegens"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung der Anfrage</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Detaillierte Beschreibung des Anliegens..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline" size="sm" type="button">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Anhang hinzufügen
                  </Button>
                  <Button type="submit" disabled={isSending}>
                    {isSending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Ticket speichern
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!ticket) return null; // Should not happen if not new

  const showReminderDate =
    ticket.status === 'Wartend' || ticket.status === 'Zur Erledigung';

  return (
    <div className="container py-8">
      <BackButton text="Zurück zur Übersicht" />

      <div className="max-w-3xl mx-auto mt-8 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  Ticket-ID: {ticket.id}
                </Badge>
                <CardTitle className="font-headline text-2xl">
                  {ticket.subject}
                </CardTitle>
                <CardDescription className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Von: {ticket.requester}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Erstellt: {ticket.createdAt}
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {ticket.email}
                  </span>
                  {ticket.phone && (
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {ticket.phone}
                    </span>
                  )}
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge
                  className={`text-base ${getStatusBadgeClass(ticket.status)}`}
                >
                  {ticket.status === 'In Bearbeitung' && (
                    <Info className="mr-2 h-4 w-4" />
                  )}
                  {ticket.status === 'Erledigt' && (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {ticket.status}
                </Badge>
                {reminderDate && showReminderDate && (
                  <div className="text-xs text-muted-foreground mt-2 flex items-center justify-end gap-1.5">
                    <CalendarIconComponent className="h-3 w-3" />
                    Wiedervorlage:{' '}
                    {format(new Date(reminderDate), 'dd.MM.yyyy')}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line p-4 bg-muted/50 rounded-md">
              {ticket.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              Verlauf & Bearbeitung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {ticket.activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{activity.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold">{activity.actor}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.date}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {activity.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>
                  {ticket.assignedTo === 'Hausverwaltung' ? 'HV' : 'WB'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="new-reply" className="inline-block mb-2">
                    Ihre Antwort als "{ticket.assignedTo}"
                  </Label>
                  <Textarea
                    id="new-reply"
                    placeholder="Ihre Antwort oder weitere Informationen..."
                    className="min-h-[120px]"
                    value={newReply}
                    onChange={e => setNewReply(e.target.value)}
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="font-semibold">
                        Status ändern
                      </Label>
                      <Select
                        value={ticket.status}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Status auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Offen">Offen</SelectItem>
                          <SelectItem value="In Bearbeitung">
                            In Bearbeitung
                          </SelectItem>
                          <SelectItem value="Zur Erledigung">
                            Zur Erledigung
                          </SelectItem>
                          <SelectItem value="Wartend">Wartend</SelectItem>
                          <SelectItem value="Erledigt">Erledigt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignee" className="font-semibold">
                        Zuweisen an
                      </Label>
                      <Select
                        value={ticket.assignedTo}
                        onValueChange={handleAssignmentChange}
                      >
                        <SelectTrigger id="assignee">
                          <SelectValue placeholder="Zuständigkeit zuweisen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WEG-Verwaltungsbeirat">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" /> WEG-Verwaltungsbeirat
                            </div>
                          </SelectItem>
                          <SelectItem value="Hausverwaltung">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" /> Hausverwaltung
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {showReminderDate && (
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="reminder" className="font-semibold">
                        Interne Wiedervorlage (optional)
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="reminder"
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !reminderDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reminderDate ? (
                              format(reminderDate, 'dd. MMMM yyyy', {
                                locale: de,
                              })
                            ) : (
                              <span>Datum auswählen</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reminderDate}
                            onSelect={handleReminderDateChange}
                            initialFocus
                            locale={de}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" size="sm" disabled={isSending}>
                    <Paperclip className="mr-2 h-4 w-4" />
                    Anhang hinzufügen
                  </Button>
                  <Button
                    onClick={handleReplySubmit}
                    disabled={isSending || !newReply.trim()}
                  >
                    <SendHorizonal className="mr-2 h-4 w-4" />
                    {isSending ? 'Senden...' : 'Antwort senden'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
