'use client';

import * as React from 'react';

export interface TicketAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface Ticket {
  id: string;
  subject: string;
  requester: string;
  date: string;
  status:
    | 'Erstellt'
    | 'Offen'
    | 'In Bearbeitung'
    | 'Wartend'
    | 'Zur Erledigung'
    | 'Erledigt';
  reminderDate: Date | null;
  category?: string;
  message?: string;
  email?: string;
  phone?: string;
  attachments?: TicketAttachment[];
  createdAt: Date;
  // Zusätzliche Felder für Hausverwalter
  house?: string;
  street?: string;
  city?: string;
  ownerName?: string;
  createdByRole?: 'owner' | 'hausverwalter';
}

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => string;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  getTicket: (id: string) => Ticket | undefined;
  getUserTickets: (requester: string) => Ticket[];
}

const TicketContext = React.createContext<TicketContextType | undefined>(
  undefined
);

// Initial mock data
const initialTickets: Ticket[] = [
  {
    id: 'T2024-07-001',
    subject: 'Frage zur Nebenkostenabrechnung',
    requester: 'Familie Mustermann',
    date: '19. Juli 2024',
    status: 'Wartend',
    reminderDate: new Date(2024, 7, 1),
    category: 'billing',
    message: 'Ich hätte eine Frage zur aktuellen Nebenkostenabrechnung...',
    email: 'mustermann@example.com',
    createdAt: new Date(2024, 6, 19),
    attachments: [],
  },
  {
    id: 'T2024-07-002',
    subject: 'Defekte Glühbirne im Treppenhaus (3. OG)',
    requester: 'Herr Schmidt',
    date: '18. Juli 2024',
    status: 'Offen',
    reminderDate: null,
    category: 'maintenance',
    message:
      'Die Glühbirne im 3. OG ist seit gestern defekt und sollte ausgetauscht werden.',
    email: 'schmidt@example.com',
    createdAt: new Date(2024, 6, 18),
    attachments: [],
  },
  {
    id: 'T2024-07-003',
    subject: 'Meldung: Wasserfleck an der Garagendecke',
    requester: 'Frau Meier',
    date: '15. Juli 2024',
    status: 'Erledigt',
    reminderDate: null,
    category: 'maintenance',
    message:
      'In der Garage ist ein größerer Wasserfleck an der Decke aufgetreten.',
    email: 'meier@example.com',
    createdAt: new Date(2024, 6, 15),
    attachments: [],
  },
  {
    id: 'T2024-07-004',
    subject: 'Regenrinne verstopft',
    requester: 'Familie Huber',
    date: '14. Juli 2024',
    status: 'Zur Erledigung',
    reminderDate: new Date(2024, 6, 25),
    category: 'maintenance',
    message: 'Die Regenrinne auf der Südseite des Gebäudes ist verstopft.',
    email: 'huber@example.com',
    createdAt: new Date(2024, 6, 14),
    attachments: [],
  },
];

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = React.useState<Ticket[]>(initialTickets);

  const addTicket = React.useCallback(
    (ticketData: Omit<Ticket, 'id' | 'createdAt'>): string => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const counter = tickets.length + 1;

      const newId = `T${year}-${month}-${String(counter).padStart(3, '0')}`;

      const newTicket: Ticket = {
        ...ticketData,
        id: newId,
        createdAt: now,
        status: 'Erstellt',
      };

      setTickets(prev => [newTicket, ...prev]);
      return newId;
    },
    [tickets.length]
  );

  const updateTicket = React.useCallback(
    (id: string, updates: Partial<Ticket>) => {
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === id ? { ...ticket, ...updates } : ticket
        )
      );
    },
    []
  );

  const getTicket = React.useCallback(
    (id: string) => {
      return tickets.find(ticket => ticket.id === id);
    },
    [tickets]
  );

  const getUserTickets = React.useCallback(
    (requester: string) => {
      return tickets.filter(ticket => ticket.requester === requester);
    },
    [tickets]
  );

  const value = React.useMemo(
    () => ({
      tickets,
      addTicket,
      updateTicket,
      getTicket,
      getUserTickets,
    }),
    [tickets, addTicket, updateTicket, getTicket, getUserTickets]
  );

  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
}

export function useTickets() {
  const context = React.useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
