import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration mit Fallback-Werten für bessere Debugging
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDK-LdwrMXJqiq3BC13v2Uh6ii5YXSUhcM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "silberbach-community-hub-t4zya.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "silberbach-community-hub-t4zya",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "silberbach-community-hub-t4zya.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "9949070076",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:9949070076:web:98843e537f65a72713c333"
};

// Debug-Ausgabe in der Entwicklung
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase Config Debug:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    envLoaded: {
      apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }
  });
}

// Validierung nur in der Produktion
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required Firebase environment variable: ${envVar}`);
    }
  }
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };