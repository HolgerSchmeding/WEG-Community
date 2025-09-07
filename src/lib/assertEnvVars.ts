// This file is intended to assert the presence of environment variables
// at build time.

export function assertEnvVars() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // Optional: Validierung der Firebase API Key-Formatierung
  if (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.startsWith('AIza')
  ) {
    console.warn(
      'Firebase API key format might be incorrect - should start with "AIza"'
    );
  }

  console.log('✅ All required environment variables are present');
}

// Call the function to ensure it runs
assertEnvVars();
