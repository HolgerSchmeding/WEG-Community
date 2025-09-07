'use server';

/**
 * @fileOverview An intelligent document search AI agent.
 *
 * - intelligentDocumentSearch - A function that performs semantic document search
 * - DocumentSearchInput - The input type for the search function
 * - DocumentSearchOutput - The return type for the search function
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DocumentSchema = z.object({
  id: z.string().describe('Unique document identifier'),
  title: z.string().describe('Document title'),
  content: z.string().describe('Document content'),
  category: z.string().describe('Document category'),
  tags: z.array(z.string()).describe('Document tags'),
});

const DocumentSearchInputSchema = z.object({
  query: z.string().describe('The search query or question'),
  documents: z
    .array(DocumentSchema)
    .describe('Available documents to search through'),
  userContext: z
    .string()
    .optional()
    .describe('Additional context about the user'),
});

export type DocumentSearchInput = z.infer<typeof DocumentSearchInputSchema>;

const DocumentSearchOutputSchema = z.object({
  relevantDocuments: z
    .array(
      z.object({
        id: z.string(),
        relevanceScore: z.number().describe('Relevance score from 0 to 1'),
        matchReason: z.string().describe('Why this document matches the query'),
        keyExtracts: z
          .array(z.string())
          .describe('Key relevant excerpts from the document'),
      })
    )
    .describe('Documents ranked by relevance'),
  searchSummary: z.string().describe('Summary of what was found'),
  suggestedQueries: z
    .array(z.string())
    .describe('Alternative search suggestions'),
});

export type DocumentSearchOutput = z.infer<typeof DocumentSearchOutputSchema>;

export async function intelligentDocumentSearch(
  input: DocumentSearchInput
): Promise<DocumentSearchOutput> {
  const searchDocumentsFlow = ai.defineFlow(
    {
      name: 'intelligentDocumentSearchFlow',
      inputSchema: DocumentSearchInputSchema,
      outputSchema: DocumentSearchOutputSchema,
    },
    async input => {
      const prompt = ai.definePrompt({
        name: 'documentSearchPrompt',
        input: { schema: DocumentSearchInputSchema },
        output: { schema: DocumentSearchOutputSchema },
        prompt: `Du bist ein intelligenter Dokumenten-Suchassisstent für eine Wohnungseigentümergemeinschaft (WEG).

Deine Aufgabe ist es, aus den verfügbaren Dokumenten die relevantesten für die Suchanfrage zu finden.

Suchanfrage: {{query}}
Benutzerkontext: {{userContext}}

Verfügbare Dokumente:
{{#each documents}}
ID: {{id}}
Titel: {{title}}
Kategorie: {{category}}
Tags: {{#each tags}}{{this}}, {{/each}}
Inhalt: {{content}}
---
{{/each}}

Analysiere die Suchanfrage und finde die relevantesten Dokumente. Berücksichtige dabei:
1. Direkte Stichwort-Übereinstimmungen
2. Semantische Ähnlichkeit und Kontext
3. Kategorie- und Tag-Relevanz
4. Vollständigkeit der Information

Bewerte jeden relevanten Treffer mit einem Score von 0-1 und erkläre, warum er relevant ist.
Extrahiere die wichtigsten Textpassagen, die zur Suchanfrage passen.

Antworte auf Deutsch und priorisiere Dokumente, die direkt zur Anfrage passen.`,
      });

      const { output } = await prompt(input);
      return output!;
    }
  );

  return searchDocumentsFlow(input);
}
