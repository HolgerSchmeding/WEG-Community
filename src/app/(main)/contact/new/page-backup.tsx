"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SendHorizonal, Loader2, AlertCircle, User, Building2, Info, Upload, X, FileText, Image as ImageIcon, Paperclip, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useTickets } from "@/hooks/use-tickets";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ContactStatus = "resident" | "owner" | "";

export default function NewContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addTicket } = useTickets();
  
  // Formular-Zustand
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [contactStatus, setContactStatus] = React.useState<ContactStatus>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showResidentDialog, setShowResidentDialog] = React.useState(false);
  
  // Mobile-Erkennung
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Datei-Upload
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  // Validierung - Bewohner können nie submitten
  const canSubmit = firstName && lastName && email && subject && message && contactStatus === "owner" && category;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Nur für Wohnungseigentümer - normale Übermittlung
    if (contactStatus === "owner") {
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
          requester: user?.fullName || `${firstName} ${lastName}`, // Fallback auf Formular-Daten
          date: new Date().toLocaleDateString('de-DE', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          status: "Erstellt",
          reminderDate: null,
          category,
          message,
          email,
          phone,
          attachments,
        });
        
        setIsSubmitting(false);
        
        const attachmentInfo = uploadedFiles.length > 0 
          ? ` mit ${uploadedFiles.length} Anhang${uploadedFiles.length > 1 ? 'en' : ''}`
          : '';
        
        toast({
          title: "Anfrage erfolgreich erstellt!",
          description: `Ihre Anfrage "${subject}" (${ticketId})${attachmentInfo} wurde an die Hausverwaltung weitergeleitet. Sie erhalten in Kürze eine Bestätigung per E-Mail.`,
        });
        
        console.log("Ticket created:", ticketId);
        console.log("Uploaded files:", uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
        
        router.push("/contact");
      }, 2000);
    }
  };

  const handleResidentDialogClose = () => {
    setShowResidentDialog(false);
    // Formular zurücksetzen oder Status zurücksetzen
    setContactStatus("");
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
          title: "Datei zu groß",
          description: `Die Datei "${file.name}" ist größer als 10MB und wurde übersprungen.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    
    if (uploadedFiles.length + validFiles.length > maxFiles) {
      toast({
        title: "Zu viele Dateien",
        description: `Sie können maximal ${maxFiles} Dateien hochladen.`,
        variant: "destructive",
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

  return (
    <div className="container py-8">
      <BackButton text="Zurück zur Übersicht" />

      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Neue Anfrage erstellen</CardTitle>
            <CardDescription>
              Füllen Sie das Formular aus, um eine Anfrage an die Hausverwaltung zu senden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Status-Auswahl - MUSS vor Anfragesteller stehen */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Ihr Status *</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="owner"
                      checked={contactStatus === "owner"}
                      onCheckedChange={(checked) => {
                        if (checked) setContactStatus("owner");
                        else setContactStatus("");
                      }}
                    />
                    <Label htmlFor="owner" className="flex items-center gap-2 font-normal cursor-pointer">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      Wohnungseigentümer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="resident"
                      checked={contactStatus === "resident"}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setContactStatus("resident");
                          // Pop-up sofort anzeigen wenn Bewohner ausgewählt wird
                          setShowResidentDialog(true);
                        } else {
                          setContactStatus("");
                        }
                      }}
                    />
                    <Label htmlFor="resident" className="flex items-center gap-2 font-normal cursor-pointer">
                      <User className="h-4 w-4 text-green-600" />
                      Bewohner (Mieter)
                    </Label>
                  </div>
                </div>
                {!contactStatus && (
                  <p className="text-sm text-amber-600 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Bitte wählen Sie Ihren Status aus, um fortfahren zu können.
                  </p>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-lg mb-4">Anfragesteller</h3>
                
                {/* Name */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Max"
                      disabled={!contactStatus}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Mustermann"
                      disabled={!contactStatus}
                    />
                  </div>
                </div>

                {/* Kontakt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail-Adresse *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="max.mustermann@example.com"
                      disabled={!contactStatus}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonnummer (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0176 12345678"
                      disabled={!contactStatus}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-lg mb-4">Anfrage-Details</h3>
                
                {/* Kategorie */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="category">Kategorie *</Label>
                  <Select value={category} onValueChange={setCategory} disabled={!contactStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bitte wählen Sie eine Kategorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Wartung & Reparaturen</SelectItem>
                      <SelectItem value="billing">Abrechnung & Kosten</SelectItem>
                      <SelectItem value="administration">Verwaltung & Organisation</SelectItem>
                      <SelectItem value="community">Hausgemeinschaft</SelectItem>
                      <SelectItem value="other">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Betreff */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="subject">Betreff *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Kurze Beschreibung Ihres Anliegens"
                    disabled={!contactStatus}
                  />
                </div>

                {/* Nachricht */}
                <div className="space-y-2 mb-6">
                  <Label htmlFor="message">Nachricht *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Beschreiben Sie Ihr Anliegen detailliert..."
                    className="min-h-[120px]"
                    disabled={!contactStatus}
                  />
                </div>

                {/* Datei-Upload */}
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Anhänge (optional)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Laden Sie Bilder oder Dokumente hoch, die Ihre Anfrage unterstützen (max. 5 Dateien, je max. 10MB).
                    <br />
                    <span className="inline sm:hidden">📱 Nutzen Sie die Kamera-Funktion für schnelle Fotos vor Ort.</span>
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
                          disabled={!contactStatus || uploadedFiles.length >= 5}
                          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
                        >
                          <Camera className="h-4 w-4 text-blue-600" />
                          Foto aufnehmen
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={!contactStatus || uploadedFiles.length >= 5}
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
                          disabled={!contactStatus || uploadedFiles.length >= 5}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Dateien auswählen
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => cameraInputRef.current?.click()}
                          disabled={!contactStatus || uploadedFiles.length >= 5}
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
                      <Label className="text-sm font-medium">Hochgeladene Dateien:</Label>
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
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird versendet...
                    </>
                  ) : (
                    <>
                      <SendHorizonal className="mr-2 h-4 w-4" />
                      Anfrage senden
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Dialog für Bewohner/Mieter */}
      <Dialog open={showResidentDialog} onOpenChange={setShowResidentDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Information für Bewohner
            </DialogTitle>
            <DialogDescription className="space-y-4 text-left">
              <p>
                Sie sind als Bewohner (Mieter) eingeloggt.
              </p>
              <p>
                Bitte beachten Sie: Anfragen an die Hausverwaltung können ausschließlich von Wohnungseigentümern gestellt werden.
              </p>
              <p>
                Falls Sie ein Anliegen haben, informieren Sie bitte Ihren Wohnungseigentümer, damit dieser die Anfrage für Sie an die Hausverwaltung weiterleiten kann.
              </p>
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                <p className="font-medium text-amber-800 mb-2">
                  Wichtiger Hinweis bei Notfällen:
                </p>
                <p className="text-sm text-amber-700">
                  Bei dringenden Notfällen (z. B. Wasserrohrbruch, Heizungsausfall) nutzen Sie bitte die veröffentlichten Notfall-Rufnummern. Diese finden Sie im Aushang im Hausflur.
                </p>
              </div>
              <p className="text-center font-medium">
                Vielen Dank für Ihr Verständnis!
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleResidentDialogClose}>
              Verstanden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
