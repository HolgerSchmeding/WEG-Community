import { NextRequest, NextResponse } from 'next/server';

// Mock-Funktion für Firebase Usage API
// In der Praxis würden Sie hier die echten Firebase Admin APIs verwenden
async function getFirebaseUsage(projectId: string) {
  // Simulierte Daten - fixe Demo-Werte für konsistente Präsentation
  return {
    currentMonth: {
      aiRequests: 743, // Fest für Demo
      maxRequests: 1000,
      cost: 24.70, // €24.70 - realistisch für WEG-Community Nutzung
      budget: 50.00
    },
    breakdown: [
      { 
        service: "Gemini 2.5 Flash", 
        requests: 423, 
        cost: 18.20, // Hauptteil der Kosten
        avgResponseTime: "1.2s"
      },
      { 
        service: "Gemini 1.5 Flash", 
        requests: 234, 
        cost: 4.80, // Günstigere Variante
        avgResponseTime: "0.9s"
      },
      { 
        service: "Document AI", 
        requests: 86, 
        cost: 1.70, // Dokumentenverarbeitung
        avgResponseTime: "0.7s"
      }
    ],
    dailyUsage: [
      { day: 'So', requests: 45 },
      { day: 'Mo', requests: 127 },
      { day: 'Di', requests: 98 },
      { day: 'Mi', requests: 112 },
      { day: 'Do', requests: 134 },
      { day: 'Fr', requests: 89 },
      { day: 'Sa', requests: 138 }
    ]
  };
}

export async function GET(request: NextRequest) {
  try {
    const projectId = 'silberbach-community-hub-t4zya';
    
    // Hole Usage-Daten
    const usageData = await getFirebaseUsage(projectId);
    
    // Zusätzliche berechnete Metriken
    const totalRequests = usageData.breakdown.reduce((sum, service) => sum + service.requests, 0);
    const totalCost = usageData.breakdown.reduce((sum, service) => sum + service.cost, 0);
    const weeklyAverage = usageData.dailyUsage.reduce((sum, day) => sum + day.requests, 0) / 7;
    
    const response = {
      ...usageData,
      metrics: {
        totalRequests,
        totalCost: Math.round(totalCost * 100) / 100,
        weeklyAverage: Math.round(weeklyAverage),
        projectedMonthly: Math.round(weeklyAverage * 4.33 * 7), // 4.33 Wochen pro Monat
        costPerRequest: totalRequests > 0 ? Math.round((totalCost / totalRequests) * 1000) / 10 : 0 // in Cent
      },
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching usage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

// Beispiel für echte Firebase Admin Integration:
/*
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

async function getRealFirebaseUsage() {
  const db = getFirestore();
  
  // Sammle Usage-Daten aus Ihrer Anwendung
  const usageSnapshot = await db.collection('usage')
    .where('month', '==', new Date().getMonth() + 1)
    .where('year', '==', new Date().getFullYear())
    .get();
    
  // Verarbeite und aggregiere die Daten
  // ...
}
*/
