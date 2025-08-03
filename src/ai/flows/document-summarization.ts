
'use server';

/**
 * @fileOverview A document summarization AI agent.
 *
 * - summarizeDocument - A function that handles the document summarization process.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to be summarized.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('The summary of the document.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  const summarizeDocumentFlow = ai.defineFlow(
    {
      name: 'summarizeDocumentFlow',
      inputSchema: SummarizeDocumentInputSchema,
      outputSchema: SummarizeDocumentOutputSchema,
    },
    async (input) => {
      const prompt = ai.definePrompt({
        name: 'summarizeDocumentPrompt',
        input: {schema: SummarizeDocumentInputSchema},
        output: {schema: SummarizeDocumentOutputSchema},
        prompt: `You are an expert summarizer. Please summarize the following document:

{{{documentContent}}}`,
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
        ],
      });
      const {output} = await prompt(input);
      return output!;
    }
  );
  return summarizeDocumentFlow(input);
}
