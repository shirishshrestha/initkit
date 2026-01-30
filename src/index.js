/**
 * Main entry point for programmatic usage
 * This allows the package to be used as a library, not just a CLI
 */

import { createProject } from './commands/create.js';
import { getQuestions } from './prompts/questions.js';

export { createProject, getQuestions };
