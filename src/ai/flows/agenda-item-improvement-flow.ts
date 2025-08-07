'use server';
/**
 * @fileOverview GenKit Flow für die Verbesserung von Tagesordnungspunkten
 * Nimmt Stichworte entgegen und erstellt professionelle WEG-konforme Formulierungen
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgendaItemImprovementInputSchema = z.object({
  title: z.string().describe('Der Titel/Stichwort für den Tagesordnungspunkt'),
  description: z.string().describe('Grobe Beschreibung oder Stichworte zum Inhalt'),
  meetingType: z.enum(['eigentümerversammlung', 'beiratssitzung', 'außerordentlich'])
    .optional()
    .default('eigentümerversammlung')
    .describe('Art der Versammlung'),
});
export type AgendaItemImprovementInput = z.infer<typeof AgendaItemImprovementInputSchema>;

const AgendaItemImprovementOutputSchema = z.object({
  improvedTitle: z.string().describe('Professionell formulierter Titel'),
  improvedDescription: z.string().describe('Ausführliche, professionelle Beschreibung'),
  legalNotes: z.string().optional().describe('Rechtliche Hinweise falls relevant'),
  voteRequired: z.boolean().describe('Ob dieser Punkt eine Abstimmung erfordert'),
});
export type AgendaItemImprovementOutput = z.infer<typeof AgendaItemImprovementOutputSchema>;

const improveAgendaItemFlowRunner = ai.defineFlow(
  {
    name: 'improveAgendaItemFlow',
    inputSchema: AgendaItemImprovementInputSchema,
    outputSchema: AgendaItemImprovementOutputSchema,
  },
  async ({title, description, meetingType}) => {
    const prompt = `Du bist ein Experte für Wohnungseigentumsgesetz (WEG) und Eigentümerversammlungen. 

Aufgabe: Formuliere den folgenden Tagesordnungspunkt professionell und rechtskonform für eine ${meetingType}.

**Eingabe:**
- Titel/Stichwort: "${title}"
- Beschreibung/Stichworte: "${description}"

**Anforderungen:**
1. Verwende klare, präzise und rechtssichere Formulierungen
2. Berücksichtige WEG-Rechtsprechung und übliche Praxis
3. Strukturiere den Text logisch und verständlich
4. Gib an, ob eine Beschlussfassung erforderlich ist
5. Erwähne rechtliche Aspekte nur wenn relevant

**Beispiele für gute Formulierungen:**
- "Beschlussfassung über Instandsetzungsmaßnahmen am Gemeinschaftseigentum"
- "Bericht der Hausverwaltung über außergewöhnliche Geschäftsvorfälle"
- "Genehmigung der Jahresabrechnung gemäß § 28 WEG"

Erstelle eine professionelle Formulierung, die rechtssicher und verständlich ist.`;

    const {text} = await ai.generate({
      prompt: prompt,
      system: `Du bist ein WEG-Experte. Formuliere Tagesordnungspunkte rechtssicher und professionell. 
      
      Gib deine Antwort im folgenden JSON-Format zurück:
      {
        "improvedTitle": "Professioneller Titel",
        "improvedDescription": "Detaillierte Beschreibung",
        "legalNotes": "Rechtliche Hinweise (optional)",
        "voteRequired": true/false
      }`,
    });

    try {
      const parsed = JSON.parse(text);
      return {
        improvedTitle: parsed.improvedTitle || title,
        improvedDescription: parsed.improvedDescription || description,
        legalNotes: parsed.legalNotes || undefined,
        voteRequired: parsed.voteRequired || false,
      };
    } catch (error) {
      // Fallback wenn JSON parsing fehlschlägt
      return {
        improvedTitle: title,
        improvedDescription: text || description,
        legalNotes: undefined,
        voteRequired: false,
      };
    }
  }
);

export async function improveAgendaItemFlow(
  input: AgendaItemImprovementInput
): Promise<AgendaItemImprovementOutput> {
  return await improveAgendaItemFlowRunner(input);
}
