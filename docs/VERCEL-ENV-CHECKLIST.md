# Vercel Environment Variables Checkliste

## Kopiervorlage für Vercel Project Settings

Gehe zu **Project Settings → Environment Variables** und füge diese Variablen hinzu:

### Firebase Config (Required)

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDK-LdwrMXJqiq3BC13v2Uh6ii5YXSUhcM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=silberbach-community-hub-t4zya.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=silberbach-community-hub-t4zya
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=silberbach-community-hub-t4zya.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=9949070076
NEXT_PUBLIC_FIREBASE_APP_ID=1:9949070076:web:98843e537f65a72713c333
```

### NextAuth Config (If using NextAuth)

```
NEXTAUTH_URL=https://YOUR_VERCEL_PROJECT.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### AI/Genkit Config (Optional)

```
GOOGLE_AI_API_KEY=your-google-ai-key
GOOGLE_GENAI_API_KEY=your-genai-key
```

## Environment Setup Steps

1. **Production Environment**
   - Setze alle Variablen für Production
   - NEXTAUTH_URL auf Production-Domain setzen

2. **Preview Environment**
   - Gleiche Variablen für Preview-Deploys
   - NEXTAUTH_URL kann auf Preview-Domain zeigen

3. **Development Environment**
   - Optional: Lokale Entwicklungs-Keys
   - Meist identisch mit Production

## Firebase Auth Update

Nach ENV-Setup in Firebase Console:

1. **Authentication → Settings → Authorized domains**
2. Hinzufügen: `your-project.vercel.app`
3. Optional: Custom Domain hinzufügen

## Validierung

Nach Deployment testen:

- Environment Variables in Vercel Function Logs sichtbar
- Firebase-Verbindung funktioniert
- NextAuth (falls genutzt) Redirects korrekt
