'use server';

/**
 * @fileOverview A simple test flow that echoes the input message.
 *
 * - testEchoFlow - A function that handles the echo process.
 * - TestEchoInput - The input type for the testEchoFlow function.
 * - TestEchoOutput - The return type for the testEchoFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TestEchoInputSchema = z.object({
  message: z.string().describe('The message to be echoed.'),
});
export type TestEchoInput = z.infer<typeof TestEchoInputSchema>;

const TestEchoOutputSchema = z.object({
  echoed: z.string().describe('The echoed message.'),
});
export type TestEchoOutput = z.infer<typeof TestEchoOutputSchema>;

const testEchoFlowRunner = ai.defineFlow(
  {
    name: 'testEchoFlow',
    inputSchema: TestEchoInputSchema,
    outputSchema: TestEchoOutputSchema,
  },
  async ({ message }) => {
    return { echoed: `Echo: ${message}` };
  }
);

export async function testEchoFlow(
  input: TestEchoInput
): Promise<TestEchoOutput> {
  return testEchoFlowRunner(input);
}
