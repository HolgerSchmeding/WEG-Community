'use client';

import React, { useState } from 'react';
import { LiveProtocolSessionComponent } from '@/components/admin/live-protocol-session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LiveProtocolSession } from '@/lib/types';
import { FileText, Plus, Clock, Users, Calendar, Play } from 'lucide-react';

// Vereinfachte Meeting-Struktur für Live-Protokoll
interface SimpleMeeting {
  id: string;
  title: string;
  date: Date;
  location: string;
  type: string;
  agenda: {
    id: string;
    order: number;
    title: string;
    description: string;
    type: string;
    duration: number;
    requiresVoting: boolean; // Kennzeichnung für Abstimmung
  }[];
}

// Mock verfügbare Meetings aus der Versammlungsplanung
const availableMeetings: SimpleMeeting[] = [
  {
    id: 'meeting-2025-01-15',
    title: 'Ordentliche Eigentümerversammlung 2025',
    date: new Date('2025-01-15T18:00:00'),
    location: 'Gemeinschaftsraum, Musterstraße 123',
    type: 'Eigentümerversammlung',
    agenda: [
      {
        id: 'top-1',
        order: 1,
        title: 'Begrüßung und Feststellung der Beschlussfähigkeit',
        description: 'Versammlungsleiter begrüßt die Anwesenden und stellt die Beschlussfähigkeit fest.',
        type: 'Information',
        duration: 10,
        requiresVoting: false
      },
      {
        id: 'top-2',
        order: 2,
        title: 'Genehmigung der Tagesordnung',
        description: 'Die versendete Tagesordnung wird zur Abstimmung gestellt.',
        type: 'Beschluss',
        duration: 5,
        requiresVoting: true
      },
      {
        id: 'top-3',
        order: 3,
        title: 'Genehmigung des Protokolls der letzten Versammlung',
        description: 'Das Protokoll der Eigentümerversammlung vom 15.01.2024 wird zur Genehmigung vorgelegt.',
        type: 'Beschluss',
        duration: 10,
        requiresVoting: true
      },
      {
        id: 'top-4',
        order: 4,
        title: 'Jahresabschluss 2024 - Entlastung des Verwalters',
        description: 'Präsentation der Jahresabrechnung 2024 und Abstimmung über die Entlastung der Verwaltung.',
        type: 'Beschluss',
        duration: 30,
        requiresVoting: true
      },
      {
        id: 'top-5',
        order: 5,
        title: 'Wirtschaftsplan 2025 - Hausgelderhöhung',
        description: 'Vorstellung des Wirtschaftsplans 2025 mit geplanter Hausgeldanpassung von durchschnittlich 15€ pro Einheit.',
        type: 'Beschluss',
        duration: 45,
        requiresVoting: true
      },
      {
        id: 'top-6',
        order: 6,
        title: 'Sonderumlage für Dachsanierung',
        description: 'Abstimmung über Sonderumlage in Höhe von 180.000€ für die dringend erforderliche Dachsanierung.',
        type: 'Beschluss',
        duration: 60,
        requiresVoting: true
      },
      {
        id: 'top-7',
        order: 7,
        title: 'Modernisierung der Heizungsanlage',
        description: 'Beratung über den Austausch der 25 Jahre alten Gasheizung gegen eine moderne Wärmepumpenanlage.',
        type: 'Beratung',
        duration: 45,
        requiresVoting: false
      },
      {
        id: 'top-8',
        order: 8,
        title: 'Wahl des Verwaltungsbeirats',
        description: 'Neuwahl des Verwaltungsbeirats für die Amtszeit 2025-2027. Kandidaten: Schmidt, Müller, Weber.',
        type: 'Beschluss',
        duration: 30,
        requiresVoting: true
      },
      {
        id: 'top-9',
        order: 9,
        title: 'Verschiedenes',
        description: 'Weitere Anträge und Wortmeldungen der Eigentümer.',
        type: 'Information',
        duration: 15,
        requiresVoting: false
      }
    ]
  },
  {
    id: 'meeting-2025-03-20',
    title: 'Außerordentliche Eigentümerversammlung - Notfallsanierung',
    date: new Date('2025-03-20T19:00:00'),
    location: 'Bürgerhaus Musterstadt',
    type: 'Außerordentliche Versammlung',
    agenda: [
      {
        id: 'top-1',
        order: 1,
        title: 'Begrüßung und Feststellung der Beschlussfähigkeit',
        description: 'Versammlungsleiter begrüßt die Anwesenden.',
        type: 'Information',
        duration: 5,
        requiresVoting: false
      },
      {
        id: 'top-2',
        order: 2,
        title: 'Wasserschaden Keller - Sofortmaßnahmen',
        description: 'Abstimmung über Notfall-Sonderumlage von 50.000€ für Wasserschadensanierung.',
        type: 'Beschluss',
        duration: 45,
        requiresVoting: true
      }
    ]
  }
];

export default function AdminLiveProtocolPage() {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const [session, setSession] = useState<LiveProtocolSession | null>(null);
  const [sessionConfig, setSessionConfig] = useState({
    chairperson: '',
    secretary: '',
    totalVoters: ''
  });

  const createSession = () => {
    const selectedMeeting = availableMeetings.find(m => m.id === selectedMeetingId);
    if (!selectedMeeting || !sessionConfig.chairperson || !sessionConfig.secretary || !sessionConfig.totalVoters) {
      return;
    }

    const newSession: LiveProtocolSession = {
      id: `session-${selectedMeetingId}-${Date.now()}`,
      meetingEventId: selectedMeetingId,
      meetingTitle: selectedMeeting.title,
      meetingDate: selectedMeeting.date,
      chairperson: sessionConfig.chairperson,
      secretary: sessionConfig.secretary,
      totalVoters: parseInt(sessionConfig.totalVoters),
      currentTopIndex: 0,
      status: 'Vorbereitung',
      items: selectedMeeting.agenda.map((item: any) => ({
        id: item.id,
        topNumber: item.order,
        title: item.title,
        description: item.description, // Subtext aus der Tagesordnung
        requiresVoting: item.requiresVoting, // Abstimmungs-Kennzeichnung übertragen
        discussion: '',
        isCompleted: false,
        notes: '',
        keywords: '',
        currentVoters: parseInt(sessionConfig.totalVoters) // Anfangswert = Gesamtzahl
      }))
    };

    setSession(newSession);
  };

  const handleUpdateSession = (updatedSession: LiveProtocolSession) => {
    console.log('Session Update:', updatedSession);
    setSession(updatedSession);
  };

  if (session) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-4">
          <Button 
            onClick={() => setSession(null)} 
            variant="outline"
            className="mb-4"
          >
            ← Zurück zur Auswahl
          </Button>
        </div>
        <LiveProtocolSessionComponent 
          session={session}
          onUpdateSession={handleUpdateSession}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Live-Protokollierung (Admin)
          </h1>
          <p className="text-muted-foreground mt-1">
            Neue Protokollsitzung für eine geplante Eigentümerversammlung starten
          </p>
        </div>
      </div>

      {/* Session Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Neue Protokollsitzung einrichten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meeting Selection */}
          <div className="space-y-3">
            <Label htmlFor="meeting-select">Versammlung auswählen</Label>
            <Select value={selectedMeetingId} onValueChange={setSelectedMeetingId}>
              <SelectTrigger>
                <SelectValue placeholder="Wählen Sie eine geplante Versammlung aus..." />
              </SelectTrigger>
              <SelectContent>
                {availableMeetings.map(meeting => (
                  <SelectItem key={meeting.id} value={meeting.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{meeting.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {meeting.date.toLocaleDateString('de-DE', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Meeting Details Preview */}
          {selectedMeetingId && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                {(() => {
                  const meeting = availableMeetings.find(m => m.id === selectedMeetingId);
                  return meeting ? (
                    <div className="space-y-3">
                      <h4 className="font-medium">Tagesordnung ({meeting.agenda.length} TOPs)</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {meeting.agenda.map((item: any) => (
                          <div key={item.id} className="flex gap-2 text-sm">
                            <span className="font-medium min-w-12">TOP {item.order}:</span>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-muted-foreground text-xs">{item.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}

          {/* Session Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chairperson">Versammlungsleiter</Label>
              <Input
                id="chairperson"
                value={sessionConfig.chairperson}
                onChange={(e) => setSessionConfig(prev => ({ ...prev, chairperson: e.target.value }))}
                placeholder="Name des Versammlungsleiters"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secretary">Protokollführer</Label>
              <Input
                id="secretary"
                value={sessionConfig.secretary}
                onChange={(e) => setSessionConfig(prev => ({ ...prev, secretary: e.target.value }))}
                placeholder="Name des Protokollführers"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalVoters">Anwesende Stimmberechtigte</Label>
              <Input
                id="totalVoters"
                type="number"
                value={sessionConfig.totalVoters}
                onChange={(e) => setSessionConfig(prev => ({ ...prev, totalVoters: e.target.value }))}
                placeholder="Anzahl"
                min="1"
              />
            </div>
          </div>

          {/* Start Button */}
          <Button 
            onClick={createSession}
            disabled={!selectedMeetingId || !sessionConfig.chairperson || !sessionConfig.secretary || !sessionConfig.totalVoters}
            className="w-full"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            Protokollsitzung starten
          </Button>
        </CardContent>
      </Card>

      {/* Available Meetings Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Verfügbare Versammlungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableMeetings.map(meeting => (
              <Card key={meeting.id} className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => setSelectedMeetingId(meeting.id)}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{meeting.title}</h4>
                      <Badge variant="secondary">{meeting.agenda.length} TOPs</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {meeting.date.toLocaleDateString('de-DE', { 
                        weekday: 'short',
                        day: '2-digit', 
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} • {meeting.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
