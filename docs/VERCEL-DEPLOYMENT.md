# Vercel Deployment Guide

## Übersicht

Migration von Firebase Hosting zu Vercel zur Behebung des "clientModules undefined" Fehlers mit Next.js 15.3.3.

## Zielbild

- **Hosting**: Vercel (SSR/ISR + API Routes)
- **Backend**: Firebase (Firestore, Storage, Auth, Genkit)
- **Domain**: `*.vercel.app` + optional eigene Domain

## Migrationsschritte

### 1. Vercel Project Setup

1. Auf [vercel.com](https://vercel.com) → **New Project**
2. GitHub Repository: `HolgerSchmeding/WEG-Community`
3. Framework: Next.js (automatisch erkannt)
4. Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `.next` (Standard)
   - Install Command: `npm ci`

### 1.1 Next.js 15 + Vercel Kompatibilitäts-Fix

**Problem**: Next.js 15.3.3 mit Route Groups `(main)` erzeugt ENOENT-Fehler für fehlende `page_client-reference-manifest.js`.

**Lösung**: Client-Reference-Shim implementiert:

1. **Erstellt**: `src/components/_client-ref.tsx`

   ```tsx
   'use client';
   import { useState } from 'react';
   export default function ClientRef() {
     const [_] = useState(null);
     return null;
   }
   ```

2. **Integriert**: In `src/app/(main)/layout.tsx` und `src/app/(main)/page.tsx`
   - Zwingt Next.js Client-Reference-Manifest-Generierung
   - Behebt Vercel File-Tracing für Route Groups

### 2. Environment Variablen

Gehe zu **Project Settings → Environment Variables** und füge folgende Variablen hinzu:

#### Firebase Konfiguration

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDK-LdwrMXJqiq3BC13v2Uh6ii5YXSUhcM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=silberbach-community-hub-t4zya.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=silberbach-community-hub-t4zya
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=silberbach-community-hub-t4zya.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=9949070076
NEXT_PUBLIC_FIREBASE_APP_ID=1:9949070076:web:98843e537f65a72713c333
```

#### NextAuth Konfiguration

```bash
NEXTAUTH_URL=https://YOUR_PROJECT_NAME.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

#### Optional: Genkit/AI Konfiguration

```bash
GOOGLE_AI_API_KEY=your-google-ai-key-here
GOOGLE_GENAI_API_KEY=your-genai-key-here
```

> **Wichtig**: Alle Variablen für **Production** und **Preview** setzen.

### 3. Firebase Auth Update

1. [Firebase Console](https://console.firebase.google.com/project/silberbach-community-hub-t4zya/authentication/settings) öffnen
2. **Authentication → Settings → Authorized domains**
3. Vercel-Domain hinzufügen: `YOUR_PROJECT_NAME.vercel.app`

### 4. Deployment

1. **Deploy** in Vercel UI klicken
2. Oder via CLI:
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

### 5. Validierung

#### Kritische Routen testen:

- ✅ `/` - Hauptseite (200 OK)
- ✅ `/dashboard` - Bewohner-Cockpit
- ✅ `/owner` - Eigentümer-Bereich
- ✅ `/board` - Verwaltungsbeirat
- ✅ `/documents` - Hausordnung
- ✅ `/admin` - Hausverwalter
- ✅ `/api/echo` - API Test

#### Funktionalität prüfen:

- ✅ Middleware-Weiterleitungen
- ✅ Rolle-basierte Navigation
- ✅ Firebase Auth (falls implementiert)
- ✅ Responsive Design

#### Error Monitoring:

- Vercel Dashboard → **Functions** → Logs
- Keine "clientModules"-Fehler mehr

### 6. Domain Setup (Optional)

1. **Project → Domains → Add**
2. DNS konfigurieren (A/CNAME Records)
3. SSL automatisch via Vercel

### 7. Rollback-Plan

- Vercel: **Deployments → Previous → Promote to Production**
- Firebase Hosting bleibt als Fallback verfügbar

## Vorteile Vercel

- ✅ Native Next.js 15 Support
- ✅ Kein OS-Mismatch (Windows ↔ Linux)
- ✅ Bessere SSR/Middleware-Unterstützung
- ✅ Preview-Deployments
- ✅ Edge Functions
- ✅ Built-in Analytics

## Kosten

- **Hobby**: Kostenlos für persönliche Projekte
- **Pro**: $20/Monat für Teams (bei höherem Traffic)

## Support

Bei Problemen:

1. Vercel Logs prüfen
2. Next.js Dokumentation
3. Firebase Authorized Domains prüfen
