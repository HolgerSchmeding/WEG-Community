

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, Megaphone, HelpCircle, Store, FileText, Calendar, ListChecks, BotIcon, ArrowUpRight, ArrowRight } from "lucide-react";
import Link from 'next/link';

const overviewStats = [
  {
    title: "Benutzer gesamt",
    value: "128",
    subInfo: "+2.1% zum Vormonat",
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
    title: "Marktplatz-Angebote",
    value: "8",
    subInfo: "Insgesamt aktiv",
    icon: Store,
    iconColor: "text-emerald-500",
  },
];

const managementFunctions = [
  {
    title: "Benutzerverwaltung",
    description: "Benutzerkonten, Rollen und Berechtigungen verwalten",
    icon: Users,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    href: "/admin/users"
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
    title: "Termine & Events",
    description: "Offizielle Termine und Events für alle sichtbar machen",
    icon: Calendar,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
    href: "/board/appointments"
  },
  {
    title: "Eigentümerversammlung planen",
    description: "Eigentümerversammlung mit Agenda planen",
    icon: ListChecks,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
    href: "/board/meetings"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managementFunctions.map((func) => (
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
                          <div className="p-4 border rounded-md bg-gray-50">
                            <p className="text-muted-foreground">Der KI-Admin-Assistent ist hier in Kürze verfügbar.</p>
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
