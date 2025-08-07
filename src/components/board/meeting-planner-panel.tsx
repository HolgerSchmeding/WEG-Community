"use client";

import { useState } from "react";
import { currentMeetingEvent } from "@/lib/mock-data";
import { MeetingEvent, MeetingType, MeetingStatus, InviteeGroup } from "@/lib/types";
import { Calendar, Clock, MapPin, Users, FileText, Save, Edit3, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function MeetingPlannerPanel() {
  const [meetingEvent, setMeetingEvent] = useState<MeetingEvent>(currentMeetingEvent);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<MeetingEvent>(currentMeetingEvent);

  const handleSave = () => {
    setMeetingEvent(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(meetingEvent);
    setIsEditing(false);
  };

  const getStatusColor = (status: MeetingStatus) => {
    switch (status) {
      case "Entwurf": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Planung": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Genehmigt": return "bg-green-100 text-green-800 border-green-200";
      case "Versendet": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: MeetingType) => {
    switch (type) {
      case "Eigentümerversammlung": return <Users className="h-4 w-4" />;
      case "Beiratssitzung": return <FileText className="h-4 w-4" />;
      case "Sonder-Eigentümerversammlung": return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  if (isEditing) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Versammlung bearbeiten
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meeting-type">Art der Versammlung</Label>
            <Select
              value={editForm.type}
              onValueChange={(value: MeetingType) => setEditForm({...editForm, type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Eigentümerversammlung">Eigentümerversammlung</SelectItem>
                <SelectItem value="Beiratssitzung">Beiratssitzung</SelectItem>
                <SelectItem value="Sonder-Eigentümerversammlung">Sonder-Eigentümerversammlung</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="meeting-title">Titel</Label>
            <Input
              id="meeting-title"
              value={editForm.title}
              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              placeholder="z.B. Ordentliche Eigentümerversammlung 2024"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="meeting-date">Datum</Label>
              <Input
                id="meeting-date"
                type="date"
                value={editForm.date ? format(editForm.date, 'yyyy-MM-dd') : ''}
                onChange={(e) => setEditForm({...editForm, date: e.target.value ? new Date(e.target.value) : undefined})}
              />
            </div>
            <div>
              <Label htmlFor="meeting-time">Uhrzeit</Label>
              <Input
                id="meeting-time"
                type="time"
                value={editForm.time || ''}
                onChange={(e) => setEditForm({...editForm, time: e.target.value})}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="font-medium">Ort der Versammlung</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Straße"
                value={editForm.location.street}
                onChange={(e) => setEditForm({...editForm, location: {...editForm.location, street: e.target.value}})}
              />
              <Input
                placeholder="Hausnummer"
                value={editForm.location.houseNumber}
                onChange={(e) => setEditForm({...editForm, location: {...editForm.location, houseNumber: e.target.value}})}
              />
            </div>
            <Input
              placeholder="Lokalität (z.B. Gemeindesaal, Verwaltungsraum)"
              value={editForm.location.locality}
              onChange={(e) => setEditForm({...editForm, location: {...editForm.location, locality: e.target.value}})}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="PLZ"
                value={editForm.location.postalCode || ''}
                onChange={(e) => setEditForm({...editForm, location: {...editForm.location, postalCode: e.target.value}})}
              />
              <Input
                placeholder="Stadt"
                value={editForm.location.city || ''}
                onChange={(e) => setEditForm({...editForm, location: {...editForm.location, city: e.target.value}})}
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="invitees">Einzuladende Personen</Label>
            <Select
              value={editForm.invitees}
              onValueChange={(value: InviteeGroup) => setEditForm({...editForm, invitees: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wohnungseigentümer">Wohnungseigentümer</SelectItem>
                <SelectItem value="Beirat">Beirat</SelectItem>
                <SelectItem value="Alle">Alle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={editForm.status}
              onValueChange={(value: MeetingStatus) => setEditForm({...editForm, status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entwurf">Entwurf</SelectItem>
                <SelectItem value="Planung">Planung</SelectItem>
                <SelectItem value="Genehmigt">Genehmigt</SelectItem>
                <SelectItem value="Versendet">Versendet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-1" />
              Speichern
            </Button>
            <Button variant="outline" onClick={handleCancel} size="sm">
              Abbrechen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getTypeIcon(meetingEvent.type)}
            Versammlungsplanung
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge className={cn("border", getStatusColor(meetingEvent.status))}>
              {meetingEvent.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {meetingEvent.agenda.length} TOPs
            </span>
          </div>
          <h3 className="font-medium text-sm">{meetingEvent.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{meetingEvent.type}</p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {meetingEvent.date ? format(meetingEvent.date, 'EEEE, dd. MMMM yyyy', { locale: de }) : 'Datum nicht festgelegt'}
            </span>
          </div>
          
          {meetingEvent.time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{meetingEvent.time} Uhr</span>
            </div>
          )}

          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <div>{meetingEvent.location.locality}</div>
              <div className="text-xs text-muted-foreground">
                {meetingEvent.location.street} {meetingEvent.location.houseNumber}
                {meetingEvent.location.city && (
                  <><br />{meetingEvent.location.postalCode} {meetingEvent.location.city}</>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{meetingEvent.invitees}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Nächste Schritte</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            {meetingEvent.status === "Entwurf" && (
              <div>• Tagesordnung fertigstellen</div>
            )}
            {meetingEvent.status === "Planung" && (
              <>
                <div>• Einladungen vorbereiten</div>
                <div>• Tagesordnung zur Genehmigung vorlegen</div>
              </>
            )}
            {meetingEvent.status === "Genehmigt" && (
              <div>• Einladungen versenden</div>
            )}
            {meetingEvent.status === "Versendet" && (
              <div>• Auf Versammlung warten</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
