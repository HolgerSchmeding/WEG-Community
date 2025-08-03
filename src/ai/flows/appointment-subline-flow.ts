
'use server';

/**
 * @fileOverview An AI agent for generating a concise subline for an appointment.
 *
 * - generateAppointmentSubline - A function that handles the subline generation process.
 * - GenerateAppointmentSublineInput - The input type for the generateAppointmentSubline function.
 * - GenerateAppointmentSublineOutput - The return type for the generateAppointmentSubline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppointmentSublineInputSchema = z.object({
  title: z.string().describe('The title of the appointment.'),
  description: z.string().describe('The description of the appointment.'),
});
export type GenerateAppointmentSublineInput = z.infer<typeof GenerateAppointmentSublineInputSchema>;

const GenerateAppointmentSublineOutputSchema = z.object({
  subline: z.string().describe('A short, catchy, and informative subline for the appointment, maximum 10 words.'),
});
export type GenerateAppointmentSublineOutput = z.infer<typeof GenerateAppointmentSublineOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateAppointmentSublinePrompt',
  input: {schema: GenerateAppointmentSublineInputSchema},
  output: {schema: GenerateAppointmentSublineOutputSchema},
  prompt: `Based on the following appointment title and description, generate a short, informative subline. The subline should summarize the purpose of the appointment and must be a maximum of 10 words.

Title: {{{title}}}
Description: {{{description}}}`,
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

const generateAppointmentSublineFlow = ai.defineFlow(
  {
    name: 'generateAppointmentSublineFlow',
    inputSchema: GenerateAppointmentSublineInputSchema,
    outputSchema: GenerateAppointmentSublineOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateAppointmentSubline(input: GenerateAppointmentSublineInput): Promise<GenerateAppointmentSublineOutput> {
  return generateAppointmentSublineFlow(input);
}
