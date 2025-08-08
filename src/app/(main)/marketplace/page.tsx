
"use client";

import * as React from "react";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Store, Gift, Handshake, Calendar, User, MessageSquareQuote, PlusCircle, Paperclip, Mail as MailIcon, Phone, FileType, Edit3, Save, X, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LoadingState, ButtonLoadingState } from "@/components/ui/loading-state";
import { NoMarketplaceItems } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const initialMarketplaceItems = [
  {
    id: "1",
    type: "Gegenstand",
    title: "Gut erhaltenes Kinderfahrrad",
    author: "Familie Meier",
    date: "22. Juli 2024",
    price: "Gegen Angebot",
    image: "https://placehold.co/600x400.png",
    imageHint: "kids bicycle",
    description: "Wir geben ein gut erhaltenes 16-Zoll-Kinderfahrrad ab. Normale Gebrauchsspuren, aber voll funktionsfähig.",
    email: "meier@beispiel.de",
    phone: "0123 456789",
    isOwnOffer: false
  },
  {
    id: "2",
    type: "Gegenstand",
    title: "Zimmerpflanze (Monstera)",
    author: "Frau Schmidt",
    date: "21. Juli 2024",
    price: "Zu verschenken",
    image: "https://placehold.co/600x400.png",
    imageHint: "monstera plant",
    description: "Unsere Monstera ist zu groß geworden! Geben einen großen Ableger an Selbstabholer ab.",
    email: "schmidt@beispiel.de",
    phone: "",
    isOwnOffer: true
  },
  {
    id: "3",
    type: "Dienstleistung",
    title: "Hilfe beim Rasenmähen gesucht",
    author: "Herr Weber",
    date: "20. Juli 2024",
    price: "Gegen Angebot",
    image: "https://placehold.co/600x400.png",
    imageHint: "lawn mower",
    description: "Wer kann mir am kommenden Wochenende helfen, meinen Rasen zu mähen? Als Dankeschön gibt's einen Kuchen!",
    email: "",
    phone: "0456 789123",
    isOwnOffer: false
  },
   {
    id: "4",
    type: "Dienstleistung",
    title: "Biete Hilfe beim Einkaufen an",
    author: "Anna Klein",
    date: "19. Juli 2024",
    price: "Zu verschenken",
    image: "https://placehold.co/600x400.png",
    imageHint: "shopping groceries",
    description: "Ich gehe jeden Freitag einkaufen und kann für ältere oder kranke Nachbarn gerne etwas mitbringen.",
    email: "anna.klein@beispiel.de",
    phone: "0789 123456",
    isOwnOffer: true
  },
];

type MarketplaceItem = typeof initialMarketplaceItems[0];

export default function MarketplacePage() {
    const { toast } = useToast();
    const [items, setItems] = React.useState<MarketplaceItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    
    // Form state
    const [itemType, setItemType] = React.useState("Gegenstand");
    const [title, setTitle] = React.useState("");
    const [author, setAuthor] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [offerType, setOfferType] = React.useState("geschenk");
    const [description, setDescription] = React.useState("");
    
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [fileName, setFileName] = React.useState("Keine Datei ausgewählt");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    // Edit state
    const [editingItemId, setEditingItemId] = React.useState<string | null>(null);
    const [editForm, setEditForm] = React.useState({
        title: "",
        description: "",
        type: "",
        offerType: "",
        email: "",
        phone: ""
    });
    const [editFile, setEditFile] = React.useState<File | null>(null);
    const [editFileName, setEditFileName] = React.useState("Keine Datei ausgewählt");
    const [isSavingEdit, setIsSavingEdit] = React.useState(false);
    
    // Contact dialog state
    const [contactDialogOpen, setContactDialogOpen] = React.useState(false);
    const [selectedContactItem, setSelectedContactItem] = React.useState<MarketplaceItem | null>(null);
    const [contactForm, setContactForm] = React.useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [isSendingContact, setIsSendingContact] = React.useState(false);
    
    React.useEffect(() => {
        setIsLoading(true);
        try {
            const storedItems = localStorage.getItem("marketplaceItems");
            if (storedItems) {
                setItems(JSON.parse(storedItems));
            } else {
                setItems(initialMarketplaceItems);
            }
        } catch (error) {
            console.error("Could not load from localStorage", error);
            setItems(initialMarketplaceItems);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        if (isLoading) return;
        try {
            localStorage.setItem("marketplaceItems", JSON.stringify(items));
        } catch (error) {
             console.error("Could not save to localStorage", error);
        }
    }, [items, isLoading]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        } else {
            setSelectedFile(null);
            setFileName("Keine Datei ausgewählt");
        }
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'Gegenstand': return Gift;
            case 'Dienstleistung': return Handshake;
            default: return FileType;
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            const newItem = {
                id: Date.now().toString(),
                type: itemType,
                title: title,
                author: author,
                date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
                price: offerType === 'geschenk' ? 'Zu verschenken' : 'Gegen Angebot',
                image: selectedFile ? URL.createObjectURL(selectedFile) : 'https://placehold.co/600x400.png',
                imageHint: "new offer",
                description: description,
                email: email,
                phone: phone,
                isOwnOffer: true
            };

            setItems(prevItems => [newItem, ...prevItems]);

            // Reset form
            setItemType("Gegenstand");
            setTitle("");
            setAuthor("");
            setEmail("");
            setPhone("");
            setOfferType("geschenk");
            setDescription("");
            setSelectedFile(null);
            setFileName("Keine Datei ausgewählt");
            setIsSubmitting(false);

            toast({
                title: "Angebot veröffentlicht!",
                description: "Ihr Angebot ist jetzt auf dem Marktplatz sichtbar.",
            });
        }, 1500);
    };

    const startEditItem = (item: MarketplaceItem) => {
        setEditingItemId(item.id);
        setEditForm({
            title: item.title,
            description: item.description,
            type: item.type,
            offerType: item.price === 'Zu verschenken' ? 'geschenk' : 'angebot',
            email: item.email || '',
            phone: item.phone || ''
        });
        setEditFile(null);
        setEditFileName("Keine Datei ausgewählt");
    };

    const cancelEdit = () => {
        setEditingItemId(null);
        setEditForm({
            title: "",
            description: "",
            type: "",
            offerType: "",
            email: "",
            phone: ""
        });
        setEditFile(null);
        setEditFileName("Keine Datei ausgewählt");
    };

    const handleEditFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setEditFile(file);
            setEditFileName(file.name);
        } else {
            setEditFile(null);
            setEditFileName("Keine Datei ausgewählt");
        }
    };

    const saveEdit = () => {
        if (!editingItemId) return;
        
        setIsSavingEdit(true);
        
        setTimeout(() => {
            setItems(prevItems => prevItems.map(item => {
                if (item.id === editingItemId) {
                    return {
                        ...item,
                        title: editForm.title,
                        description: editForm.description,
                        type: editForm.type,
                        price: editForm.offerType === 'geschenk' ? 'Zu verschenken' : 'Gegen Angebot',
                        email: editForm.email,
                        phone: editForm.phone,
                        image: editFile ? URL.createObjectURL(editFile) : item.image,
                        date: `${new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })} (bearbeitet)`
                    };
                }
                return item;
            }));
            
            cancelEdit();
            setIsSavingEdit(false);
            
            toast({
                title: "Angebot aktualisiert!",
                description: "Ihre Änderungen wurden erfolgreich gespeichert.",
            });
        }, 1000);
    };

    const deleteItem = (itemId: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        toast({
            title: "Angebot entfernt!",
            description: "Ihr Angebot wurde vom Marktplatz entfernt.",
        });
    };

    const openContactDialog = (item: MarketplaceItem) => {
        setSelectedContactItem(item);
        setContactDialogOpen(true);
    };

    const closeContactDialog = () => {
        setContactDialogOpen(false);
        setSelectedContactItem(null);
        setContactForm({
            name: "",
            email: "",
            phone: "",
            message: ""
        });
    };

    const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSendingContact(true);

        // Simulate sending contact request
        setTimeout(() => {
            toast({
                title: "Nachricht gesendet!",
                description: `Ihre Anfrage wurde an ${selectedContactItem?.author} weitergeleitet.`,
            });
            
            setIsSendingContact(false);
            closeContactDialog();
        }, 1500);
    };

    return (
        <div className="container py-8">
            <BackButton text="Zurück zum Cockpit" />

            <div className="max-w-4xl mx-auto mt-8 text-center">
                <div className="inline-block bg-purple-500/20 p-4 rounded-lg mb-6">
                <Store className="h-10 w-10 text-purple-500" />
                </div>
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                Nachbarschafts-Marktplatz
                </h1>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                Stöbern, anbieten, helfen und finden. Ein Ort für den Austausch in unserer Gemeinschaft.
                <br />
                <span className="text-xs italic">Die Nutzung ist nicht-kommerziell und erfolgt auf eigene Verantwortung.</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Neues Angebot erstellen</CardTitle>
                            <CardDescription>Erstellen Sie eine neue Anzeige für den Marktplatz.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <Label>Was möchten Sie anbieten?</Label>
                                    <RadioGroup value={itemType} onValueChange={setItemType} className="flex flex-wrap gap-4 pt-1">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Gegenstand" id="gegenstand" />
                                            <Label htmlFor="gegenstand" className="font-normal">Gegenstand</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Dienstleistung" id="dienstleistung" />
                                            <Label htmlFor="dienstleistung" className="font-normal">Dienstleistung</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Sonstiges" id="sonstiges" />
                                            <Label htmlFor="sonstiges" className="font-normal">Sonstiges</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titel des Angebots</Label>
                                    <Input id="title" placeholder="z.B. Gut erhaltenes Kinderfahrrad" value={title} onChange={e => setTitle(e.target.value)} required/>
                                </div>
                                
                                <div className="space-y-4 rounded-lg border p-4">
                                    <Label className="text-base font-semibold">Ihre Kontaktdaten</Label>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Ihr Name</Label>
                                        <Input id="name" placeholder="Max Mustermann" value={author} onChange={e => setAuthor(e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">E-Mail-Adresse (optional)</Label>
                                            <div className="relative">
                                                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input id="email" type="email" placeholder="max@beispiel.de" className="pl-9" value={email} onChange={e => setEmail(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                        <Label htmlFor="phone">Telefonnummer (optional)</Label>
                                        <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input id="phone" type="tel" placeholder="0123 456789" className="pl-9" value={phone} onChange={e => setPhone(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Ihre Kontaktdaten werden nur den anderen Bewohnern im Detail des Angebots angezeigt.
                                    </p>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="price-type">Art des Angebots</Label>
                                    <Select value={offerType} onValueChange={setOfferType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Art auswählen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="geschenk">Zu verschenken</SelectItem>
                                            <SelectItem value="angebot">Gegen Angebot / Tausch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Beschreibung</Label>
                                    <Textarea id="description" placeholder="Beschreiben Sie Ihr Angebot..." className="min-h-[120px]" value={description} onChange={e => setDescription(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="image-upload">Bild hochladen</Label>
                                <div className="flex items-center gap-3">
                                    <Input id="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    <Label htmlFor="image-upload" className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                    <Paperclip className="h-4 w-4" />
                                    Datei auswählen
                                    </Label>
                                    <span className="text-sm text-muted-foreground truncate">{fileName}</span>
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
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Angebot veröffentlichen
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Aktuelle Angebote</CardTitle>
                            <CardDescription>
                                Stöbern Sie durch die Angebote Ihrer Nachbarn.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             {isLoading ? (
                                <LoadingState type="cards" items={4} />
                             ) : items.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {items.map((item, index) => {
                                    const Icon = getIconForType(item.type);
                                    const isEditing = editingItemId === item.id;
                                    
                                    return (
                                    <Card key={index} className="flex flex-col overflow-hidden">
                                      <Image 
                                        src={item.image} 
                                        alt={item.title} 
                                        width={600} 
                                        height={400} 
                                        data-ai-hint={item.imageHint}
                                        className="w-full h-auto aspect-video object-cover" 
                                      />
                                    <CardContent className="flex-grow pt-6">
                                        <div className="flex items-center gap-2 mb-2">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-muted-foreground">{item.type}</span>
                                        {item.isOwnOffer && (
                                            <Badge variant="outline" className="ml-auto text-xs">
                                                Ihr Angebot
                                            </Badge>
                                        )}
                                        </div>
                                        
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <Label htmlFor={`edit-title-${item.id}`} className="text-xs">Titel</Label>
                                                    <Input 
                                                        id={`edit-title-${item.id}`}
                                                        value={editForm.title} 
                                                        onChange={(e) => setEditForm(prev => ({...prev, title: e.target.value}))}
                                                        className="text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`edit-description-${item.id}`} className="text-xs">Beschreibung</Label>
                                                    <Textarea 
                                                        id={`edit-description-${item.id}`}
                                                        value={editForm.description} 
                                                        onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))}
                                                        rows={3}
                                                        className="text-sm"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Label className="text-xs">Typ</Label>
                                                        <Select value={editForm.type} onValueChange={(value) => setEditForm(prev => ({...prev, type: value}))}>
                                                            <SelectTrigger className="h-8">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Gegenstand">Gegenstand</SelectItem>
                                                                <SelectItem value="Dienstleistung">Dienstleistung</SelectItem>
                                                                <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Angebot</Label>
                                                        <Select value={editForm.offerType} onValueChange={(value) => setEditForm(prev => ({...prev, offerType: value}))}>
                                                            <SelectTrigger className="h-8">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="geschenk">Zu verschenken</SelectItem>
                                                                <SelectItem value="angebot">Gegen Angebot</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <div>
                                                        <Label htmlFor={`edit-email-${item.id}`} className="text-xs">E-Mail</Label>
                                                        <Input 
                                                            id={`edit-email-${item.id}`}
                                                            type="email"
                                                            value={editForm.email} 
                                                            onChange={(e) => setEditForm(prev => ({...prev, email: e.target.value}))}
                                                            className="text-sm"
                                                            placeholder="optional"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`edit-phone-${item.id}`} className="text-xs">Telefon</Label>
                                                        <Input 
                                                            id={`edit-phone-${item.id}`}
                                                            type="tel"
                                                            value={editForm.phone} 
                                                            onChange={(e) => setEditForm(prev => ({...prev, phone: e.target.value}))}
                                                            className="text-sm"
                                                            placeholder="optional"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Neues Bild (optional)</Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Input 
                                                            id={`edit-image-${item.id}`}
                                                            type="file" 
                                                            className="sr-only" 
                                                            onChange={handleEditFileChange} 
                                                            accept="image/*" 
                                                        />
                                                        <Label 
                                                            htmlFor={`edit-image-${item.id}`}
                                                            className="cursor-pointer inline-flex items-center gap-1 whitespace-nowrap rounded text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none border border-input bg-background hover:bg-accent h-7 px-2 py-1"
                                                        >
                                                            <Paperclip className="h-3 w-3" />
                                                            Ändern
                                                        </Label>
                                                        <span className="text-xs text-muted-foreground truncate">{editFileName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="font-headline text-xl mb-2 font-semibold leading-none tracking-tight">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex flex-col items-start gap-4">
                                        <div className="w-full">
                                            <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span>{item.author}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{item.date}</span>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="text-sm w-full justify-center font-bold">
                                                {isEditing ? (editForm.offerType === 'geschenk' ? 'Zu verschenken' : 'Gegen Angebot') : item.price}
                                            </Badge>
                                        </div>
                                        
                                        {item.isOwnOffer && isEditing ? (
                                            <div className="flex gap-2 w-full">
                                                <Button 
                                                    onClick={saveEdit}
                                                    disabled={isSavingEdit}
                                                    className="flex-1 text-sm h-8"
                                                    size="sm"
                                                >
                                                    {isSavingEdit ? (
                                                        <>
                                                            <ButtonLoadingState size="sm" />
                                                            <span className="ml-1">Speichert...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="mr-1 h-3 w-3" />
                                                            Speichern
                                                        </>
                                                    )}
                                                </Button>
                                                <Button 
                                                    onClick={cancelEdit}
                                                    variant="outline"
                                                    className="flex-1 text-sm h-8"
                                                    size="sm"
                                                >
                                                    <X className="mr-1 h-3 w-3" />
                                                    Abbrechen
                                                </Button>
                                            </div>
                                        ) : item.isOwnOffer ? (
                                            <div className="flex gap-2 w-full">
                                                <Button 
                                                    onClick={() => startEditItem(item)}
                                                    variant="outline"
                                                    className="flex-1 text-sm"
                                                >
                                                    <Edit3 className="mr-2 h-4 w-4" />
                                                    Bearbeiten
                                                </Button>
                                                <Button 
                                                    onClick={() => deleteItem(item.id)}
                                                    variant="outline"
                                                    className="text-sm px-3"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button 
                                                className="w-full text-sm"
                                                onClick={() => openContactDialog(item)}
                                            >
                                                <MessageSquareQuote className="mr-2 h-4 w-4" />
                                                Angebot machen / Kontaktieren
                                            </Button>
                                        )}
                                    </CardFooter>
                                    </Card>
                                )})}
                                </div>
                             ) : (
                                <NoMarketplaceItems />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Contact Dialog */}
            <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Kontakt aufnehmen</DialogTitle>
                        <DialogDescription>
                            Senden Sie eine Nachricht an <strong>{selectedContactItem?.author}</strong> bezüglich ihres Angebots "{selectedContactItem?.title}".
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleContactSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact-name">Ihr Name</Label>
                                <Input 
                                    id="contact-name"
                                    placeholder="Max Mustermann"
                                    value={contactForm.name}
                                    onChange={(e) => setContactForm(prev => ({...prev, name: e.target.value}))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-email">Ihre E-Mail-Adresse</Label>
                                <div className="relative">
                                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="contact-email"
                                        type="email"
                                        placeholder="max@beispiel.de"
                                        className="pl-9"
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm(prev => ({...prev, email: e.target.value}))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-phone">Telefon (optional)</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="contact-phone"
                                        type="tel"
                                        placeholder="0123 456789"
                                        className="pl-9"
                                        value={contactForm.phone}
                                        onChange={(e) => setContactForm(prev => ({...prev, phone: e.target.value}))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-message">Ihre Nachricht</Label>
                                <Textarea 
                                    id="contact-message"
                                    placeholder="Hallo! Ich interessiere mich für Ihr Angebot..."
                                    rows={4}
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm(prev => ({...prev, message: e.target.value}))}
                                    required
                                />
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={closeContactDialog}
                                disabled={isSendingContact}
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
                                    <>
                                        <MailIcon className="mr-2 h-4 w-4" />
                                        Nachricht senden
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
