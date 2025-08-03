import { config } from 'dotenv';
config();

// All flows are registered by importing the central flow index.
// This is used for the Genkit dev UI.
import './flows';
