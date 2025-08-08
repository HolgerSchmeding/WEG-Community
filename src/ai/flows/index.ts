/**
 * @fileOverview Central index for all Genkit flows.
 * Importing this file registers all defined flows with the Genkit system.
 * This should only be imported by application entry points (e.g., API routes, dev server).
 */
import './document-summarization';
import './document-search';
import './appointment-subline-flow';
import './board-assistant-flow';
import './test-flow';
import './agenda-item-improvement-flow';
