'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import {
  marketplaceItemSchema,
  editMarketplaceItemSchema,
  sanitizeHtml,
} from '@/lib/validations/marketplace';
import { redirect } from 'next/navigation';

export async function addMarketplaceItem(formData: FormData) {
  try {
    // Extrahiere und validiere Form-Daten
    const rawData = {
      type: formData.get('type') as string,
      title: formData.get('title') as string,
      offerType: formData.get('offerType') as string,
      author: formData.get('author') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      description: formData.get('description') as string,
    };

    // Validierung mit Zod
    const result = marketplaceItemSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: 'Ungültige Daten',
        fieldErrors: result.error.flatten().fieldErrors,
      };
    }

    const validatedData = result.data;

    // XSS-Schutz durch Sanitization
    const sanitizedData = {
      type: sanitizeHtml(validatedData.type),
      title: sanitizeHtml(validatedData.title),
      offerType: sanitizeHtml(validatedData.offerType),
      author: sanitizeHtml(validatedData.author),
      email: validatedData.email ? sanitizeHtml(validatedData.email) : '',
      phone: validatedData.phone ? sanitizeHtml(validatedData.phone) : '',
      description: sanitizeHtml(validatedData.description),
      timestamp: new Date(),
    };

    // Sicheres Speichern in Firestore
    await addDoc(collection(db, 'marketplace'), sanitizedData);

    // Cache invalidieren
    revalidatePath('/marketplace');

    return { success: true, message: 'Angebot erfolgreich erstellt!' };
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Marketplace-Items:', error);
    return {
      success: false,
      error:
        'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    };
  }
}

export async function updateMarketplaceItem(id: string, formData: FormData) {
  try {
    // Extrahiere und validiere Form-Daten
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string,
      offerType: formData.get('offerType') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };

    // Validierung mit Zod
    const result = editMarketplaceItemSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: 'Ungültige Daten',
        fieldErrors: result.error.flatten().fieldErrors,
      };
    }

    const validatedData = result.data;

    // XSS-Schutz durch Sanitization
    const sanitizedData = {
      title: sanitizeHtml(validatedData.title),
      description: sanitizeHtml(validatedData.description),
      type: sanitizeHtml(validatedData.type),
      offerType: sanitizeHtml(validatedData.offerType),
      email: validatedData.email ? sanitizeHtml(validatedData.email) : '',
      phone: validatedData.phone ? sanitizeHtml(validatedData.phone) : '',
      lastModified: new Date(),
    };

    // Dokument-Referenz erstellen und aktualisieren
    const docRef = doc(db, 'marketplace', id);
    await updateDoc(docRef, sanitizedData);

    // Cache invalidieren
    revalidatePath('/marketplace');

    return { success: true, message: 'Angebot erfolgreich aktualisiert!' };
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Marketplace-Items:', error);
    return {
      success: false,
      error:
        'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    };
  }
}

export async function deleteMarketplaceItem(id: string) {
  try {
    // Input-Validierung
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        error: 'Ungültige ID',
      };
    }

    // Dokument löschen
    const docRef = doc(db, 'marketplace', id);
    await deleteDoc(docRef);

    // Cache invalidieren
    revalidatePath('/marketplace');

    return { success: true, message: 'Angebot erfolgreich gelöscht!' };
  } catch (error) {
    console.error('Fehler beim Löschen des Marketplace-Items:', error);
    return {
      success: false,
      error:
        'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    };
  }
}

export async function getMarketplaceItems() {
  try {
    const querySnapshot = await getDocs(collection(db, 'marketplace'));
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, items };
  } catch (error) {
    console.error('Fehler beim Abrufen der Marketplace-Items:', error);
    return {
      success: false,
      error: 'Fehler beim Laden der Angebote',
      items: [],
    };
  }
}
