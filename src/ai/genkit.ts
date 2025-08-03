import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This file is now ONLY for initializing and exporting the ai object.
// Flow imports have been moved to the entry points (API route and dev server)
// to prevent circular dependencies.

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-pro',
});
