import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==============================================
// GLOBAL TYPES FÜR DIE WEG-COMMUNITY ANWENDUNG
// ==============================================

// Base Types
export type UserRole = "admin" | "resident" | "owner" | "board" | "hausverwalter";
export type AppointmentStatus = "Entwurf" | "Anstehend" | "Vergangen";
export type AnnouncementStatus = "Aktiv" | "Entwurf" | "Abgelaufen";
export type TicketStatus = "Erstellt" | "In Bearbeitung" | "Warten auf Antwort" | "Erledigt" | "Storniert";
export type DocumentCategory = "protocol" | "annual" | "correspondence" | "legal";
export type MarketplaceOfferType = "geschenk" | "verkauf" | "gesuch";
export type ContactCategory = "maintenance" | "billing" | "general" | "complaint" | "emergency";

// Meeting Planning Types
export type MeetingType = "Eigentümerversammlung" | "Beiratssitzung" | "Sonder-Eigentümerversammlung";
export type MeetingStatus = "Entwurf" | "Planung" | "Genehmigt" | "Versendet";
export type InviteeGroup = "Wohnungseigentümer" | "Beirat" | "Alle";

export interface MeetingEvent {
  id: string;
  type: MeetingType;
  title: string;
  date?: Date;
  time?: string;
  location: {
    street: string;
    houseNumber: string;
    locality: string; // z.B. "Gemeindesaal", "Verwaltungsraum"
    city?: string;
    postalCode?: string;
  };
  invitees: InviteeGroup;
  status: MeetingStatus;
  agenda: Meeting[]; // Tagesordnungspunkte
  createdAt: Date;
  updatedAt: Date;
}

// Protocol Types
export type ProtocolStatus = "Entwurf" | "Zur Prüfung" | "Genehmigt" | "Veröffentlicht";
export type DecisionResult = "Angenommen" | "Abgelehnt" | "Vertagt" | "Keine Abstimmung";

export interface VotingResult {
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  totalVoters: number;
  isValid: boolean; // Automatische Validierung
}

export interface LiveProtocolItem {
  id: string;
  topNumber: number;
  title: string;
  description?: string; // Subtext aus der ursprünglichen Tagesordnung
  requiresVoting?: boolean; // Ob für diesen TOP eine Abstimmung geplant ist
  discussion: string; // Live-Eingabe während der Diskussion
  decision?: string; // Beschluss-Text
  decisionResult?: DecisionResult;
  votingResult?: VotingResult;
  notes?: string; // Zusätzliche Anmerkungen
  keywords?: string; // Stichworte für KI-Verbesserung
  isCompleted: boolean; // Ob der TOP abgeschlossen ist
  currentVoters?: number; // Aktuelle Anzahl Stimmberechtigte für diesen TOP
  startTime?: Date;
  endTime?: Date;
}

export interface LiveProtocolSession {
  id: string;
  meetingEventId: string;
  meetingTitle: string;
  meetingDate: Date;
  chairperson: string;
  secretary: string;
  totalVoters: number; // Anwesende Stimmberechtigte
  items: LiveProtocolItem[];
  currentTopIndex: number; // Aktuell behandelter TOP
  status: "Vorbereitung" | "Laufend" | "Pausiert" | "Abgeschlossen";
  startTime?: Date;
  endTime?: Date;
}

export interface ProtocolItem {
  id: string;
  topNumber: number;
  title: string;
  discussion: string; // Zusammenfassung der Diskussion
  decision?: string; // Beschluss-Text
  decisionResult?: DecisionResult;
  votesFor?: number;
  votesAgainst?: number;
  abstentions?: number;
  notes?: string; // Zusätzliche Anmerkungen
}

export interface MeetingProtocol {
  id: string;
  meetingEventId: string;
  meetingTitle: string;
  meetingDate: Date;
  meetingType: MeetingType;
  location: string;
  chairperson: string; // Versammlungsleiter
  secretary: string; // Protokollführer
  attendees: number; // Anzahl Teilnehmer
  totalVotes: number; // Anzahl stimmberechtigte
  items: ProtocolItem[];
  status: ProtocolStatus;
  createdAt: Date;
  approvedAt?: Date;
}

// User Types
export interface User {
  id: string;
  salutation: "Herr" | "Frau" | "Divers";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  credentialsSent: boolean;
  createdAt: Date;
  fullName?: string; // Computed property for display
}

export interface UserFormData extends Omit<User, 'id' | 'createdAt' | 'credentialsSent' | 'fullName'> {}

// Meeting & Appointment Types
export interface Meeting {
  id: string;
  title: string;
  description: string;
  date?: Date;
  location?: string;
  participants?: string[];
  requiresVoting?: boolean; // Neu: Kennzeichnung ob Abstimmung notwendig
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  description: string;
  status: AppointmentStatus;
  visibility: UserRole[];
  author?: string;
  type?: string;
  subline?: string;
  internalNotes?: string;
  location?: string;
  duration?: number; // in minutes
}

export interface AppointmentFormData extends Omit<Appointment, 'id' | 'author'> {}

export interface AppointmentTypeDetails {
  label: string;
  color: string;
  icon: string;
  description: string;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  status: AnnouncementStatus;
  visibility: {
    residents: boolean;
    owners: boolean;
  };
  createdAt: Date;
  expiresAt?: Date;
  priority?: "low" | "medium" | "high";
  category?: string;
}

export interface AnnouncementFormData extends Omit<Announcement, 'id' | 'createdAt'> {}

// Document Types
export interface Document {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
  category: DocumentCategory;
  visibility: UserRole[];
  url?: string;
  downloadCount?: number;
}

export interface DocumentFormData extends Omit<Document, 'id' | 'downloadCount'> {}

// Marketplace Types
export interface MarketplaceItem {
  id: string;
  type: string;
  title: string;
  author: string;
  email: string;
  phone?: string;
  offerType: MarketplaceOfferType;
  description: string;
  createdAt: Date;
  fileName?: string;
  imageUrl?: string;
  price?: string;
  location?: string;
  condition?: "new" | "like-new" | "good" | "fair" | "poor";
}

export interface MarketplaceFormData extends Omit<MarketplaceItem, 'id' | 'createdAt'> {}

// Ticket & Contact Types
export interface TicketAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  url?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  requester: string;
  email: string;
  phone?: string;
  date: string;
  status: TicketStatus;
  reminderDate: Date | null;
  category: ContactCategory;
  message: string;
  attachments: TicketAttachment[];
  responses?: TicketResponse[];
  priority?: "low" | "medium" | "high";
  assignedTo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  author: string;
  authorRole: UserRole;
  message: string;
  createdAt: Date;
  attachments?: TicketAttachment[];
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  category: ContactCategory;
  message: string;
  contactStatus: "resident" | "owner";
  attachments?: File[];
}

// File Upload Types
export interface FileUploadConfig {
  maxSize: number; // in bytes
  allowedTypes: string[];
  maxFiles: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Form Validation Types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
  timestamp?: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search & Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  author?: string;
  tags?: string[];
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

// UI Component Types
export interface LoadingStateProps {
  isLoading: boolean;
  error?: string;
  retry?: () => void;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Permission & Auth Types
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: "create" | "read" | "update" | "delete";
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// Theme & UI Types
export type ThemeMode = "light" | "dark" | "system";

export interface UIPreferences {
  theme: ThemeMode;
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// Dashboard & Analytics Types
export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  change?: {
    value: number;
    direction: "up" | "down";
    timeframe: string;
  };
  icon?: string;
  color?: string;
}

export interface ActivityLogEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: Date;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

// Calendar & Event Types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  description?: string;
  location?: string;
  attendees?: string[];
  category?: string;
  color?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: Date;
}

// System Config Types
export interface SystemConfig {
  siteName: string;
  adminEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  features: {
    marketplace: boolean;
    announcements: boolean;
    documents: boolean;
    calendar: boolean;
    tickets: boolean;
  };
  limits: {
    maxFileSize: number;
    maxFilesPerUpload: number;
    maxTicketsPerUser: number;
  };
}

// Utility Types for better type safety
export type NonEmptyArray<T> = [T, ...T[]];
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Database/Firestore specific types
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export type WithFirestoreData<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
};
