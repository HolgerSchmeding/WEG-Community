import { z } from 'zod';

// Schema für Marketplace-Angebote
export const marketplaceItemSchema = z.object({
  type: z.enum(['Gegenstand', 'Dienstleistung', 'Sonstiges'], {
    required_error: 'Bitte wählen Sie einen Typ aus',
  }),
  title: z
    .string()
    .min(3, 'Der Titel muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Titel darf maximal 100 Zeichen lang sein')
    .regex(/^[^<>]*$/, 'Der Titel darf keine HTML-Tags enthalten'),
  offerType: z.enum(['geschenk', 'angebot'], {
    required_error: 'Bitte wählen Sie eine Preisangabe aus',
  }),
  author: z
    .string()
    .min(2, 'Der Name muss mindestens 2 Zeichen lang sein')
    .max(50, 'Der Name darf maximal 50 Zeichen lang sein')
    .regex(/^[^<>]*$/, 'Der Name darf keine HTML-Tags enthalten'),
  email: z
    .string()
    .email('Bitte geben Sie eine gültige E-Mail-Adresse ein')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(
      /^[\d\s\+\-\(\)]*$/,
      'Telefonnummer darf nur Zahlen, Leerzeichen und +,-,(),- enthalten'
    )
    .max(20, 'Telefonnummer darf maximal 20 Zeichen lang sein')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(500, 'Die Beschreibung darf maximal 500 Zeichen lang sein')
    .regex(/^[^<>]*$/, 'Die Beschreibung darf keine HTML-Tags enthalten'),
});

// Schema für Kontakt-Formulare
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Der Name muss mindestens 2 Zeichen lang sein')
    .max(50, 'Der Name darf maximal 50 Zeichen lang sein')
    .regex(/^[^<>]*$/, 'Der Name darf keine HTML-Tags enthalten'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  phone: z
    .string()
    .regex(
      /^[\d\s\+\-\(\)]*$/,
      'Telefonnummer darf nur Zahlen, Leerzeichen und +,-,(),- enthalten'
    )
    .max(20, 'Telefonnummer darf maximal 20 Zeichen lang sein')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Die Nachricht muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Nachricht darf maximal 1000 Zeichen lang sein')
    .regex(/^[^<>]*$/, 'Die Nachricht darf keine HTML-Tags enthalten'),
});

// Edit Form Schema
export const editMarketplaceItemSchema = z.object({
  title: z
    .string()
    .min(3, 'Der Titel muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Titel darf maximal 100 Zeichen lang sein')
    .regex(/^[^<>]*$/, 'Der Titel darf keine HTML-Tags enthalten'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(500, 'Die Beschreibung darf maximal 500 Zeichen lang sein')
    .regex(/^[^<>]*$/, 'Die Beschreibung darf keine HTML-Tags enthalten'),
  type: z.enum(['Gegenstand', 'Dienstleistung', 'Sonstiges']),
  offerType: z.enum(['geschenk', 'angebot']),
  email: z
    .string()
    .email('Bitte geben Sie eine gültige E-Mail-Adresse ein')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(
      /^[\d\s\+\-\(\)]*$/,
      'Telefonnummer darf nur Zahlen, Leerzeichen und +,-,(),- enthalten'
    )
    .max(20, 'Telefonnummer darf maximal 20 Zeichen lang sein')
    .optional()
    .or(z.literal('')),
});

export type MarketplaceItemFormData = z.infer<typeof marketplaceItemSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type EditMarketplaceItemFormData = z.infer<
  typeof editMarketplaceItemSchema
>;

// XSS-Schutz durch HTML-Escaping
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Datei-Validierung
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return { valid: false, error: 'Datei darf maximal 5MB groß sein' };
  }

  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Nur JPEG, PNG und WebP Bilder sind erlaubt',
    };
  }

  return { valid: true };
}
