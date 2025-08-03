
"use client";

import * as React from "react";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scale } from "lucide-react";
import { BoardAssistantChat } from "@/components/board-assistant-chat";


const lawText = `Auszug aus dem Wohnungseigentumsgesetz (WEG) - § 27 Verwaltung durch die Wohnungseigentümer und den Verwaltungsbeirat

(1) Die Verwaltung des gemeinschaftlichen Eigentums obliegt den Wohnungseigentümern, soweit nicht ein Verwalter bestellt ist.
1. Sind die Wohnungseigentümer zur Verwaltung des gemeinschaftlichen Eigentums berechtigt, so kann durch Stimmenmehrheit die Vornahme der zur ordnungsmäßigen Verwaltung erforderlichen Maßnahmen beschlossen werden.
2. Die Bestellung eines Verwaltungsbeirats zur Unterstützung des Verwalters ist jederzeit möglich.

(2) Der Verwaltungsbeirat unterstützt und überwacht den Verwalter bei der Durchführung seiner Aufgaben. Er besteht aus einem Vorsitzenden und weiteren Mitgliedern.
1. Der Verwaltungsbeirat wird von der Wohnungseigentümerversammlung gewählt.
2. Der Wirtschaftsplan, die Abrechnung über den Wirtschaftsplan, Rechnungslegungen und Kostenanschläge sollen, bevor die Beschlussfassung durch die Wohnungseigentümer erfolgt, vom Verwaltungsbeirat geprüft und mit dessen Stellungnahme versehen werden.

(3) Der Verwaltungsbeirat hat folgende Aufgaben und Befugnisse:
1. Prüfung des Wirtschaftsplans und der Jahresabrechnung.
2. Abgabe einer Stellungnahme zu den geprüften Unterlagen.
3. Einberufung der Eigentümerversammlung, wenn der Verwalter pflichtwidrig die Einberufung unterlässt oder sich weigert.
4. Überwachung der Umsetzung von Beschlüssen der Eigentümerversammlung.

(4) Die Mitglieder des Verwaltungsbeirats sind ehrenamtlich tätig. Sie haften den Wohnungseigentümern nur für Vorsatz und grobe Fahrlässigkeit.

Dieser Text ist ein vereinfachter Auszug und dient nur zu Informationszwecken. Für eine rechtsverbindliche Beratung konsultieren Sie bitte einen Anwalt oder die vollständigen Gesetzestexte.`;


export default function LawPage() {

  return (
    <div className="container py-8">
        <div className="mb-8">
            <BackButton text="Zurück zum Beirats-Cockpit" />
        </div>
        
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12">
                <div className="inline-block bg-orange-500/20 p-4 rounded-lg mb-6">
                    <Scale className="h-10 w-10 text-orange-500" />
                </div>
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Leitfaden zum WEG-Gesetz
                </h1>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Rechtliche Hinweise und wichtige Auszüge aus dem Wohnungseigentumsgesetz (WEG) speziell für Verwaltungsbeiräte.
                </p>
            </div>

            <div className="space-y-8">
                <div>
                    <BoardAssistantChat />
                </div>
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Wichtige Auszüge für Verwaltungsbeiräte</CardTitle>
                            <CardDescription>Auszug aus dem Wohnungseigentumsgesetz (WEG) - § 27</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {lawText}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
