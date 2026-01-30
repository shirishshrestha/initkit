import chalk from 'chalk';
import validateNpmName from 'validate-npm-package-name';
import { validateProjectName, checkDirectoryExists, suggestProjectName } from '../utils/validation.js';

/**
 * Get interactive prompts for project configuration
 * 
 * Generates a dynamic question flow based on user selections:
 * 1. Project Type (Frontend/Backend/Full Stack/Library)
 * 2. Project Name (with real-time validation)
 * 3. Framework Selection (conditional based on project type)
 * 4. Language Choice (TypeScript/JavaScript)
 * 5. Additional Features (styling, testing, linting, etc.)
 * 6. Configuration Options (package manager, Git, etc.)
 * 
 * Uses conditional logic with 'when' to show/hide questions based on previous answers.
 * Provides real-time validation feedback with colored icons and suggestions.
 * 
 * @param {string|null} initialProjectName - Project name from CLI argument (e.g., 'initkit my-app')
 *                                           If provided, skips the project name prompt
 * 
 * @returns {Array<Object>} Array of Inquirer.js question objects with:
 *   - type: Question type ('list'|'input'|'confirm'|'checkbox')
 *   - name: Answer key to store the value
 *   - message: Question text displayed to user
 *   - choices: Array of options for list/checkbox questions
 *   - when: Function to conditionally show question based on previous answers
 *   - validate: Function to validate user input with helpful error messages
 *   - transformer: Function to provide real-time visual feedback during input
 *   - default: Default value or function to compute default based on previous answers
 * 
 * @example
 * // Without initial project name (user will be prompted)
 * const questions = getQuestions(null);
 * const answers = await inquirer.prompt(questions);
 * 
 * @example
 * // With initial project name from CLI
 * const questions = getQuestions('my-awesome-app');
 * const answers = await inquirer.prompt(questions);
 * // User will NOT be asked for project name
 */
function getQuestions(initialProjectName) {
  const questions = [
    // Project Type - First question to determine the flow
    {
      type: 'list',
      name: 'projectType',
      message: 'What type of project do you want to create?',
      choices: [
        { name: 'Frontend Only', value: 'frontend' },
        { name: 'Backend Only', value: 'backend' },
        { name: 'Full Stack', value: 'fullstack' },
        { name: 'Node.js Library/Package', value: 'library' },
      ],
    },
    // Project Name - With enhanced validation
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: (answers) => {
        if (initialProjectName) return initialProjectName;
        const typeDefaults = {
          frontend: 'my-frontend-app',
          backend: 'my-backend-api',
          fullstack: 'my-fullstack-app',
          library: 'my-package',
        };
        return typeDefaults[answers.projectType] || 'my-awesome-project';
      },
      when: !initialProjectName,
      validate: (input) => {
        const validation = validateProjectName(input);
        if (!validation.valid) {
          const suggestion = suggestProjectName(input);
          return `${chalk.red('✗')} ${validation.errors[0]}\n   ${chalk.cyan('💡 Try:')} ${chalk.green(suggestion)}`;
        }

        // Check if directory exists
        const dirCheck = checkDirectoryExists(input);
        if (dirCheck.exists) {
          return `${chalk.red('✗')} Directory "${input}" already exists.\n   ${chalk.cyan('💡 Try:')} Choose a different name or remove the existing folder`;
        }

        return true;
      },
      transformer: (input) => {
        // Show real-time validation feedback with icons
        if (!input || input.trim() === '') {
          return chalk.gray(input);
        }
        
        const validation = validateProjectName(input);
        const dirCheck = checkDirectoryExists(input);
        
        if (validation.valid && !dirCheck.exists) {
          return chalk.green('✓ ') + chalk.green(input);
        } else if (!validation.valid) {
          return chalk.red('✗ ') + chalk.red(input);
        } else if (dirCheck.exists) {
          return chalk.yellow('⚠ ') + chalk.yellow(input) + chalk.gray(' (exists)');
        }
        
        return input;
      },
    },
    // Frontend framework selection
    {
      type: 'list',
      name: 'frontend',
      message: 'Choose your frontend framework:',
      choices: [
        { name: 'React', value: 'react' },
        { name: 'Vue.js', value: 'vue' },
        { name: 'Angular', value: 'angular' },
        { name: 'Svelte', value: 'svelte' },
        { name: 'Next.js (React)', value: 'nextjs' },
        { name: 'Nuxt.js (Vue)', value: 'nuxtjs' },
        { name: 'Vanilla JavaScript', value: 'vanilla' },
      ],
      when: (answers) => ['frontend', 'fullstack'].includes(answers.projectType),
    },
    // Full-stack architecture type
    {
      type: 'list',
      name: 'fullstackType',
      message: 'Choose your full-stack architecture:',
      choices: [
        { name: 'Monorepo (apps/ + packages/)', value: 'monorepo' },
        { name: 'Traditional (separate client/ + server/)', value: 'traditional' },
      ],
      when: (answers) => answers.projectType === 'fullstack',
    },
    // Full-stack stack selection
    {
      type: 'list',
      name: 'stack',
      message: 'Choose your full-stack:',
      choices: (answers) => {
        if (answers.fullstackType === 'monorepo') {
          return [
            { name: 'Next.js + Express + MongoDB', value: 'Next.js + Express + MongoDB' },
            { name: 'Next.js + Express + PostgreSQL', value: 'Next.js + Express + PostgreSQL' },
            { name: 'React + Express + MongoDB', value: 'React + Express + MongoDB' },
            { name: 'React + Express + PostgreSQL', value: 'React + Express + PostgreSQL' },
          ];
        }
        return [
          { name: 'MERN (MongoDB + Express + React + Node)', value: 'MERN' },
          { name: 'PERN (PostgreSQL + Express + React + Node)', value: 'PERN' },
          { name: 'Next.js + Express', value: 'Next.js + Express' },
          { name: 'Laravel + React', value: 'Laravel + React' },
        ];
      },
      when: (answers) => answers.projectType === 'fullstack',
    },
    // Backend framework selection
    {
      type: 'list',
      name: 'backend',
      message: 'Choose your backend framework:',
      choices: [
        { name: 'Express.js', value: 'express' },
        { name: 'Fastify', value: 'fastify' },
        { name: 'Koa', value: 'koa' },
        { name: 'NestJS', value: 'nestjs' },
        { name: 'Hapi', value: 'hapi' },
      ],
      when: (answers) => answers.projectType === 'backend',
    },
    // Database selection (for backend only)
    {
      type: 'list',
      name: 'database',
      message: 'Choose your database:',
      choices: [
        { name: 'Prisma (PostgreSQL/MySQL)', value: 'prisma' },
        { name: 'MongoDB', value: 'mongodb' },
        { name: 'PostgreSQL', value: 'postgresql' },
        { name: 'MySQL', value: 'mysql' },
        { name: 'None', value: 'none' },
      ],
      when: (answers) => answers.projectType === 'backend',
    },
    // Language Choice - TypeScript or JavaScript
    {
      type: 'list',
      name: 'language',
      message: 'Choose your programming language:',
      choices: [
        { name: 'TypeScript (Recommended)', value: 'typescript' },
        { name: 'JavaScript', value: 'javascript' },
      ],
      default: 'typescript',
    },
    // Folder Structure Preference - Frontend
    {
      type: 'list',
      name: 'folderStructure',
      message: 'Choose your folder structure preference:',
      choices: [
        {
          name: 'Feature-based (Organize by feature/module)',
          value: 'feature-based',
        },
        {
          name: 'Component-based (Organize by component type)',
          value: 'component-based',
        },
        {
          name: 'Atomic Design (atoms, molecules, organisms)',
          value: 'atomic',
        },
      ],
      default: 'feature-based',
      when: (answers) => ['frontend'].includes(answers.projectType),
    },
    // Folder Structure Preference - Backend
    {
      type: 'list',
      name: 'folderStructure',
      message: 'Choose your backend architecture:',
      choices: [
        {
          name: 'MVC (Model-View-Controller)',
          value: 'mvc',
        },
        {
          name: 'Clean Architecture (Domain-driven layers)',
          value: 'clean-architecture',
        },
        {
          name: 'Feature-based (Organize by feature/module)',
          value: 'feature-based',
        },
        {
          name: 'Layered (Controller-Service-Repository)',
          value: 'layered',
        },
      ],
      default: 'mvc',
      when: (answers) => ['backend'].includes(answers.projectType),
    },
    // TypeScript Configuration Level (if TypeScript selected)
    {
      type: 'list',
      name: 'typescriptStrict',
      message: 'TypeScript strictness level:',
      choices: [
        { name: 'Strict (Recommended for new projects)', value: 'strict' },
        { name: 'Moderate (Balanced type checking)', value: 'moderate' },
        { name: 'Relaxed (Minimal type checking)', value: 'relaxed' },
      ],
      default: 'strict',
      when: (answers) => answers.language === 'typescript',
    },
    // CSS framework/preprocessor
    {
      type: 'list',
      name: 'styling',
      message: 'Choose your styling solution:',
      choices: [
        { name: 'Tailwind CSS', value: 'tailwind' },
        { name: 'CSS Modules', value: 'css-modules' },
        { name: 'Styled Components', value: 'styled-components' },
        { name: 'Emotion', value: 'emotion' },
        { name: 'Sass/SCSS', value: 'sass' },
        { name: 'Plain CSS', value: 'css' },
      ],
      when: (answers) => answers.projectType === 'frontend',
    },
    // Additional Libraries (Multi-select)
    {
      type: 'checkbox',
      name: 'additionalLibraries',
      message: 'Select additional libraries to include:',
      choices: (answers) => {
        const commonChoices = [
          { name: 'Axios (HTTP client)', value: 'axios', checked: false },
          { name: 'Lodash (Utility library)', value: 'lodash', checked: false },
          { name: 'Date-fns (Date utility)', value: 'date-fns', checked: false },
          { name: 'Zod (Schema validation)', value: 'zod', checked: false },
        ];

        const frontendChoices = [
          { name: 'React Query (Data fetching)', value: 'react-query', checked: false },
          { name: 'Zustand (State management)', value: 'zustand', checked: false },
          { name: 'React Hook Form (Forms)', value: 'react-hook-form', checked: false },
          { name: 'Framer Motion (Animations)', value: 'framer-motion', checked: false },
        ];

        const backendChoices = [
          { name: 'JWT (Authentication)', value: 'jwt', checked: false },
          { name: 'Bcrypt (Password hashing)', value: 'bcrypt', checked: false },
          { name: 'Winston (Logging)', value: 'winston', checked: false },
          { name: 'Swagger/OpenAPI (API docs)', value: 'swagger', checked: false },
          { name: 'Rate Limiting', value: 'rate-limit', checked: false },
          { name: 'Docker Setup', value: 'docker', checked: false },
        ];

        let choices = [...commonChoices];

        if (['frontend', 'fullstack'].includes(answers.projectType)) {
          choices = [...choices, ...frontendChoices];
        }

        if (['backend', 'fullstack'].includes(answers.projectType)) {
          choices = [...choices, ...backendChoices];
        }

        return choices;
      },
    },
    // Development Tools & Features
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select development tools and features:',
      choices: [
        { name: 'ESLint (Code linting)', value: 'eslint', checked: true },
        { name: 'Prettier (Code formatting)', value: 'prettier', checked: true },
        { name: 'Husky (Git hooks)', value: 'husky', checked: false },
        { name: 'Lint-staged (Run linters on staged files)', value: 'lint-staged', checked: false },
        { name: 'Jest (Unit testing)', value: 'jest', checked: false },
        { name: 'Vitest (Fast unit testing)', value: 'vitest', checked: false },
        { name: 'Docker configuration', value: 'docker', checked: false },
        { name: 'GitHub Actions CI/CD', value: 'github-actions', checked: false },
        { name: 'Environment variables (.env)', value: 'dotenv', checked: true },
        { name: 'EditorConfig', value: 'editorconfig', checked: true },
      ],
    },
    // Package manager
    {
      type: 'list',
      name: 'packageManager',
      message: 'Choose your package manager:',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'pnpm', value: 'pnpm' },
      ],
      default: 'npm',
    },
    // Git initialization
    {
      type: 'confirm',
      name: 'useGit',
      message: 'Initialize Git repository?',
      default: true,
    },
  ];

  return questions;
}

export { getQuestions };
