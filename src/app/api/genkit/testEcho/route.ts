'use server';

import { appRoute } from '@genkit-ai/next';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TestEchoInputSchema = z.object({
  message: z.string().describe('The message to be echoed.'),
});

const TestEchoOutputSchema = z.object({
  echoed: z.string().describe('The echoed message.'),
});

const testEchoFlow = ai.defineFlow(
  {
    name: 'testEchoFlow',
    inputSchema: TestEchoInputSchema,
    outputSchema: TestEchoOutputSchema,
  },
  async ({ message }) => {
    return { echoed: `Echo: ${message}` };
  }
);

export const POST = appRoute(testEchoFlow);
