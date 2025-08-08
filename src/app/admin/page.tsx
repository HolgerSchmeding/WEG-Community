

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, Megaphone, HelpCircle, Store, FileText, Calendar, ListChecks, BotIcon, ArrowUpRight, ArrowRight, ClipboardList, Activity, Upload, Database, Calculator, Receipt, PiggyBank, Send } from "lucide-react";
import Link from 'next/link';

const overviewStats = [
  {
    title: "WEG-Einheiten",
    value: "128",
    subInfo: "Eigentums- & Mieteinheiten",
    icon: Users,
    iconColor: "text-blue-500",
  },
  {
    title: "Aktive Aushänge",
    value: "4",
    subInfo: "+1 seit gestern",
    icon: Megaphone,
    iconColor: "text-orange-500",
  },
  {
    title: "Offene Anfragen",
    value: "3",
    subInfo: "davon 1 neu heute",
    icon: HelpCircle,
    iconColor: "text-purple-500",
  },
  {
    title: "AI-Service Kosten",
    value: "€24,70",
    subInfo: "aktueller Monat (Aug.)",
    icon: BotIcon,
    iconColor: "text-green-500",
  },
];

// Erste und zweite Zeile: Community & Admin-Funktionen
const communityFunctions = [
  {
    title: "Aushang verwalten",
    description: "Mitteilungen für Bewohner erstellen und bearbeiten",
    icon: Megaphone,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    href: "/board/announcements"
  },
  {
    title: "Dokumente verwalten",
    description: "Protokolle, und Dokumente hochladen und verwalten",
    icon: FileText,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    href: "/documents/archive"
  },
  {
    title: "Anfragen verwalten",
    description: "Anfragen von Bewohnern einsehen und bearbeiten",
    icon: HelpCircle,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    href: "/contact"
  },
  {
    title: "Benutzerverwaltung",
    description: "Benutzerkonten, Rollen und Berechtigungen verwalten",
    icon: Users,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    href: "/admin/users"
  },
  {
    title: "Termine & Events",
    description: "Offizielle Termine und Events für alle sichtbar machen",
    icon: Calendar,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
    href: "/board/appointments"
  },
  {
    title: "Newsletter/Rundschreiben",
    description: "Massenversendungen an alle Bewohner",
    icon: Send,
    bgColor: "bg-sky-100",
    iconColor: "text-sky-600",
    href: "/admin/newsletter"
  },
];

// Dritte und vierte Zeile: Hausverwaltungsfunktionen
const propertyManagementFunctions = [
  {
    title: "Daten-Import",
    description: "Bestandsdaten aus vorherigen Systemen übernehmen",
    icon: Database,
    bgColor: "bg-slate-100",
    iconColor: "text-slate-600",
    href: "/admin/import"
  },
  {
    title: "Interne Dokumente",
    description: "Hausverwaltung interne Unterlagen und Verträge",
    icon: FileText,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
    href: "/admin/documents"
  },
  {
    title: "Ticket erstellen (Außendienst)",
    description: "Als Hausverwalter vor Ort Tickets für Reparaturen/Wartungen erfassen",
    icon: ClipboardList,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    href: "/admin/tickets/new"
  },
  {
    title: "Eigentümerversammlung planen",
    description: "Eigentümerversammlung mit Agenda planen",
    icon: ListChecks,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
    href: "/board/meetings"
  },
  {
    title: "Live-Protokollierung",
    description: "Eigentümerversammlung digital protokollieren mit KI-Unterstützung",
    icon: FileText,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    href: "/admin/live-protocol"
  },
  {
    title: "AI-Service Verbrauch",
    description: "Premium AI-Anfragen und Kosten überwachen",
    icon: Activity,
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
    href: "/admin/usage"
  },
  {
    title: "Kostenstellen-Verwaltung",
    description: "WEG-spezifische Kostenaufteilung",
    icon: Calculator,
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600",
    href: "/admin/cost-centers"
  },
  {
    title: "Rechnungsstellung",
    description: "Integration für Hausgeld-Abrechnungen",
    icon: Receipt,
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600",
    href: "/admin/billing"
  },
  {
    title: "Budget-Planung",
    description: "Jahresbudget der WEG verwalten",
    icon: PiggyBank,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
    href: "/admin/budget"
  },
];


export default function AdminPage() {
  return (
    <div className="bg-[#F0FAF2] min-h-full">
      <div className="container py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tight">Dashboard & Verwaltung</h1>
            <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
              Zentrale Verwaltung der WEG-Community-Plattform. Verwalten Sie alle Aspekte der Plattform, einschließlich Benutzer, Inhalte und Systemeinstellungen.
            </p>
          </div>

          <section className="mb-12">
            <h2 className="font-headline text-2xl font-semibold mb-6">Übersicht</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.subInfo}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-headline text-2xl font-semibold mb-6">Verwaltungsfunktionen</h2>
            
            {/* Community & Admin Funktionen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {communityFunctions.map((func) => (
                <Link href={func.href} key={func.title}>
                    <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform duration-200 h-full flex flex-col">
                      <CardContent className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${func.bgColor}`}>
                            <func.icon className={`h-6 w-6 ${func.iconColor}`} />
                          </div>
                          <h3 className="font-headline text-lg font-semibold">{func.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{func.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                </Link>
              ))}
            </div>

            {/* Trennstrich */}
            <div className="flex items-center my-8">
              <div className="flex-grow border-t border-gray-300"></div>
              <div className="px-4">
                <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-300">
                  Hausverwaltungsfunktionen
                </span>
              </div>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Hausverwaltungsfunktionen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyManagementFunctions.map((func) => (
                <Link href={func.href} key={func.title}>
                    <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform duration-200 h-full flex flex-col">
                      <CardContent className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${func.bgColor}`}>
                            <func.icon className={`h-6 w-6 ${func.iconColor}`} />
                          </div>
                          <h3 className="font-headline text-lg font-semibold">{func.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{func.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                </Link>
              ))}
            </div>
          </section>
          
          <section>
            <Accordion type="single" collapsible className="w-full bg-white/70 backdrop-blur-sm border-gray-200 shadow-sm rounded-lg">
                  <AccordionItem value="item-1" className="border-b-0">
                      <AccordionTrigger className="p-6 hover:no-underline">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100">
                                  <BotIcon className="h-6 w-6 text-gray-600" />
                              </div>
                              <div>
                                  <h3 className="font-headline text-lg font-semibold text-left">KI-Admin-Assistent</h3>
                                  <p className="text-sm text-muted-foreground text-left">Fragen zur Verwaltung? Klicken Sie hier, um den Assistenten zu öffnen.</p>
                              </div>
                          </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-6 pt-0">
                          <div className="p-4 border rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                <BotIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">KI-Assistent verfügbar</h4>
                                <p className="text-sm text-gray-700 mb-3">
                                  Ein intelligenter Verwaltungsassistent kann für Ihre WEG-Community aktiviert werden. 
                                  Für optimale Unterstützung erfolgt zunächst ein spezielles Training mit Ihren 
                                  spezifischen Hausverwaltungsdaten und WEG-Regelwerken.
                                </p>
                                <div className="text-xs text-blue-600 font-medium">
                                  💡 Sprechen Sie uns für die Aktivierung an
                                </div>
                              </div>
                            </div>
                          </div>
                      </AccordionContent>
                  </AccordionItem>
              </Accordion>
          </section>
        </div>
      </div>
    </div>
  );
}
