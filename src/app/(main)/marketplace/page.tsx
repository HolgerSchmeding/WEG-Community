
"use client";

import * as React from "react";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Store, Gift, Handshake, Calendar, User, MessageSquareQuote, PlusCircle, Paperclip, Mail as MailIcon, Phone, FileType } from "lucide-react";
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

const initialMarketplaceItems = [
  {
    type: "Gegenstand",
    title: "Gut erhaltenes Kinderfahrrad",
    author: "Familie Meier",
    date: "22. Juli 2024",
    price: "Gegen Angebot",
    image: "https://placehold.co/600x400.png",
    imageHint: "kids bicycle",
    description: "Wir geben ein gut erhaltenes 16-Zoll-Kinderfahrrad ab. Normale Gebrauchsspuren, aber voll funktionsfähig."
  },
  {
    type: "Gegenstand",
    title: "Zimmerpflanze (Monstera)",
    author: "Frau Schmidt",
    date: "21. Juli 2024",
    price: "Zu verschenken",
    image: "https://placehold.co/600x400.png",
    imageHint: "monstera plant",
    description: "Unsere Monstera ist zu groß geworden! Geben einen großen Ableger an Selbstabholer ab."
  },
  {
    type: "Dienstleistung",
    title: "Hilfe beim Rasenmähen gesucht",
    author: "Herr Weber",
    date: "20. Juli 2024",
    price: "Gegen Angebot",
    image: "https://placehold.co/600x400.png",
    imageHint: "lawn mower",
    description: "Wer kann mir am kommenden Wochenende helfen, meinen Rasen zu mähen? Als Dankeschön gibt's einen Kuchen!"
  },
   {
    type: "Dienstleistung",
    title: "Biete Hilfe beim Einkaufen an",
    author: "Anna Klein",
    date: "19. Juli 2024",
    price: "Zu verschenken",
    image: "https://placehold.co/600x400.png",
    imageHint: "shopping groceries",
    description: "Ich gehe jeden Freitag einkaufen und kann für ältere oder kranke Nachbarn gerne etwas mitbringen."
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
                type: itemType,
                title: title,
                author: author,
                date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
                price: offerType === 'geschenk' ? 'Zu verschenken' : 'Gegen Angebot',
                image: selectedFile ? URL.createObjectURL(selectedFile) : 'https://placehold.co/600x400.png',
                imageHint: "new offer",
                description: description,
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
                                        </div>
                                        <h3 className="font-headline text-xl mb-2 font-semibold leading-none tracking-tight">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
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
                                                {item.price}
                                            </Badge>
                                        </div>
                                        <Button className="w-full text-sm">
                                            <MessageSquareQuote className="mr-2 h-4 w-4" />
                                            Angebot machen / Kontaktieren
                                        </Button>
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
        </div>
    );
}
