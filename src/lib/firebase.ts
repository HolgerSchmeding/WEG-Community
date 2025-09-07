import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Sichere Firebase-Konfiguration ohne hardcoded Credentials
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validierung der Umgebungsvariablen
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Fehlende Firebase Umgebungsvariablen:', missingEnvVars);

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `Firebase configuration error: Missing environment variables: ${missingEnvVars.join(', ')}`
    );
  } else {
    console.warn(
      '⚠️ Demo-Modus: Firebase wird mit lokalen Mock-Daten ausgeführt'
    );
  }
}

// Debug-Ausgabe nur in der Entwicklung
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase Config Status:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    allEnvVarsLoaded: missingEnvVars.length === 0,
  });
}

// Initialize Firebase - Mit Error Handling
let db: any;

try {
  if (missingEnvVars.length === 0) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);

    // Test Firebase-Verbindung in der Entwicklung
    if (
      process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined'
    ) {
      console.log('✅ Firebase erfolgreich initialisiert');
    }
  } else {
    throw new Error(
      `Missing environment variables: ${missingEnvVars.join(', ')}`
    );
  }
} catch (error) {
  console.error('❌ Firebase Initialisierung fehlgeschlagen:', error);

  // In der Produktion sollte die App nicht laden, wenn Firebase nicht verfügbar ist
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Firebase configuration failed. Please check your environment variables.'
    );
  }

  // In der Entwicklung: Mock-Export für lokale Entwicklung
  console.warn('⚠️ Verwende Mock-Datenbank für lokale Entwicklung');
  db = null;
}

export { db };
