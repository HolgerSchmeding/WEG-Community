
'use server';

import { appRoute } from '@genkit-ai/next';
import { testEchoFlow } from '@/ai/flows/test-flow';

export const POST = appRoute({
  flow: testEchoFlow,
  // Optional: Konfiguration für Streaming, Auth etc.
  // stream: true, 
});
    