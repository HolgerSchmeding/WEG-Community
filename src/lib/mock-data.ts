import { Meeting, MeetingEvent, MeetingProtocol } from './types';

// Standard WEG-Tagesordnung als Template
export const standardAgendaTemplate: Meeting[] = [
  {
    id: 'top-1',
    title:
      'Eröffnung der Versammlung, Begrüßung und Feststellung der Beschlussfähigkeit',
    description: 'Von der Hausverwaltung oder dem Versammlungsleiter',
  },
  {
    id: 'top-2',
    title:
      'Wahl des Versammlungsleiters, Protokollführers und ggf. der mitunterzeichnenden Eigentümer',
    description: 'Bestimmung der Versammlungsorgane für das Protokoll',
  },
  {
    id: 'top-3',
    title:
      'Genehmigung der Tagesordnung und Bekanntgabe etwaiger eingegangener Anträge',
    description:
      'Abstimmung über die Tagesordnung und Information über Anträge',
  },
  {
    id: 'top-4',
    title: 'Bericht der Verwaltung über das abgelaufene Wirtschaftsjahr',
    description:
      'Bericht zu Verwaltungstätigkeiten, besonderen Vorkommnissen, Begrüßung neuer Eigentümer etc.',
  },
  {
    id: 'top-5',
    title: 'Bericht des Verwaltungsbeirats / Kassenprüfbericht',
    description:
      'Kontrolle von Buchführung und Finanzen, ggf. mit Empfehlung an die Eigentümergemeinschaft',
  },
  {
    id: 'top-6',
    title: 'Entlastung des Verwaltungsbeirats',
    description: 'Abstimmung über die Entlastung',
  },
  {
    id: 'top-7',
    title: 'Neuwahl bzw. Bestätigung des Verwaltungsbeirats/Rechnungsprüfers',
    description: 'Falls turnusmäßig notwendig oder bei Rücktritten etc.',
  },
  {
    id: 'top-8',
    title:
      'Beschlussfassung über die Jahresabrechnung (Gesamtabrechnung und Einzelabrechnungen)',
    description:
      'Abstimmung über die vom Beirat geprüfte und mit Stellungnahme versehene Abrechnung',
  },
  {
    id: 'top-9',
    title: 'Entlastung der Verwaltung',
    description: 'Abstimmung über die Entlastung der Verwaltung',
  },
  {
    id: 'top-10',
    title:
      'Beschlussfassung über den Wirtschaftsplan (Gesamt- und Einzelwirtschaftspläne)',
    description: 'Abstimmung über die Wirtschaftsplanung für das kommende Jahr',
  },
  {
    id: 'top-11',
    title: 'Besprechung und ggf. Beschlussfassung zu besonderen Themen',
    description:
      'z. B. Datenschutz, Installation von PV-Anlagen, Hausordnung, neue technische Anlagen, Energieeffizienzmaßnahmen, Versicherungsfragen etc.',
  },
  {
    id: 'top-12',
    title: 'Beschlussfassungen über bauliche Maßnahmen/Instandsetzungen',
    description:
      'z. B. Sanierungen, Austausch von Gemeinschaftsanlagen, größere Investitionen – inkl. Vorstellung und Auswahl von Angeboten',
  },
  {
    id: 'top-13',
    title: 'Beschlussfassung über die Finanzierung beschlossener Maßnahmen',
    description: 'z. B. Instandhaltungsrücklage, Sonderumlagen',
  },
  {
    id: 'top-14',
    title: 'Verschiedenes',
    description:
      'Themen ohne Beschlussfassung, Fragen der Eigentümer, Sonstiges',
  },
];

// Aktuelle Arbeits-Tagesordnung (wird bearbeitet)
export const boardMeetings: Meeting[] = [...standardAgendaTemplate];

// Beispiel-Versammlungsplanung
export const currentMeetingEvent: MeetingEvent = {
  id: 'meeting-2024-1',
  type: 'Eigentümerversammlung',
  title: 'Ordentliche Eigentümerversammlung 2024',
  date: new Date(2024, 11, 15), // 15. Dezember 2024
  time: '19:00',
  location: {
    street: 'Musterstraße',
    houseNumber: '12',
    locality: 'Gemeinschaftsraum',
    city: 'Musterstadt',
    postalCode: '12345',
  },
  invitees: 'Wohnungseigentümer',
  status: 'Planung',
  agenda: [...standardAgendaTemplate],
  createdAt: new Date(2024, 9, 1),
  updatedAt: new Date(2024, 9, 15),
};

// Protokoll der letzten Eigentümerversammlung
export const lastMeetingProtocol: MeetingProtocol = {
  id: 'protocol-2023-1',
  meetingEventId: 'meeting-2023-1',
  meetingTitle: 'Ordentliche Eigentümerversammlung 2023',
  meetingDate: new Date(2023, 11, 10), // 10. Dezember 2023
  meetingType: 'Eigentümerversammlung',
  location: 'Gemeinschaftsraum, Musterstraße 12',
  chairperson: 'Herr Müller (Hausverwaltung)',
  secretary: 'Frau Schmidt (Beirat)',
  attendees: 18,
  totalVotes: 24,
  items: [
    {
      id: 'item-1',
      topNumber: 1,
      title:
        'Eröffnung der Versammlung, Begrüßung und Feststellung der Beschlussfähigkeit',
      discussion:
        'Herr Müller eröffnete die Versammlung um 19:05 Uhr. Von 24 stimmberechtigten Eigentümern waren 18 anwesend. Beschlussfähigkeit wurde festgestellt.',
      decisionResult: 'Keine Abstimmung',
    },
    {
      id: 'item-2',
      topNumber: 2,
      title: 'Wahl des Versammlungsleiters und Protokollführers',
      discussion:
        'Herr Müller wurde einstimmig als Versammlungsleiter bestätigt. Frau Schmidt übernahm die Protokollführung.',
      decisionResult: 'Angenommen',
      votesFor: 18,
      votesAgainst: 0,
      abstentions: 0,
    },
    {
      id: 'item-3',
      topNumber: 3,
      title: 'Genehmigung der Tagesordnung',
      discussion:
        'Die vorliegende Tagesordnung wurde ohne Änderungen genehmigt. Zusätzlich wurde ein Antrag zur Dachsanierung eingebracht.',
      decisionResult: 'Angenommen',
      votesFor: 18,
      votesAgainst: 0,
      abstentions: 0,
      notes: 'Antrag zur Dachsanierung wird unter TOP 12 behandelt',
    },
    {
      id: 'item-4',
      topNumber: 8,
      title: 'Beschlussfassung über die Jahresabrechnung 2022',
      discussion:
        'Die Jahresabrechnung wurde vom Beirat geprüft und mit positivem Votum vorgelegt. Gesamtkosten: 84.500 €, davon 12.300 € Rücklagen-Zuführung.',
      decision: 'Die Jahresabrechnung 2022 wird genehmigt.',
      decisionResult: 'Angenommen',
      votesFor: 16,
      votesAgainst: 1,
      abstentions: 1,
      notes:
        'Einspruch von Eigentümer WE 7 bezüglich Heizkosten-Verteilung wurde protokolliert',
    },
    {
      id: 'item-5',
      topNumber: 10,
      title: 'Beschlussfassung über den Wirtschaftsplan 2024',
      discussion:
        'Der Wirtschaftsplan sieht Gesamtkosten von 89.200 € vor. Erhöhung hauptsächlich durch gestiegene Energiekosten und geplante Instandhaltungsmaßnahmen.',
      decision:
        'Der Wirtschaftsplan 2024 wird mit den vorgelegten Kostenpositionen genehmigt.',
      decisionResult: 'Angenommen',
      votesFor: 15,
      votesAgainst: 2,
      abstentions: 1,
    },
    {
      id: 'item-6',
      topNumber: 12,
      title: 'Dachsanierung - Zusatzantrag',
      discussion:
        'Antrag von WE 4: Aufgrund von Undichtigkeiten sollte eine Teilsanierung des Daches durchgeführt werden. Kostenvoranschlag: 28.000 €.',
      decision:
        'Die Dachsanierung wird genehmigt. Finanzierung erfolgt aus der Instandhaltungsrücklage (18.000 €) und einer Sonderumlage (10.000 €).',
      decisionResult: 'Angenommen',
      votesFor: 14,
      votesAgainst: 3,
      abstentions: 1,
      notes: 'Ausführung bis März 2024. Weitere Angebote werden eingeholt.',
    },
  ],
  status: 'Genehmigt',
  createdAt: new Date(2023, 11, 11),
  approvedAt: new Date(2023, 11, 20),
};
