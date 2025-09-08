'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
  AlertCircle,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useTickets } from '@/hooks/use-tickets';
import {
  useFormValidation,
  validationSchemas,
} from '@/hooks/use-form-validation';
import { FormErrorBoundary } from '@/components/error-boundary';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';

// Form Schema Definition
const contactFormSchema = z.object({
  firstName: validationSchemas.required('Vorname ist erforderlich'),
  lastName: validationSchemas.required('Nachname ist erforderlich'),
  email: validationSchemas.email,
  phone: validationSchemas.phone.optional().or(z.literal('')),
  subject: validationSchemas.required('Betreff ist erforderlich'),
  category: validationSchemas.required('Kategorie ist erforderlich'),
  message: validationSchemas.minLength(
    10,
    'Nachricht muss mindestens 10 Zeichen lang sein'
  ),
  contactStatus: z.enum(['resident', 'owner'], {
    required_error: 'Bitte wählen Sie Ihren Status aus',
  }),
  attachments: z.array(z.any()).optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

type ContactStatus = 'resident' | 'owner' | '';

export default function NewContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addTicket } = useTickets();

  // File Upload State
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [showResidentDialog, setShowResidentDialog] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  // Mobile Detection
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

  // Form Validation Hook
  const {
    values,
    errors,
    isValid,
    isSubmitting,
    setValue,
    setError,
    getFieldError,
    hasFieldError,
    handleSubmit,
    reset,
  } = useFormValidation<ContactFormData>({
    schema: contactFormSchema,
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      category: '',
      message: '',
      contactStatus: 'owner', // Default
      attachments: [],
    },
    onSubmit: async data => {
      // Check if user is resident and show dialog
      if (data.contactStatus === 'resident') {
        setShowResidentDialog(true);
        return;
      }

      // Process form submission for owners
      const attachments = uploadedFiles.map((file, index) => ({
        id: `att_${Date.now()}_${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
      }));

      const ticketId = addTicket({
        subject: data.subject,
        requester: user?.fullName || `${data.firstName} ${data.lastName}`,
        date: new Date().toLocaleDateString('de-DE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        status: 'Erstellt',
        reminderDate: null,
        category: data.category,
        message: data.message,
        email: data.email,
        phone: data.phone || '',
        attachments,
      });

      const attachmentInfo =
        uploadedFiles.length > 0
          ? ` mit ${uploadedFiles.length} Anhang${uploadedFiles.length > 1 ? 'en' : ''}`
          : '';

      toast({
        title: 'Anfrage erfolgreich erstellt!',
        description: `Ihre Anfrage "${data.subject}" (${ticketId})${attachmentInfo} wurde an die Hausverwaltung weitergeleitet.`,
      });

      router.push('/contact');
    },
    resetOnSubmit: false,
  });

  // Handle contact status change
  const handleContactStatusChange = (status: ContactStatus) => {
    if (status === 'resident' || status === 'owner') {
      setValue('contactStatus', status);
      if (status === 'resident') {
        setShowResidentDialog(true);
      }
    }
  };

  const handleResidentDialogClose = () => {
    setShowResidentDialog(false);
    setValue('contactStatus', 'owner');
  };

  // File Upload Functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(Array.from(files));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(Array.from(files));
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const processFiles = (fileArray: File[]) => {
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
    setValue('attachments', [...uploadedFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setValue('attachments', newFiles);
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
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {getFileIcon(file)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
      </div>
    );
  };

  return (
    <FormErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Neue Anfrage</h1>
            <p className="text-muted-foreground">
              Erstellen Sie eine neue Anfrage an die Hausverwaltung
            </p>
          </div>
          <BackButton href="/contact" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktinformationen</CardTitle>
              <CardDescription>
                Bitte geben Sie Ihre persönlichen Daten ein
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname *</Label>
                  <Input
                    id="firstName"
                    value={values.firstName || ''}
                    onChange={e => setValue('firstName', e.target.value)}
                    className={
                      hasFieldError('firstName') ? 'border-red-500' : ''
                    }
                  />
                  {hasFieldError('firstName') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('firstName')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname *</Label>
                  <Input
                    id="lastName"
                    value={values.lastName || ''}
                    onChange={e => setValue('lastName', e.target.value)}
                    className={
                      hasFieldError('lastName') ? 'border-red-500' : ''
                    }
                  />
                  {hasFieldError('lastName') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('lastName')}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail-Adresse *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={values.email || ''}
                    onChange={e => setValue('email', e.target.value)}
                    className={hasFieldError('email') ? 'border-red-500' : ''}
                  />
                  {hasFieldError('email') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('email')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={values.phone || ''}
                    onChange={e => setValue('phone', e.target.value)}
                    className={hasFieldError('phone') ? 'border-red-500' : ''}
                  />
                  {hasFieldError('phone') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('phone')}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactStatus">Ihr Status in der WEG *</Label>
                <Select
                  value={values.contactStatus || ''}
                  onValueChange={handleContactStatusChange}
                >
                  <SelectTrigger
                    className={
                      hasFieldError('contactStatus') ? 'border-red-500' : ''
                    }
                  >
                    <SelectValue placeholder="Bitte wählen Sie Ihren Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Wohnungseigentümer/in</SelectItem>
                    <SelectItem value="resident">
                      Bewohner/in (Mieter/in)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {hasFieldError('contactStatus') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('contactStatus')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anliegen</CardTitle>
              <CardDescription>
                Beschreiben Sie Ihr Anliegen detailliert
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Betreff *</Label>
                <Input
                  id="subject"
                  value={values.subject || ''}
                  onChange={e => setValue('subject', e.target.value)}
                  placeholder="Kurze Beschreibung des Anliegens"
                  className={hasFieldError('subject') ? 'border-red-500' : ''}
                />
                {hasFieldError('subject') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('subject')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategorie *</Label>
                <Select
                  value={values.category || ''}
                  onValueChange={value => setValue('category', value)}
                >
                  <SelectTrigger
                    className={
                      hasFieldError('category') ? 'border-red-500' : ''
                    }
                  >
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Instandhaltung</SelectItem>
                    <SelectItem value="billing">Abrechnung</SelectItem>
                    <SelectItem value="general">Allgemeine Anfrage</SelectItem>
                    <SelectItem value="complaint">Beschwerde</SelectItem>
                    <SelectItem value="emergency">Notfall</SelectItem>
                  </SelectContent>
                </Select>
                {hasFieldError('category') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('category')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Nachricht *</Label>
                <Textarea
                  id="message"
                  value={values.message || ''}
                  onChange={e => setValue('message', e.target.value)}
                  placeholder="Beschreiben Sie Ihr Anliegen detailliert..."
                  rows={6}
                  className={hasFieldError('message') ? 'border-red-500' : ''}
                />
                {hasFieldError('message') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('message')}
                  </p>
                )}
              </div>

              {/* File Upload Section */}
              <div className="space-y-2">
                <Label>Anhänge (optional)</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadedFiles.length >= 5}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Dateien hochladen
                  </Button>

                  {isMobile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={uploadedFiles.length >= 5}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Foto aufnehmen
                    </Button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
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

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        {getFilePreview(file)}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Maximal 5 Dateien, je max. 10MB. Unterstützte Formate: Bilder,
                  PDF, DOC, TXT
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                !isValid || isSubmitting || values.contactStatus === 'resident'
              }
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gesendet...
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

        {/* Resident Dialog */}
        <Dialog open={showResidentDialog} onOpenChange={setShowResidentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Information für Bewohner
              </DialogTitle>
              <DialogDescription>
                Als Bewohner/Mieter können Sie über dieses System keine direkten
                Anfragen stellen.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Bitte wenden Sie sich bei Anliegen zunächst an Ihren Vermieter
                  oder direkt an die Hausverwaltung.
                </AlertDescription>
              </Alert>

              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Kontaktdaten der Hausverwaltung:</strong>
                </p>
                <p>Telefon: +49 (0) 30 12345678</p>
                <p>E-Mail: info@hausverwaltung-silberbach.de</p>
                <p>Sprechzeiten: Mo-Fr 9:00-17:00 Uhr</p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleResidentDialogClose}>Verstanden</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FormErrorBoundary>
  );
}
