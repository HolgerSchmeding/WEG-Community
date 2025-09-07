'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SendHorizonal,
  Loader2,
  MapPin,
  Building,
  User,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Camera,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useTickets } from '@/hooks/use-tickets';

export default function AdminNewTicketPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, canCreateTicketsAsAdmin, isLoading } = useAuth();
  const { addTicket } = useTickets();

  // Debug: Zeige aktuelle Rolle
  React.useEffect(() => {
    console.log('Auth check:', {
      isLoading,
      userRole: user?.roles,
      canCreate: canCreateTicketsAsAdmin(),
    });
  }, [isLoading, user, canCreateTicketsAsAdmin]);

  // Formular-Zustand
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [house, setHouse] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [ownerName, setOwnerName] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Mobile-Erkennung
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Datei-Upload
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  // Validierung
  const canSubmit =
    firstName &&
    lastName &&
    subject &&
    message &&
    category &&
    house &&
    street &&
    city;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    // Simulation der Datei-Upload und Ticket-Erstellung
    setTimeout(() => {
      // Attachments konvertieren
      const attachments = uploadedFiles.map((file, index) => ({
        id: `att_${Date.now()}_${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
      }));

      // Ticket erstellen
      const ticketId = addTicket({
        subject,
        requester: user?.fullName || `${firstName} ${lastName}`,
        date: new Date().toLocaleDateString('de-DE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        status: 'Erstellt',
        reminderDate: null,
        category,
        message,
        attachments,
        house,
        street,
        city,
        ownerName: ownerName || undefined,
        createdByRole: 'hausverwalter',
      });

      setIsSubmitting(false);

      const attachmentInfo =
        uploadedFiles.length > 0
          ? ` mit ${uploadedFiles.length} Anhang${uploadedFiles.length > 1 ? 'en' : ''}`
          : '';

      toast({
        title: 'Ticket erfolgreich erstellt!',
        description: `Ticket "${subject}" (${ticketId})${attachmentInfo} wurde für ${house}, ${street}, ${city} erfasst.`,
      });

      console.log('Admin Ticket created:', ticketId);
      console.log('Location:', { house, street, city, ownerName });
      console.log(
        'Uploaded files:',
        uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
      );

      router.push('/admin');
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(Array.from(files));

      // Input zurücksetzen
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(Array.from(files));

      // Input zurücksetzen
      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
    }
  };

  const processFiles = (fileArray: File[]) => {
    // Validierung: Max 10MB pro Datei, max 5 Dateien
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    const validFiles = fileArray.filter(file => {
      if (file.size > maxFileSize) {
        toast({
          title: 'Datei zu groß',
          description: `Die Datei "${file.name}" ist größer als 10MB und wurde übersprungen.`,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      toast({
        title: 'Zu viele Dateien',
        description: `Sie können maximal ${maxFiles} Dateien hochladen.`,
        variant: 'destructive',
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4 text-green-600" />;
    }
    return <FileText className="h-4 w-4 text-blue-600" />;
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={url}
              alt={file.name}
              className="w-full h-full object-cover"
              onLoad={() => URL.revokeObjectURL(url)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)} • Bild
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {getFileIcon(file)}
        <div className="flex-1">
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Authentifizierung wird überprüft...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!canCreateTicketsAsAdmin()) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-red-600">
                  Keine Berechtigung
                </h2>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Sie haben keine Berechtigung, Tickets als Admin zu
                    erstellen.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Aktuelle Rolle:{' '}
                    <strong>{user?.roles?.[0] || 'Unbekannt'}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Benötigte Rollen: <strong>admin</strong> oder{' '}
                    <strong>hausverwalter</strong>
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/role-test')}
                  >
                    Rolle wechseln
                  </Button>
                  <Button onClick={() => router.push('/admin')}>
                    Zurück zum Admin-Bereich
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          ← Zurück
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Neues Ticket erstellen</h1>
          <p className="text-muted-foreground">
            Außendienst - Ticket für Hausverwaltung
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Ticket erfassen
            </CardTitle>
            <CardDescription>
              Als Hausverwalter können Sie hier direkt vor Ort Tickets für
              anfallende Arbeiten erfassen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mitarbeiter-Daten */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mitarbeiter
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Max"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Mustermann"
                    />
                  </div>
                </div>
              </div>

              {/* Objekt-Daten */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Objekt-Standort
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="house">Haus/Hausnummer *</Label>
                    <Input
                      id="house"
                      value={house}
                      onChange={e => setHouse(e.target.value)}
                      placeholder="z.B. Haus A, 123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Straße *</Label>
                    <Input
                      id="street"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      placeholder="Musterstraße 15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ort *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="12345 Musterstadt"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName">
                    Betroffener Wohnungseigentümer (optional)
                  </Label>
                  <Input
                    id="ownerName"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    placeholder="Falls nur eine spezifische Wohnung betroffen ist"
                  />
                </div>
              </div>

              {/* Ticket-Details */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Aufgabe/Problem
                </h3>

                <div className="space-y-4">
                  {/* Kategorie */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategorie *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bitte wählen Sie eine Kategorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">
                          Wartung & Reparaturen
                        </SelectItem>
                        <SelectItem value="emergency">
                          Notfall/Dringend
                        </SelectItem>
                        <SelectItem value="cleaning">Reinigung</SelectItem>
                        <SelectItem value="inspection">
                          Inspektion/Kontrolle
                        </SelectItem>
                        <SelectItem value="garden">
                          Garten & Außenanlage
                        </SelectItem>
                        <SelectItem value="security">Sicherheit</SelectItem>
                        <SelectItem value="other">Sonstiges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Betreff */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Titel/Betreff *</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Kurze Beschreibung des Problems/der Aufgabe"
                    />
                  </div>

                  {/* Beschreibung */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Detailbeschreibung *</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Ausführliche Beschreibung der festgestellten Probleme oder erforderlichen Arbeiten..."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </div>

              {/* Datei-Upload */}
              <div className="border-t pt-6 space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Fotos/Dokumente
                </Label>
                <p className="text-sm text-muted-foreground">
                  Fotografieren Sie Schäden oder Probleme direkt vor Ort (max. 5
                  Dateien, je max. 10MB).
                  <br />
                  <span className="inline sm:hidden">
                    📱 Nutzen Sie die Kamera-Funktion für schnelle Fotos.
                  </span>
                </p>

                {/* Upload Button */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Auf Mobilgeräten Kamera zuerst anzeigen */}
                  {isMobile ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={uploadedFiles.length >= 5}
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
                      >
                        <Camera className="h-4 w-4 text-blue-600" />
                        Foto aufnehmen
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadedFiles.length >= 5}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Dateien
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadedFiles.length >= 5}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Dateien auswählen
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={uploadedFiles.length >= 5}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Foto aufnehmen
                      </Button>
                    </>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="hidden"
                  />

                  <span className="text-sm text-muted-foreground">
                    {uploadedFiles.length}/5 Dateien
                  </span>
                </div>

                {/* Hochgeladene Dateien anzeigen */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Hochgeladene Dateien:
                    </Label>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          {getFilePreview(file)}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 flex-shrink-0 ml-3"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird erstellt...
                    </>
                  ) : (
                    <>
                      <SendHorizonal className="mr-2 h-4 w-4" />
                      Ticket erstellen
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
