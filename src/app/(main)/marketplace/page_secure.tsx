'use client';

import * as React from 'react';
import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import Image from 'next/image';
import {
  Store,
  Gift,
  Handshake,
  Calendar,
  User,
  MessageSquareQuote,
  PlusCircle,
  Paperclip,
  Mail as MailIcon,
  Phone,
  FileType,
  Edit3,
  Save,
  X,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  LoadingState,
  ButtonLoadingState,
} from '@/components/ui/loading-state';
import { NoMarketplaceItems } from '@/components/ui/empty-state';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  marketplaceItemSchema,
  editMarketplaceItemSchema,
  type MarketplaceItemFormData,
  type EditMarketplaceItemFormData,
  validateImageFile,
} from '@/lib/validations/marketplace';
import {
  addMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem,
} from '@/app/actions/marketplace';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const initialMarketplaceItems = [
  {
    id: '1',
    type: 'Gegenstand',
    title: 'Gut erhaltenes Kinderfahrrad',
    author: 'Familie Meier',
    date: '22. Juli 2024',
    price: 'Gegen Angebot',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'kids bicycle',
    description:
      'Wir geben ein gut erhaltenes 16-Zoll-Kinderfahrrad ab. Normale Gebrauchsspuren, aber voll funktionsfähig.',
    email: 'meier@beispiel.de',
    phone: '0123 456789',
    isOwnOffer: false,
  },
  {
    id: '2',
    type: 'Gegenstand',
    title: 'Zimmerpflanze (Monstera)',
    author: 'Frau Schmidt',
    date: '21. Juli 2024',
    price: 'Zu verschenken',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'monstera plant',
    description:
      'Unsere Monstera ist zu groß geworden! Geben einen großen Ableger an Selbstabholer ab.',
    email: 'schmidt@beispiel.de',
    phone: '',
    isOwnOffer: true,
  },
  {
    id: '3',
    type: 'Dienstleistung',
    title: 'Hilfe beim Rasenmähen gesucht',
    author: 'Herr Weber',
    date: '20. Juli 2024',
    price: 'Gegen Angebot',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'lawn mower',
    description:
      "Wer kann mir am kommenden Wochenende helfen, meinen Rasen zu mähen? Als Dankeschön gibt's einen Kuchen!",
    email: '',
    phone: '0456 789123',
    isOwnOffer: false,
  },
  {
    id: '4',
    type: 'Dienstleistung',
    title: 'Biete Hilfe beim Einkaufen an',
    author: 'Anna Klein',
    date: '19. Juli 2024',
    price: 'Zu verschenken',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'shopping groceries',
    description:
      'Ich gehe jeden Freitag einkaufen und kann für ältere oder kranke Nachbarn gerne etwas mitbringen.',
    email: 'anna.klein@beispiel.de',
    phone: '0789 123456',
    isOwnOffer: true,
  },
];

type MarketplaceItem = (typeof initialMarketplaceItems)[0];

export default function MarketplacePage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState('Keine Datei ausgewählt');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // React Hook Form für neue Items
  const form = useForm<MarketplaceItemFormData>({
    resolver: zodResolver(marketplaceItemSchema),
    defaultValues: {
      type: 'Gegenstand',
      title: '',
      offerType: 'geschenk',
      author: '',
      email: '',
      phone: '',
      description: '',
    },
  });

  // React Hook Form für Edit Items
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);
  const editForm = useForm<EditMarketplaceItemFormData>({
    resolver: zodResolver(editMarketplaceItemSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'Gegenstand',
      offerType: 'geschenk',
      email: '',
      phone: '',
    },
  });
  const [editFile, setEditFile] = React.useState<File | null>(null);
  const [editFileName, setEditFileName] = React.useState(
    'Keine Datei ausgewählt'
  );
  const [isSavingEdit, setIsSavingEdit] = React.useState(false);

  // Contact dialog state
  const [contactDialogOpen, setContactDialogOpen] = React.useState(false);
  const [selectedContactItem, setSelectedContactItem] =
    React.useState<MarketplaceItem | null>(null);
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSendingContact, setIsSendingContact] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    try {
      const storedItems = localStorage.getItem('marketplaceItems');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      } else {
        setItems(initialMarketplaceItems);
      }
    } catch (error) {
      console.error('Could not load from localStorage', error);
      setItems(initialMarketplaceItems);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (items.length > 0) {
      try {
        localStorage.setItem('marketplaceItems', JSON.stringify(items));
      } catch (error) {
        console.error('Could not save to localStorage', error);
      }
    }
  }, [items]);

  // Sichere File-Handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: 'Ungültige Datei',
          description: validation.error,
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setSelectedFile(null);
      setFileName('Keine Datei ausgewählt');
    }
  };

  // Sichere Submit-Handler mit Server Actions
  const onSubmit = async (data: MarketplaceItemFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const result = await addMarketplaceItem(formData);

      if (result.success) {
        form.reset();
        setSelectedFile(null);
        setFileName('Keine Datei ausgewählt');

        toast({
          title: 'Angebot veröffentlicht!',
          description: result.message,
        });

        // Seite neu laden für echte Daten
        window.location.reload();
      } else {
        toast({
          title: 'Fehler',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditItem = (item: MarketplaceItem) => {
    setEditingItemId(item.id);
    editForm.reset({
      title: item.title,
      description: item.description,
      type: item.type as 'Gegenstand' | 'Dienstleistung' | 'Sonstiges',
      offerType: item.price === 'Zu verschenken' ? 'geschenk' : 'angebot',
      email: item.email || '',
      phone: item.phone || '',
    });
    setEditFile(null);
    setEditFileName('Keine Datei ausgewählt');
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    editForm.reset();
    setEditFile(null);
    setEditFileName('Keine Datei ausgewählt');
  };

  const handleEditFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: 'Ungültige Datei',
          description: validation.error,
          variant: 'destructive',
        });
        return;
      }
      setEditFile(file);
      setEditFileName(file.name);
    } else {
      setEditFile(null);
      setEditFileName('Keine Datei ausgewählt');
    }
  };

  const onEditSubmit = async (data: EditMarketplaceItemFormData) => {
    if (!editingItemId) return;

    setIsSavingEdit(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      if (editFile) {
        formData.append('image', editFile);
      }

      const result = await updateMarketplaceItem(editingItemId, formData);

      if (result.success) {
        setEditingItemId(null);
        editForm.reset();
        setEditFile(null);
        setEditFileName('Keine Datei ausgewählt');

        toast({
          title: 'Angebot aktualisiert!',
          description: result.message,
        });

        // Seite neu laden für echte Daten
        window.location.reload();
      } else {
        toast({
          title: 'Fehler',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const result = await deleteMarketplaceItem(itemId);

      if (result.success) {
        toast({
          title: 'Angebot entfernt!',
          description: result.message,
        });

        // Seite neu laden für echte Daten
        window.location.reload();
      } else {
        toast({
          title: 'Fehler',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    }
  };

  const openContactDialog = (item: MarketplaceItem) => {
    setSelectedContactItem(item);
    setContactDialogOpen(true);
  };

  const closeContactDialog = () => {
    setContactDialogOpen(false);
    setSelectedContactItem(null);
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSendingContact(true);

    // Simulate sending contact request
    setTimeout(() => {
      setIsSendingContact(false);
      closeContactDialog();
      toast({
        title: 'Nachricht gesendet!',
        description: `Ihre Nachricht wurde an ${selectedContactItem?.author} gesendet.`,
      });
    }, 1500);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'Dienstleistung':
        return <Handshake className="h-4 w-4" />;
      case 'Gegenstand':
        return <Store className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'Dienstleistung':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Gegenstand':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BackButton />
        <div className="flex flex-col space-y-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Marktplatz wird geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <BackButton />

      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Store className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marktplatz</h1>
            <p className="text-muted-foreground">
              Tauschen, verschenken und entdecken Sie Angebote Ihrer Nachbarn
            </p>
          </div>
        </div>

        {/* Formular für neues Angebot */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Neues Angebot erstellen
              </CardTitle>
              <CardDescription>
                Erstellen Sie eine neue Anzeige für den Marktplatz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Was möchten Sie anbieten?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-wrap gap-4 pt-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="Gegenstand"
                                id="gegenstand"
                              />
                              <Label
                                htmlFor="gegenstand"
                                className="font-normal"
                              >
                                Gegenstand
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="Dienstleistung"
                                id="dienstleistung"
                              />
                              <Label
                                htmlFor="dienstleistung"
                                className="font-normal"
                              >
                                Dienstleistung
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="Sonstiges"
                                id="sonstiges"
                              />
                              <Label
                                htmlFor="sonstiges"
                                className="font-normal"
                              >
                                Sonstiges
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titel des Angebots</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="z.B. Gut erhaltenes Kinderfahrrad"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 rounded-lg border p-4">
                    <Label className="text-base font-semibold">
                      Ihre Kontaktdaten
                    </Label>
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ihr Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Max Mustermann" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-Mail-Adresse (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="email"
                                  placeholder="max@beispiel.de"
                                  className="pl-9"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefonnummer (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="tel"
                                  placeholder="0123 456789"
                                  className="pl-9"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ihre Kontaktdaten werden nur den anderen Bewohnern im
                      Detail des Angebots angezeigt.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="offerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Art des Angebots</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Art auswählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="geschenk">
                              Zu verschenken
                            </SelectItem>
                            <SelectItem value="angebot">
                              Gegen Angebot / Tausch
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beschreibung</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Beschreiben Sie Ihr Angebot..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Bild hochladen</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="image-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        <Paperclip className="h-4 w-4" />
                        Datei auswählen
                      </Label>
                      <span className="text-sm text-muted-foreground truncate">
                        {fileName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <ButtonLoadingState size="sm" />
                          <span className="ml-2">Wird veröffentlicht...</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Angebot veröffentlichen
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Angebote-Liste */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Aktuelle Angebote</h2>
            <Badge variant="secondary">{items.length}</Badge>
          </div>

          {items.length === 0 ? (
            <NoMarketplaceItems />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Badge
                          className={`mb-2 ${getItemTypeColor(item.type)}`}
                        >
                          {getItemIcon(item.type)}
                          <span className="ml-1">{item.type}</span>
                        </Badge>
                        {editingItemId === item.id ? (
                          <Form {...editForm}>
                            <form
                              onSubmit={editForm.handleSubmit(onEditSubmit)}
                              className="space-y-4"
                            >
                              <FormField
                                control={editForm.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        className="font-semibold"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={editForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        className="min-h-[80px]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEdit}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={isSavingEdit}
                                >
                                  {isSavingEdit ? (
                                    <ButtonLoadingState size="sm" />
                                  ) : (
                                    <Save className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        ) : (
                          <>
                            <CardTitle className="text-lg leading-tight line-clamp-2">
                              {item.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <User className="h-3 w-3" />
                              <span>{item.author}</span>
                              <Calendar className="h-3 w-3 ml-2" />
                              <span>{item.date}</span>
                            </CardDescription>
                          </>
                        )}
                      </div>
                      {item.isOwnOffer && editingItemId !== item.id && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => startEditItem(item)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  {editingItemId !== item.id && (
                    <>
                      <div className="relative h-48 mx-4 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={item.image}
                          alt={item.imageHint}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <CardContent className="flex-1 pt-4">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <Badge
                            variant={
                              item.price === 'Zu verschenken'
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {item.price === 'Zu verschenken' ? (
                              <>
                                <Gift className="h-3 w-3 mr-1" />
                                {item.price}
                              </>
                            ) : (
                              <>
                                <Handshake className="h-3 w-3 mr-1" />
                                {item.price}
                              </>
                            )}
                          </Badge>
                        </div>

                        {(item.email || item.phone) && (
                          <div className="space-y-1 text-xs text-muted-foreground">
                            {item.email && (
                              <div className="flex items-center gap-2">
                                <MailIcon className="h-3 w-3" />
                                <span className="truncate">{item.email}</span>
                              </div>
                            )}
                            {item.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                <span>{item.phone}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="pt-0">
                        {!item.isOwnOffer && (
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => openContactDialog(item)}
                          >
                            <MessageSquareQuote className="h-4 w-4 mr-2" />
                            Kontakt aufnehmen
                          </Button>
                        )}
                      </CardFooter>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kontakt aufnehmen</DialogTitle>
            <DialogDescription>
              Senden Sie eine Nachricht zu "{selectedContactItem?.title}"
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Ihr Name</Label>
              <Input
                id="contact-name"
                placeholder="Max Mustermann"
                value={contactForm.name}
                onChange={e =>
                  setContactForm(prev => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Ihre E-Mail</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="max@beispiel.de"
                value={contactForm.email}
                onChange={e =>
                  setContactForm(prev => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Telefon (optional)</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="0123 456789"
                value={contactForm.phone}
                onChange={e =>
                  setContactForm(prev => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Nachricht</Label>
              <Textarea
                id="contact-message"
                placeholder="Hallo, ich interessiere mich für Ihr Angebot..."
                className="min-h-[100px]"
                value={contactForm.message}
                onChange={e =>
                  setContactForm(prev => ({ ...prev, message: e.target.value }))
                }
                required
              />
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeContactDialog}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={isSendingContact}>
                {isSendingContact ? (
                  <>
                    <ButtonLoadingState size="sm" />
                    <span className="ml-2">Wird gesendet...</span>
                  </>
                ) : (
                  'Nachricht senden'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
