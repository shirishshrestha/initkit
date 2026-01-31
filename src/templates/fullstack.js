import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { getLatestVersion } from '../utils/versionFetcher.js';
import { generateNextjsTemplate } from './nextjs.js';
import { generateReactTemplate } from './react.js';
import { generateExpressTemplate } from './express.js';

async function fetchVersion(packageName, fallback = 'latest') {
  try {
    const version = await getLatestVersion(packageName);
    return `^${version}`;
  } catch {
    return fallback;
  }
}

/**
 * Generate Full-Stack project with integrated frontend and backend
 *
 * Creates a complete full-stack application supporting:
 * - **Monorepo Structure**: Turborepo with apps/ and packages/ workspaces
 * - **Traditional Structure**: Separate client/ and server/ directories
 * - **Popular Stacks**: MERN, PERN, T3 Stack, Next.js + Express, etc.
 * - **Shared Packages**: Common types, UI components, utilities
 * - **API Integration**: Pre-configured frontend-backend communication
 * - **Database Setup**: Models, migrations, seeders
 * - **Docker Compose**: Complete orchestration for all services
 *
 * Generated project includes:
 * - Frontend application (React, Next.js, Vue, etc.)
 * - Backend API (Express, NestJS, etc.)
 * - Shared TypeScript types package
 * - UI components library (optional)
 * - Root configuration (Turborepo, Docker Compose, etc.)
 * - Environment configuration for all services
 * - Comprehensive README with setup instructions
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User configuration object
 * @param {string} config.projectName - Name of the project
 * @param {string} config.language - Programming language ('typescript'|'javascript')
 * @param {string} config.fullstackType - Project structure type
 *   - 'monorepo': Turborepo with workspaces (recommended for large projects)
 *   - 'traditional': Separate client/ and server/ folders
 * @param {string} config.stack - Technology stack selection
 *   - 'MERN': MongoDB + Express + React + Node.js
 *   - 'PERN': PostgreSQL + Express + React + Node.js
 *   - 'T3': Next.js + tRPC + Prisma + NextAuth
 *   - 'Next.js + Express': Next.js frontend with Express backend
 *   - 'Vue + Express': Vue.js frontend with Express backend
 * @param {string} [config.frontend] - Frontend framework (derived from stack)
 * @param {string} [config.backend] - Backend framework (derived from stack)
 * @param {string} [config.database] - Database choice (derived from stack)
 * @param {string} config.packageManager - Package manager to use
 *
 * @returns {Promise<void>}
 *
 * @example
 * // Create MERN stack monorepo with Turborepo
 * await generateFullStackTemplate('/path/to/project', {
 *   projectName: 'my-fullstack-app',
 *   language: 'typescript',
 *   fullstackType: 'monorepo',
 *   stack: 'MERN',
 *   packageManager: 'pnpm'
 * });
 *
 * @example
 * // Create T3 Stack (Next.js + tRPC + Prisma)
 * await generateFullStackTemplate('/path/to/project', {
 *   projectName: 'my-t3-app',
 *   language: 'typescript',
 *   fullstackType: 'monorepo',
 *   stack: 'T3',
 *   packageManager: 'pnpm'
 * });
 */
export async function generateFullStackTemplate(projectPath, config) {
  const { fullstackType, stack } = config;

  if (fullstackType === 'monorepo') {
    await generateMonorepoStructure(projectPath, config);
  } else {
    await generateTraditionalFullStack(projectPath, config);
  }
}

/**
 * Generate Monorepo Structure with Turborepo
 */
async function generateMonorepoStructure(projectPath, config) {
  const { stack } = config;

  // Create monorepo folder structure
  await fs.ensureDir(path.join(projectPath, 'apps', 'frontend'));
  await fs.ensureDir(path.join(projectPath, 'apps', 'backend'));
  await fs.ensureDir(path.join(projectPath, 'packages', 'shared-types'));
  await fs.ensureDir(path.join(projectPath, 'packages', 'ui-components'));

  // Generate root package.json with workspaces
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    await generateMonorepoPackageJson(config)
  );

  // Generate turbo.json
  await fs.writeFile(path.join(projectPath, 'turbo.json'), generateTurboConfig());

  // Generate frontend in apps/frontend
  const frontendPath = path.join(projectPath, 'apps', 'frontend');
  const frontendConfig = {
    ...config,
    projectName: 'frontend',
    frontend: stack.includes('Next.js') ? 'nextjs' : 'react',
  };

  if (stack.includes('Next.js')) {
    await generateNextjsTemplate(frontendPath, frontendConfig);
  } else {
    await generateReactTemplate(frontendPath, frontendConfig);
  }

  // Generate backend in apps/backend
  const backendPath = path.join(projectPath, 'apps', 'backend');
  const backendConfig = {
    ...config,
    projectName: 'backend',
    backend: 'express',
    database: stack.includes('MongoDB')
      ? 'mongodb'
      : stack.includes('PostgreSQL')
        ? 'prisma'
        : 'none',
  };
  await generateExpressTemplate(backendPath, backendConfig);

  // Generate shared packages
  await generateSharedTypes(path.join(projectPath, 'packages', 'shared-types'));
  await generateUIComponents(path.join(projectPath, 'packages', 'ui-components'), config);

  // Generate root-level configs
  await generateMonorepoRootFiles(projectPath, config);

  // Generate Docker setup for monorepo
  await generateMonorepoDockerSetup(projectPath, config);

  // Generate README
  await generateMonorepoReadme(projectPath, config);
}

/**
 * Generate Traditional Full-Stack Structure
 */
async function generateTraditionalFullStack(projectPath, config) {
  const { stack } = config;

  if (stack === 'MERN') {
    await generateMERNStack(projectPath, config);
  } else if (stack === 'PERN') {
    await generatePERNStack(projectPath, config);
  } else if (stack === 'Next.js + Express') {
    await generateNextExpressStack(projectPath, config);
  } else if (stack === 'Laravel + React') {
    await generateLaravelReactStack(projectPath, config);
  }
}

/**
 * MERN Stack (MongoDB, Express, React, Node)
 */
async function generateMERNStack(projectPath, config) {
  // Create folder structure
  await fs.ensureDir(path.join(projectPath, 'client'));
  await fs.ensureDir(path.join(projectPath, 'server'));

  // Generate React frontend in client/
  const clientConfig = {
    ...config,
    projectName: 'client',
    frontend: 'react',
    additionalLibraries: ['react-router', 'axios'],
  };
  await generateReactTemplate(path.join(projectPath, 'client'), clientConfig);

  // Generate Express backend in server/
  const serverConfig = {
    ...config,
    projectName: 'server',
    backend: 'express',
    database: 'mongodb',
    folderStructure: 'mvc',
  };
  await generateExpressTemplate(path.join(projectPath, 'server'), serverConfig);

  // Generate root package.json
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    await generateRootPackageJson(config, 'MERN')
  );

  // Generate Docker setup
  await generateDockerSetup(projectPath, config, 'MERN');

  // Generate API proxy config
  await generateAPIConfig(projectPath, config, 'MERN');

  // Generate environment files
  await generateFullStackEnv(projectPath, config, 'MERN');

  // Generate README
  await generateFullStackReadme(projectPath, config, 'MERN');
}

/**
 * PERN Stack (PostgreSQL, Express, React, Node)
 */
async function generatePERNStack(projectPath, config) {
  // Create folder structure
  await fs.ensureDir(path.join(projectPath, 'client'));
  await fs.ensureDir(path.join(projectPath, 'server'));

  // Generate React frontend
  const clientConfig = {
    ...config,
    projectName: 'client',
    frontend: 'react',
    additionalLibraries: ['react-router', 'axios'],
  };
  await generateReactTemplate(path.join(projectPath, 'client'), clientConfig);

  // Generate Express backend with Prisma
  const serverConfig = {
    ...config,
    projectName: 'server',
    backend: 'express',
    database: 'prisma',
    folderStructure: 'layered',
  };
  await generateExpressTemplate(path.join(projectPath, 'server'), serverConfig);

  // Generate root package.json
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    await generateRootPackageJson(config, 'PERN')
  );

  // Generate Docker setup with PostgreSQL
  await generateDockerSetup(projectPath, config, 'PERN');

  // Generate API config
  await generateAPIConfig(projectPath, config, 'PERN');

  // Generate environment files
  await generateFullStackEnv(projectPath, config, 'PERN');

  // Generate README
  await generateFullStackReadme(projectPath, config, 'PERN');
}

/**
 * Next.js + Express Stack
 */
async function generateNextExpressStack(projectPath, config) {
  // Create folder structure
  await fs.ensureDir(path.join(projectPath, 'frontend'));
  await fs.ensureDir(path.join(projectPath, 'backend'));

  // Generate Next.js frontend
  const frontendConfig = {
    ...config,
    projectName: 'frontend',
    frontend: 'nextjs',
  };
  await generateNextjsTemplate(path.join(projectPath, 'frontend'), frontendConfig);

  // Generate Express backend
  const backendConfig = {
    ...config,
    projectName: 'backend',
    backend: 'express',
    database: config.database || 'prisma',
    folderStructure: 'clean-architecture',
  };
  await generateExpressTemplate(path.join(projectPath, 'backend'), backendConfig);

  // Generate root package.json
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    await generateRootPackageJson(config, 'Next.js + Express')
  );

  // Generate Docker setup
  await generateDockerSetup(projectPath, config, 'Next.js + Express');

  // Generate Next.js API proxy config
  await generateNextjsProxyConfig(path.join(projectPath, 'frontend'));

  // Generate environment files
  await generateFullStackEnv(projectPath, config, 'Next.js + Express');

  // Generate README
  await generateFullStackReadme(projectPath, config, 'Next.js + Express');
}

/**
 * Laravel + React Stack (Scaffolding only)
 */
async function generateLaravelReactStack(projectPath, config) {
  // Create folder structure
  await fs.ensureDir(path.join(projectPath, 'client'));

  // Generate React frontend
  const clientConfig = {
    ...config,
    projectName: 'client',
    frontend: 'react',
    additionalLibraries: ['react-router', 'axios'],
  };
  await generateReactTemplate(path.join(projectPath, 'client'), clientConfig);

  // Create Laravel backend placeholder
  await fs.ensureDir(path.join(projectPath, 'server'));
  await fs.writeFile(
    path.join(projectPath, 'server', 'README.md'),
    `# Laravel Backend

## Setup Instructions

1. Install Laravel:
\`\`\`bash
composer create-project laravel/laravel .
\`\`\`

2. Configure database in \`.env\`

3. Run migrations:
\`\`\`bash
php artisan migrate
\`\`\`

4. Start server:
\`\`\`bash
php artisan serve
\`\`\`

## API Routes

Add your API routes in \`routes/api.php\`
`
  );

  // Generate root README
  await fs.writeFile(path.join(projectPath, 'README.md'), generateLaravelReactReadme(config));
}

// ==================== Helper Functions ====================

async function generateMonorepoPackageJson(config) {
  const spinner = ora('Fetching latest package versions...').start();

  try {
    const turboVer = await fetchVersion('turbo');
    spinner.succeed(chalk.green('Fetched latest versions'));

    return JSON.stringify(
      {
        name: config.projectName || 'my-monorepo',
        version: '1.0.0',
        private: true,
        workspaces: ['apps/*', 'packages/*'],
        scripts: {
          dev: 'turbo run dev',
          build: 'turbo run build',
          lint: 'turbo run lint',
          clean: 'turbo run clean',
          'dev:frontend': 'turbo run dev --filter=frontend',
          'dev:backend': 'turbo run dev --filter=backend',
        },
        devDependencies: {
          turbo: turboVer,
        },
      },
      null,
      2
    );
  } catch (error) {
    spinner.fail(chalk.yellow('Could not fetch versions, using fallbacks'));
    return JSON.stringify(
      {
        name: config.projectName || 'my-monorepo',
        version: '1.0.0',
        private: true,
        workspaces: ['apps/*', 'packages/*'],
        scripts: {
          dev: 'turbo run dev',
          build: 'turbo run build',
          lint: 'turbo run lint',
          clean: 'turbo run clean',
          'dev:frontend': 'turbo run dev --filter=frontend',
          'dev:backend': 'turbo run dev --filter=backend',
        },
        devDependencies: { turbo: 'latest' },
      },
      null,
      2
    );
  }
}

function generateTurboConfig() {
  return JSON.stringify(
    {
      $schema: 'https://turbo.build/schema.json',
      pipeline: {
        build: {
          dependsOn: ['^build'],
          outputs: ['dist/**', '.next/**'],
        },
        dev: {
          cache: false,
          persistent: true,
        },
        lint: {},
        clean: {
          cache: false,
        },
      },
    },
    null,
    2
  );
}

async function generateSharedTypes(typesPath) {
  await fs.writeFile(
    path.join(typesPath, 'package.json'),
    JSON.stringify(
      {
        name: 'shared-types',
        version: '1.0.0',
        main: './src/index.ts',
        types: './src/index.ts',
      },
      null,
      2
    )
  );

  await fs.ensureDir(path.join(typesPath, 'src'));
  await fs.writeFile(
    path.join(typesPath, 'src', 'index.ts'),
    `// Shared TypeScript types and interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Add your shared types here
`
  );

  await fs.writeFile(
    path.join(typesPath, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'node',
          declaration: true,
          outDir: './dist',
          strict: true,
          esModuleInterop: true,
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist'],
      },
      null,
      2
    )
  );
}

async function generateUIComponents(uiPath, config) {
  const isNextjs = config.stack?.includes('Next.js');

  await fs.writeFile(
    path.join(uiPath, 'package.json'),
    JSON.stringify(
      {
        name: 'ui-components',
        version: '1.0.0',
        main: './src/index.ts',
        dependencies: {
          react: '^19.0.0',
          ...(isNextjs && { next: '^15.1.4' }),
        },
      },
      null,
      2
    )
  );

  await fs.ensureDir(path.join(uiPath, 'src'));
  await fs.writeFile(
    path.join(uiPath, 'src', 'Button.tsx'),
    `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={\`btn btn-\${variant}\`}
    >
      {children}
    </button>
  );
};
`
  );

  await fs.writeFile(
    path.join(uiPath, 'src', 'index.ts'),
    `export { Button } from './Button';
// Export more components here
`
  );
}

async function generateMonorepoRootFiles(projectPath, config) {
  // Root .gitignore
  await fs.writeFile(
    path.join(projectPath, '.gitignore'),
    `# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
.next/
build/

# Environment
.env
.env*.local

# Logs
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
`
  );

  // Root .env.example
  await fs.writeFile(
    path.join(projectPath, '.env.example'),
    `# Environment Configuration

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Backend
PORT=3001
NODE_ENV=development
DATABASE_URL=

# Add your environment variables here
`
  );
}

async function generateMonorepoDockerSetup(projectPath, config) {
  // Docker Compose for monorepo
  await fs.writeFile(
    path.join(projectPath, 'docker-compose.yml'),
    `version: '3.8'

services:
  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001/api
    depends_on:
      - backend
    volumes:
      - ./apps/frontend:/app
      - /app/node_modules

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
    volumes:
      - ./apps/backend:/app
      - /app/node_modules

  ${
    config.stack?.includes('MongoDB')
      ? `mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db`
      : ''
  }

  ${
    config.stack?.includes('PostgreSQL')
      ? `postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data`
      : ''
  }

${
  config.stack?.includes('MongoDB') || config.stack?.includes('PostgreSQL')
    ? `volumes:
  ${config.stack?.includes('MongoDB') ? 'mongo_data:' : ''}
  ${config.stack?.includes('PostgreSQL') ? 'postgres_data:' : ''}`
    : ''
}
`
  );
}

function generateMonorepoReadme(projectPath, config) {
  return fs.writeFile(
    path.join(projectPath, 'README.md'),
    `# ${config.projectName || 'My Monorepo'}

Full-stack monorepo with ${config.stack}

## 📁 Structure

\`\`\`
${config.projectName}/
├── apps/
│   ├── frontend/     # ${config.stack?.includes('Next.js') ? 'Next.js' : 'React'} application
│   └── backend/      # Express.js API
├── packages/
│   ├── shared-types/ # Shared TypeScript types
│   └── ui-components/# Shared UI components
├── package.json      # Root workspace config
└── turbo.json        # Turborepo configuration
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

\`\`\`bash
# Install dependencies
npm install

# Or with pnpm
pnpm install
\`\`\`

### Development

\`\`\`bash
# Run all apps
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend
\`\`\`

### Build

\`\`\`bash
npm run build
\`\`\`

## 🐳 Docker

\`\`\`bash
# Start all services
docker-compose up

# Build and start
docker-compose up --build
\`\`\`

## 📦 Packages

- **shared-types**: Common TypeScript interfaces
- **ui-components**: Reusable UI components

## 📝 License

MIT
`
  );
}

async function generateRootPackageJson(config, stackType) {
  const spinner = ora('Fetching latest package versions...').start();

  try {
    const concurrentlyVer = await fetchVersion('concurrently');
    spinner.succeed(chalk.green('Fetched latest versions'));

    const scripts = {
      dev: 'concurrently "npm run dev:client" "npm run dev:server"',
      'dev:client':
        stackType === 'Next.js + Express'
          ? 'cd frontend && npm run dev'
          : 'cd client && npm run dev',
      'dev:server':
        stackType === 'Next.js + Express'
          ? 'cd backend && npm run dev'
          : 'cd server && npm run dev',
      build: 'npm run build:client && npm run build:server',
      'build:client':
        stackType === 'Next.js + Express'
          ? 'cd frontend && npm run build'
          : 'cd client && npm run build',
      'build:server':
        stackType === 'Next.js + Express'
          ? 'cd backend && npm run build'
          : 'cd server && npm run build',
      'install:all':
        stackType === 'Next.js + Express'
          ? 'npm install && cd frontend && npm install && cd ../backend && npm install'
          : 'npm install && cd client && npm install && cd ../server && npm install',
    };

    return JSON.stringify(
      {
        name: config.projectName || 'my-fullstack-app',
        version: '1.0.0',
        description: `${stackType} full-stack application`,
        scripts,
        devDependencies: {
          concurrently: concurrentlyVer,
        },
      },
      null,
      2
    );
  } catch (error) {
    spinner.fail(chalk.yellow('Could not fetch versions, using fallbacks'));
    const scripts = {
      dev: 'concurrently "npm run dev:client" "npm run dev:server"',
      'dev:client':
        stackType === 'Next.js + Express'
          ? 'cd frontend && npm run dev'
          : 'cd client && npm run dev',
      'dev:server':
        stackType === 'Next.js + Express'
          ? 'cd backend && npm run dev'
          : 'cd server && npm run dev',
      build: 'npm run build:client && npm run build:server',
      'build:client':
        stackType === 'Next.js + Express'
          ? 'cd frontend && npm run build'
          : 'cd client && npm run build',
      'build:server':
        stackType === 'Next.js + Express'
          ? 'cd backend && npm run build'
          : 'cd server && npm run build',
      'install:all':
        stackType === 'Next.js + Express'
          ? 'npm install && cd frontend && npm install && cd ../backend && npm install'
          : 'npm install && cd client && npm install && cd ../server && npm install',
    };
    return JSON.stringify(
      {
        name: config.projectName || 'my-fullstack-app',
        version: '1.0.0',
        description: `${stackType} full-stack application`,
        scripts,
        devDependencies: { concurrently: 'latest' },
      },
      null,
      2
    );
  }
}

async function generateDockerSetup(projectPath, config, stackType) {
  const frontendDir = stackType === 'Next.js + Express' ? 'frontend' : 'client';
  const backendDir = stackType === 'Next.js + Express' ? 'backend' : 'server';

  // Docker Compose
  const dbService =
    stackType === 'MERN'
      ? `  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=mydb`
      : stackType === 'PERN' || stackType === 'Next.js + Express'
        ? `  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data`
        : '';

  await fs.writeFile(
    path.join(projectPath, 'docker-compose.yml'),
    `version: '3.8'

services:
  frontend:
    build:
      context: ./${frontendDir}
      dockerfile: Dockerfile
    ports:
      - "${stackType.includes('Next.js') ? '3000:3000' : '5173:5173'}"
    environment:
      - ${stackType.includes('Next.js') ? 'NEXT_PUBLIC_API_URL' : 'VITE_API_URL'}=http://backend:3001/api
    depends_on:
      - backend
    volumes:
      - ./${frontendDir}:/app
      - /app/node_modules

  backend:
    build:
      context: ./${backendDir}
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
      ${stackType === 'MERN' ? '- MONGODB_URI=mongodb://mongo:27017/mydb' : ''}
      ${stackType === 'PERN' || stackType === 'Next.js + Express' ? '- DATABASE_URL=postgresql://postgres:postgres@postgres:5432/mydb' : ''}
    depends_on:
      ${stackType !== 'MERN' && stackType !== 'PERN' && !stackType.includes('Next.js') ? '' : '- ' + (stackType === 'MERN' ? 'mongo' : 'postgres')}
    volumes:
      - ./${backendDir}:/app
      - /app/node_modules

${dbService}

${
  dbService
    ? `volumes:
  ${stackType === 'MERN' ? 'mongo_data:' : 'postgres_data:'}`
    : ''
}
`
  );

  // Frontend Dockerfile
  const frontendDockerfile = stackType.includes('Next.js')
    ? `FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]`
    : `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]`;

  await fs.writeFile(path.join(projectPath, frontendDir, 'Dockerfile'), frontendDockerfile);

  // Backend Dockerfile
  await fs.writeFile(
    path.join(projectPath, backendDir, 'Dockerfile'),
    `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
${config.language === 'typescript' ? 'RUN npm run build' : ''}
EXPOSE 3001
CMD ["npm", "start"]`
  );
}

async function generateAPIConfig(projectPath, config, stackType) {
  const frontendDir = stackType === 'Next.js + Express' ? 'frontend' : 'client';

  if (stackType.includes('Next.js')) {
    return; // Next.js uses rewrites in next.config.js
  }

  // Vite proxy config for React
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
`;

  await fs.writeFile(path.join(projectPath, frontendDir, 'vite.config.js'), viteConfig);

  // API client wrapper
  await fs.ensureDir(path.join(projectPath, frontendDir, 'src', 'lib'));
  await fs.writeFile(
    path.join(projectPath, frontendDir, 'src', 'lib', 'api.js'),
    `import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for auth tokens if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;
`
  );
}

async function generateNextjsProxyConfig(frontendPath) {
  // Add API rewrite to next.config.js
  const nextConfigPath = path.join(frontendPath, 'next.config.js');

  // Read existing config or create new one
  let configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

export default nextConfig;
`;

  await fs.writeFile(nextConfigPath, configContent);
}

async function generateFullStackEnv(projectPath, config, stackType) {
  const frontendDir = stackType === 'Next.js + Express' ? 'frontend' : 'client';
  const backendDir = stackType === 'Next.js + Express' ? 'backend' : 'server';

  // Root .env.example
  await fs.writeFile(
    path.join(projectPath, '.env.example'),
    `# Full Stack Environment Variables

# Frontend
${stackType.includes('Next.js') ? 'NEXT_PUBLIC_API_URL' : 'VITE_API_URL'}=http://localhost:3001/api

# Backend
PORT=3001
NODE_ENV=development
${stackType === 'MERN' ? 'MONGODB_URI=mongodb://localhost:27017/mydb' : ''}
${stackType === 'PERN' || stackType === 'Next.js + Express' ? 'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb' : ''}
`
  );
}

function generateFullStackReadme(projectPath, config, stackType) {
  const frontendDir = stackType === 'Next.js + Express' ? 'frontend' : 'client';
  const backendDir = stackType === 'Next.js + Express' ? 'backend' : 'server';

  const frontend = stackType.includes('Next.js') ? 'Next.js' : 'React';
  const backend = 'Express.js';
  const database =
    stackType === 'MERN' ? 'MongoDB' : stackType === 'PERN' ? 'PostgreSQL' : 'PostgreSQL';

  return fs.writeFile(
    path.join(projectPath, 'README.md'),
    `# ${config.projectName || 'Full Stack Application'}

${stackType} full-stack application

## 🛠️ Tech Stack

- **Frontend**: ${frontend}
- **Backend**: ${backend}
- **Database**: ${database}

## 📁 Project Structure

\`\`\`
${config.projectName}/
├── ${frontendDir}/        # Frontend application
├── ${backendDir}/         # Backend API
├── docker-compose.yml     # Docker setup
└── package.json           # Root scripts
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
${stackType === 'MERN' ? '- MongoDB' : ''}
${stackType === 'PERN' || stackType === 'Next.js + Express' ? '- PostgreSQL' : ''}

### Installation

\`\`\`bash
# Install all dependencies
npm run install:all
\`\`\`

### Environment Variables

Copy \`.env.example\` to \`.env\` in both frontend and backend directories and configure:

\`\`\`bash
cp .env.example .env
\`\`\`

### Development

\`\`\`bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:client   # Frontend only
npm run dev:server   # Backend only
\`\`\`

Frontend: http://localhost:${stackType.includes('Next.js') ? '3000' : '5173'}
Backend: http://localhost:3001

### Build

\`\`\`bash
npm run build
\`\`\`

## 🐳 Docker

\`\`\`bash
# Start all services with Docker
docker-compose up

# Build and start
docker-compose up --build

# Stop services
docker-compose down
\`\`\`

## 📡 API Integration

The frontend is configured to proxy API requests to the backend:
- **Endpoint**: \`/api/*\`
- **Target**: \`http://localhost:3001/api\`

## 📝 License

MIT
`
  );
}

function generateLaravelReactReadme(config) {
  return `# ${config.projectName || 'Laravel + React Application'}

Full-stack application with Laravel backend and React frontend

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Laravel
- **Database**: MySQL/PostgreSQL

## 📁 Project Structure

\`\`\`
${config.projectName}/
├── client/       # React frontend
└── server/       # Laravel backend
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PHP 8.1+
- Composer
- MySQL or PostgreSQL

### Backend Setup

\`\`\`bash
cd server

# Install Laravel
composer create-project laravel/laravel .

# Configure .env file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Start server
php artisan serve
\`\`\`

### Frontend Setup

\`\`\`bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Frontend: http://localhost:5173
Backend: http://localhost:8000

## 📡 API Integration

Configure API URL in \`client/.env\`:

\`\`\`
VITE_API_URL=http://localhost:8000/api
\`\`\`

## 📝 License

MIT
`;
}

export default generateFullStackTemplate;
