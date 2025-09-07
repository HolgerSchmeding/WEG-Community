# Environment Variables Setup

This document explains how to configure the required environment variables for the WEG-Community application.

## Required Environment Variables

### Authentication (NextAuth.js)

```env
# NextAuth.js Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Firebase Configuration

```env
# Firebase Admin SDK (for user management)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### AI Integration (Google Genkit)

```env
# Google AI Configuration
GOOGLE_GENAI_API_KEY=your-google-ai-api-key
```

## Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Google provider
4. Go to Project Settings → Service Accounts
5. Generate new private key for Admin SDK
6. Copy the configuration values

### 3. Google AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Get your API key
3. Add it to your environment variables

## File Structure

```
.env.local          # Local development (not committed)
.env.example        # Example file (committed to repo)
.env.production     # Production variables (deploy to hosting platform)
```

## Security Notes

- Never commit actual `.env` files to version control
- Use strong, unique values for `NEXTAUTH_SECRET`
- Restrict API keys to specific domains in production
- Use Firebase security rules to protect your database

## Verification

After setting up the environment variables, test the configuration:

```bash
npm run dev
```

Visit `http://localhost:3000` and try to sign in with Google OAuth.
