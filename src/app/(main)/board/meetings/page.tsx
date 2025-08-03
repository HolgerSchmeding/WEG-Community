
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import React from "react";
import { BackButton } from "@/components/back-button";
import { ListChecks } from "lucide-react";

// Dynamischer Import der Client-Komponente mit deaktiviertem SSR
const MeetingBoard = dynamic(
  () => import("@/components/board/meeting-board-client"),
  { 
    ssr: false,
    // Optional: Eine Lade-Komponente anzeigen, während das Board geladen wird
    loading: () => <p>Lade Board...</p> 
  }
);

export default function BoardMeetingsPage() {
  return (
    <div className="container py-8">
        <div className="mb-8">
            <BackButton text="Zurück zum Admin-Dashboard" />
        </div>
        <div className="text-center mb-12">
            <div className="inline-block bg-primary/20 p-4 rounded-lg mb-6">
                <ListChecks className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tight">
                Versammlungen planen (Drag & Drop)
            </h1>
            <p className="mt-2 text-muted-foreground">
                Organisieren Sie die Tagesordnungspunkte per Drag & Drop.
            </p>
        </div>
        <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Tagesordnungspunkte</CardTitle>
            <CardDescription>
            Ordnen Sie die Themen für die nächste Beiratssitzung.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {/* <MeetingBoard /> */}
            <p>Test: Seite lädt ohne Board-Komponente.</p>
        </CardContent>
        </Card>
    </div>
  );
}
