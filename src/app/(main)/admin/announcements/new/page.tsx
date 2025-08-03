
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BackButton } from "@/components/back-button";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Hausverwaltung");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Bitte füllen Sie Titel und Inhalt aus.");
      return;
    }
    setLoading(true);

    try {
      // Füge ein neues Dokument zur 'announcements'-Sammlung hinzu
      await addDoc(collection(db, "announcements"), {
        title: title,
        content: content,
        author: author,
        createdAt: serverTimestamp(), // Firestore fügt den aktuellen Server-Zeitstempel hinzu
      });
      
      // Leite nach erfolgreichem Speichern zur Aushangbrett-Seite weiter
      router.push("/announcements");

    } catch (error) {
      console.error("Fehler beim Erstellen des Aushangs: ", error);
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <BackButton text="Zurück zum Aushangbrett" />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Neuen Aushang erstellen</CardTitle>
          <CardDescription>
            Füllen Sie die Felder aus, um eine neue Mitteilung zu veröffentlichen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="z.B. Wichtige Terminankündigung"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Inhalt</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Geben Sie hier die Details des Aushangs ein."
                required
                rows={6}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Select value={author} onValueChange={setAuthor}>
                    <SelectTrigger id="author">
                        <SelectValue placeholder="Wählen Sie den Autor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Hausverwaltung">Hausverwaltung</SelectItem>
                        <SelectItem value="Verwaltungsbeirat">Verwaltungsbeirat</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Wird veröffentlicht..." : "Aushang veröffentlichen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
