import chalk from 'chalk';
import validateNpmName from 'validate-npm-package-name';
import { validateProjectName, checkDirectoryExists, suggestProjectName } from '../utils/validation.js';

/**
 * Get interactive prompts based on the question flow
 * @param {string} initialProjectName - Project name passed as CLI argument
 * @returns {Array} Array of Inquirer question objects
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
          return `${validation.errors[0]}\n   ${chalk.cyan(`Suggestion: ${suggestion}`)}`;
        }

        // Check if directory exists
        const dirCheck = checkDirectoryExists(input);
        if (dirCheck.exists) {
          return `Directory "${input}" already exists. Please choose a different name.`;
        }

        return true;
      },
      transformer: (input) => {
        // Show real-time validation feedback
        const validation = validateProjectName(input);
        if (validation.valid) {
          return chalk.green(input);
        }
        return chalk.red(input);
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
      when: (answers) => ['backend', 'fullstack'].includes(answers.projectType),
    },
    // Database selection
    {
      type: 'list',
      name: 'database',
      message: 'Choose your database:',
      choices: [
        { name: 'PostgreSQL', value: 'postgresql' },
        { name: 'MySQL', value: 'mysql' },
        { name: 'MongoDB', value: 'mongodb' },
        { name: 'SQLite', value: 'sqlite' },
        { name: 'None', value: 'none' },
      ],
      when: (answers) => ['backend', 'fullstack'].includes(answers.projectType),
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
    // Folder Structure Preference
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
          name: 'Type-based (Organize by file type: components, utils, etc.)',
          value: 'type-based',
        },
        {
          name: 'Domain-driven (Organize by business domain)',
          value: 'domain-driven',
        },
        {
          name: 'Flat (Simple, minimal structure)',
          value: 'flat',
        },
      ],
      default: 'feature-based',
      when: (answers) => ['frontend', 'fullstack'].includes(answers.projectType),
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
      when: (answers) => ['frontend', 'fullstack'].includes(answers.projectType),
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
          { name: 'Prisma (ORM)', value: 'prisma', checked: false },
          { name: 'JWT (Authentication)', value: 'jsonwebtoken', checked: false },
          { name: 'Bcrypt (Password hashing)', value: 'bcrypt', checked: false },
          { name: 'Winston (Logging)', value: 'winston', checked: false },
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
