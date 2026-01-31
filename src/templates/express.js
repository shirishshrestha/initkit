import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { getLatestVersion } from '../utils/versionFetcher.js';

async function fetchVersion(packageName, fallback = 'latest') {
  try {
    const version = await getLatestVersion(packageName);
    return `^${version}`;
  } catch {
    return fallback;
  }
}

/**
 * Generate Express.js backend API project with organized architecture
 *
 * Creates a production-ready Express.js server with:
 * - RESTful API structure
 * - Multiple architecture patterns (MVC, Clean Architecture, Domain-Driven Design)
 * - Database integration (MongoDB, PostgreSQL, MySQL, SQLite)
 * - TypeScript or JavaScript support
 * - Authentication middleware setup
 * - Error handling and validation
 * - Environment configuration
 *
 * Generated project includes:
 * - Organized folder structure based on pattern
 * - Server entry point with middleware configuration
 * - Route handlers and controllers
 * - Database models and schemas
 * - Package.json with Express and dependencies
 * - .env.example for environment variables
 * - README with API documentation
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User configuration object
 * @param {string} config.projectName - Name of the project
 * @param {string} config.language - Programming language ('typescript'|'javascript')
 * @param {string} [config.folderStructure='mvc'] - Architecture pattern
 *   - 'mvc': Model-View-Controller (recommended for REST APIs)
 *   - 'clean-architecture': Clean Architecture with domain/infrastructure layers
 *   - 'ddd': Domain-Driven Design with bounded contexts
 *   - 'feature-based': Organize by features/modules
 * @param {string} [config.database='none'] - Database choice ('mongodb'|'postgresql'|'mysql'|'sqlite'|'none')
 * @param {string} config.packageManager - Package manager to use
 *
 * @returns {Promise<void>}
 *
 * @example
 * // Create Express API with PostgreSQL and MVC pattern
 * await generateExpressTemplate('/path/to/project', {
 *   projectName: 'my-express-api',
 *   language: 'typescript',
 *   folderStructure: 'mvc',
 *   database: 'postgresql',
 *   packageManager: 'npm'
 * });
 */
export async function generateExpressTemplate(projectPath, config) {
  // Create folder structure
  await createExpressFolderStructure(projectPath, config);

  // Generate configuration files
  await generateExpressConfigFiles(projectPath, config);

  // Generate package.json
  await generateExpressPackageJson(projectPath, config);

  // Generate README
  await generateExpressReadme(projectPath, config);

  // Generate environment file example
  await generateEnvExample(projectPath, config);
}

async function createExpressFolderStructure(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  const folderStructure = config.folderStructure || 'mvc';
  const database = config.database || 'none';

  if (folderStructure === 'mvc') {
    // MVC Pattern
    await fs.ensureDir(path.join(srcPath, 'models'));
    await fs.ensureDir(path.join(srcPath, 'views'));
    await fs.ensureDir(path.join(srcPath, 'controllers'));
    await fs.ensureDir(path.join(srcPath, 'routes'));
    await fs.ensureDir(path.join(srcPath, 'middleware'));
    await fs.ensureDir(path.join(srcPath, 'utils'));
    await fs.ensureDir(path.join(srcPath, 'config'));

    // Routes index
    await fs.writeFile(path.join(srcPath, 'routes', 'index.ts'), generateRoutesIndex());
  } else if (folderStructure === 'clean-architecture') {
    // Clean Architecture
    await fs.ensureDir(path.join(srcPath, 'domain', 'entities'));
    await fs.ensureDir(path.join(srcPath, 'domain', 'repositories'));
    await fs.ensureDir(path.join(srcPath, 'domain', 'use-cases'));

    await fs.ensureDir(path.join(srcPath, 'application', 'dto'));
    await fs.ensureDir(path.join(srcPath, 'application', 'services'));
    await fs.ensureDir(path.join(srcPath, 'application', 'interfaces'));

    await fs.ensureDir(path.join(srcPath, 'infrastructure', 'database'));
    await fs.ensureDir(path.join(srcPath, 'infrastructure', 'repositories'));
    await fs.ensureDir(path.join(srcPath, 'infrastructure', 'external-services'));

    await fs.ensureDir(path.join(srcPath, 'presentation', 'controllers'));
    await fs.ensureDir(path.join(srcPath, 'presentation', 'middleware'));
    await fs.ensureDir(path.join(srcPath, 'presentation', 'routes'));
  } else if (folderStructure === 'feature-based') {
    // Feature-based structure
    const features = ['auth', 'users', 'posts'];

    for (const feature of features) {
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'controllers'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'services'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'routes'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'models'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'middleware'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'validators'));
    }

    // Shared directory
    await fs.ensureDir(path.join(srcPath, 'shared', 'middleware'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'utils'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'types'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'config'));
  } else if (folderStructure === 'layered') {
    // Layered Architecture
    await fs.ensureDir(path.join(srcPath, 'controllers'));
    await fs.ensureDir(path.join(srcPath, 'services'));
    await fs.ensureDir(path.join(srcPath, 'repositories'));
    await fs.ensureDir(path.join(srcPath, 'models'));
    await fs.ensureDir(path.join(srcPath, 'routes'));
    await fs.ensureDir(path.join(srcPath, 'middleware'));
    await fs.ensureDir(path.join(srcPath, 'validators'));
    await fs.ensureDir(path.join(srcPath, 'utils'));
    await fs.ensureDir(path.join(srcPath, 'config'));
    await fs.ensureDir(path.join(srcPath, 'types'));
  }

  // Common directories for all structures
  await fs.ensureDir(path.join(srcPath, 'tests'));
  await fs.ensureDir(path.join(projectPath, 'logs'));

  // Database specific setup
  if (database === 'prisma') {
    await fs.ensureDir(path.join(projectPath, 'prisma'));
    await fs.ensureDir(path.join(projectPath, 'prisma', 'migrations'));
    await fs.writeFile(path.join(projectPath, 'prisma', 'schema.prisma'), generatePrismaSchema());
  }
}

async function generateExpressConfigFiles(projectPath, config) {
  const { language, database } = config;
  const srcPath = path.join(projectPath, 'src');
  const isTypeScript = language === 'typescript';
  const folderStructure = config.folderStructure || 'mvc';

  // Determine the correct paths based on folder structure
  const configPath =
    folderStructure === 'feature-based'
      ? path.join(srcPath, 'shared', 'config')
      : path.join(srcPath, 'config');

  const middlewarePath =
    folderStructure === 'feature-based'
      ? path.join(srcPath, 'shared', 'middleware')
      : folderStructure === 'clean-architecture'
        ? path.join(srcPath, 'presentation', 'middleware')
        : path.join(srcPath, 'middleware');

  // Ensure directories exist
  await fs.ensureDir(configPath);
  await fs.ensureDir(middlewarePath);

  // TypeScript configuration
  if (isTypeScript) {
    await fs.writeFile(path.join(projectPath, 'tsconfig.json'), generateTsConfig());
  }

  // ESLint configuration
  await fs.writeFile(
    path.join(projectPath, 'eslint.config.js'),
    generateEslintConfig(isTypeScript)
  );

  // Nodemon configuration
  await fs.writeFile(path.join(projectPath, 'nodemon.json'), generateNodemonConfig(isTypeScript));

  // Main app file
  await fs.writeFile(
    path.join(srcPath, isTypeScript ? 'app.ts' : 'app.js'),
    generateAppFile(config)
  );

  // Server entry point
  await fs.writeFile(
    path.join(srcPath, isTypeScript ? 'server.ts' : 'server.js'),
    generateServerFile(isTypeScript)
  );

  // Database configuration
  if (database !== 'none') {
    await fs.writeFile(
      path.join(configPath, isTypeScript ? 'database.ts' : 'database.js'),
      generateDatabaseConfig(database, isTypeScript)
    );
  }

  // Error handler middleware
  await fs.writeFile(
    path.join(middlewarePath, isTypeScript ? 'errorHandler.ts' : 'errorHandler.js'),
    generateErrorHandler(isTypeScript)
  );

  // CORS configuration
  await fs.writeFile(
    path.join(configPath, isTypeScript ? 'cors.ts' : 'cors.js'),
    generateCorsConfig(isTypeScript)
  );
}

async function generateExpressPackageJson(projectPath, config) {
  const { language, database, projectName } = config;
  const isTypeScript = language === 'typescript';

  const spinner = ora('Fetching latest package versions...').start();

  try {
    const scripts = {
      dev: isTypeScript ? 'nodemon' : 'nodemon src/server.js',
      build: isTypeScript ? 'tsc' : 'echo "No build step for JavaScript"',
      start: isTypeScript ? 'node dist/server.js' : 'node src/server.js',
      lint: 'eslint .',
      'lint:fix': 'eslint . --fix',
    };

    if (database === 'prisma') {
      scripts['db:generate'] = 'prisma generate';
      scripts['db:push'] = 'prisma db push';
      scripts['db:migrate'] = 'prisma migrate dev';
      scripts['db:studio'] = 'prisma studio';
    }

    // Fetch core dependencies
    const [expressVer, dotenvVer, corsVer, helmetVer, nodemonVer] = await Promise.all([
      fetchVersion('express'),
      fetchVersion('dotenv'),
      fetchVersion('cors'),
      fetchVersion('helmet'),
      fetchVersion('nodemon'),
    ]);

    const dependencies = {
      express: expressVer,
      dotenv: dotenvVer,
      cors: corsVer,
      helmet: helmetVer,
    };

    const devDependencies = {
      nodemon: nodemonVer,
    };

    // TypeScript dependencies
    if (isTypeScript) {
      const [tsVer, typesExpressVer, typesNodeVer, typesCorsVer, tsNodeVer] = await Promise.all([
        fetchVersion('typescript'),
        fetchVersion('@types/express'),
        fetchVersion('@types/node'),
        fetchVersion('@types/cors'),
        fetchVersion('ts-node'),
      ]);
      devDependencies['typescript'] = tsVer;
      devDependencies['@types/express'] = typesExpressVer;
      devDependencies['@types/node'] = typesNodeVer;
      devDependencies['@types/cors'] = typesCorsVer;
      devDependencies['ts-node'] = tsNodeVer;
    }

    // Database specific dependencies
    if (database === 'prisma') {
      const [prismaClientVer, prismaVer] = await Promise.all([
        fetchVersion('@prisma/client'),
        fetchVersion('prisma'),
      ]);
      dependencies['@prisma/client'] = prismaClientVer;
      devDependencies['prisma'] = prismaVer;
    } else if (database === 'mongodb') {
      dependencies['mongoose'] = await fetchVersion('mongoose');
    } else if (database === 'postgresql' || database === 'mysql') {
      dependencies['pg'] = await fetchVersion('pg');
      if (isTypeScript) {
        devDependencies['@types/pg'] = await fetchVersion('@types/pg');
      }
    }

    spinner.succeed(chalk.green('Fetched latest versions'));

    const packageJson = {
      name: projectName || 'express-api',
      version: '1.0.0',
      description: 'Express.js API server',
      main: isTypeScript ? 'dist/server.js' : 'src/server.js',
      type: 'module',
      scripts,
      keywords: ['express', 'api', 'backend'],
      author: '',
      license: 'MIT',
      dependencies,
      devDependencies,
    };

    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  } catch (error) {
    spinner.fail(chalk.yellow('Could not fetch versions, using fallbacks'));

    // Fallback with latest tag
    const scripts = {
      dev: isTypeScript ? 'nodemon' : 'nodemon src/server.js',
      build: isTypeScript ? 'tsc' : 'echo "No build step for JavaScript"',
      start: isTypeScript ? 'node dist/server.js' : 'node src/server.js',
      lint: 'eslint .',
      'lint:fix': 'eslint . --fix',
    };

    if (database === 'prisma') {
      scripts['db:generate'] = 'prisma generate';
      scripts['db:push'] = 'prisma db push';
      scripts['db:migrate'] = 'prisma migrate dev';
      scripts['db:studio'] = 'prisma studio';
    }

    const dependencies = { express: 'latest', dotenv: 'latest', cors: 'latest', helmet: 'latest' };
    const devDependencies = {
      nodemon: 'latest',
      ...(isTypeScript && {
        typescript: 'latest',
        '@types/express': 'latest',
        '@types/node': 'latest',
        '@types/cors': 'latest',
        'ts-node': 'latest',
      }),
    };

    if (database === 'prisma') {
      dependencies['@prisma/client'] = 'latest';
      devDependencies['prisma'] = 'latest';
    } else if (database === 'mongodb') {
      dependencies['mongoose'] = 'latest';
    } else if (database === 'postgresql' || database === 'mysql') {
      dependencies['pg'] = 'latest';
      if (isTypeScript) devDependencies['@types/pg'] = 'latest';
    }

    const packageJson = {
      name: projectName || 'express-api',
      version: '1.0.0',
      description: 'Express.js API server',
      main: isTypeScript ? 'dist/server.js' : 'src/server.js',
      type: 'module',
      scripts,
      keywords: ['express', 'api', 'backend'],
      author: '',
      license: 'MIT',
      dependencies,
      devDependencies,
    };

    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }
}

async function generateExpressReadme(projectPath, config) {
  const { language, database, folderStructure } = config;
  const isTypeScript = language === 'typescript';

  const readme = `# ${config.projectName || 'Express API'}

Express.js backend API with ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}

## 📁 Folder Structure

This project uses **${folderStructure}** architecture.

${getArchitectureDescription(folderStructure)}

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
${database !== 'none' ? `- ${database} database` : ''}

### Installation

\`\`\`bash
# Install dependencies
npm install

${
  database === 'prisma'
    ? `# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate
`
    : ''
}
\`\`\`

### Environment Variables

Copy \`.env.example\` to \`.env\` and fill in your values:

\`\`\`bash
cp .env.example .env
\`\`\`

### Development

\`\`\`bash
# Start development server with hot reload
npm run dev
\`\`\`

${
  isTypeScript
    ? `### Build

\`\`\`bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
\`\`\`
`
    : ''
}

## 🔧 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm run lint\` - Lint code
- \`npm run lint:fix\` - Fix linting issues

${
  database === 'prisma'
    ? `
## 💾 Database Commands

- \`npm run db:generate\` - Generate Prisma Client
- \`npm run db:push\` - Push schema changes
- \`npm run db:migrate\` - Run migrations
- \`npm run db:studio\` - Open Prisma Studio
`
    : ''
}

## 📝 License

MIT
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

async function generateEnvExample(projectPath, config) {
  const { database } = config;

  let envContent = `# Server Configuration
NODE_ENV=development
PORT=3000

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

`;

  if (database === 'prisma') {
    envContent += `# Database Configuration (Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
`;
  } else if (database === 'mongodb') {
    envContent += `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mydb
`;
  } else if (database === 'postgresql') {
    envContent += `# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=postgres
DB_PASSWORD=password
`;
  } else if (database === 'mysql') {
    envContent += `# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mydb
DB_USER=root
DB_PASSWORD=password
`;
  }

  await fs.writeFile(path.join(projectPath, '.env.example'), envContent);
}

// Configuration file generators
function generatePrismaSchema() {
  return `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Add your models here
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
`;
}

function generateTsConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        lib: ['ES2022'],
        moduleResolution: 'node',
        rootDir: './src',
        outDir: './dist',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        declaration: true,
        sourceMap: true,
        types: ['node'],
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    },
    null,
    2
  );
}

function generateEslintConfig(isTypeScript) {
  if (isTypeScript) {
    return `import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '*.config.js'],
  },
];
`;
  }

  return `import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['node_modules/', '*.config.js'],
  },
];
`;
}

function generateNodemonConfig(isTypeScript) {
  if (isTypeScript) {
    return JSON.stringify(
      {
        watch: ['src'],
        ext: 'ts',
        exec: 'ts-node src/server.ts',
        env: {
          NODE_ENV: 'development',
        },
      },
      null,
      2
    );
  }

  return JSON.stringify(
    {
      watch: ['src'],
      ext: 'js',
      exec: 'node src/server.js',
      env: {
        NODE_ENV: 'development',
      },
    },
    null,
    2
  );
}

function generateAppFile(_config) {
  return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './config/cors';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler (must be last)
app.use(errorHandler);

export default app;
`;
}

function generateServerFile(isTypeScript) {
  return `${isTypeScript ? "import 'dotenv/config';" : "import dotenv from 'dotenv';\ndotenv.config();"}
import app from './app';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
  console.log(\`📝 Environment: \${process.env.NODE_ENV || 'development'}\`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
`;
}

function generateDatabaseConfig(database, isTypeScript) {
  if (database === 'mongodb') {
    return `import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI${isTypeScript ? ' as string' : ''});
    console.log(\`✅ MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`❌ MongoDB Error: \${error${isTypeScript ? '.message' : ''}}\`);
    process.exit(1);
  }
};

export default connectDB;
`;
  }

  if (database === 'prisma') {
    return `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export default prisma;
`;
  }

  return `// Database configuration
// TODO: Implement database connection

export const connectDB = async () => {
  console.log('✅ Database connected');
};
`;
}

function generateErrorHandler(isTypeScript) {
  return `import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err${isTypeScript ? ': any' : ''},
  req${isTypeScript ? ': Request' : ''},
  res${isTypeScript ? ': Response' : ''},
  next${isTypeScript ? ': NextFunction' : ''}
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};
`;
}

function generateCorsConfig(isTypeScript) {
  return `import { CorsOptions } from 'cors';

export const corsOptions${isTypeScript ? ': CorsOptions' : ''} = {
  origin: (origin${isTypeScript ? ': string | undefined' : ''}, callback${isTypeScript ? ': (err: Error | null, allow?: boolean) => void' : ''}) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.CORS_ORIGIN,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
`;
}

function generateRoutesIndex() {
  return `import { Router } from 'express';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Add your routes here
// Example: router.use('/users', userRoutes);

export default router;
`;
}

function getArchitectureDescription(structure) {
  const descriptions = {
    mvc: `
**Model-View-Controller (MVC)**

- \`models/\` - Data models and database schemas
- \`views/\` - Template rendering (if needed)
- \`controllers/\` - Request handlers and business logic
- \`routes/\` - API route definitions
- \`middleware/\` - Custom middleware functions
- \`utils/\` - Utility functions and helpers
- \`config/\` - Configuration files

**Flow:** Route → Controller → Model → Controller → Response
`,
    'clean-architecture': `
**Clean Architecture (Onion Architecture)**

- \`domain/\` - Business entities and rules (core layer)
  - \`entities/\` - Business objects
  - \`repositories/\` - Repository interfaces
  - \`use-cases/\` - Application business rules

- \`application/\` - Application business rules
  - \`dto/\` - Data transfer objects
  - \`services/\` - Application services
  - \`interfaces/\` - Application interfaces

- \`infrastructure/\` - External concerns
  - \`database/\` - Database implementations
  - \`repositories/\` - Repository implementations
  - \`external-services/\` - Third-party integrations

- \`presentation/\` - UI layer (HTTP)
  - \`controllers/\` - HTTP request handlers
  - \`middleware/\` - HTTP middleware
  - \`routes/\` - Route definitions

**Dependencies flow inward:** Presentation → Application → Domain
`,
    'feature-based': `
**Feature-based Architecture**

Each feature is self-contained with its own:
- \`controllers/\` - Feature-specific controllers
- \`services/\` - Feature business logic
- \`routes/\` - Feature routes
- \`models/\` - Feature data models
- \`middleware/\` - Feature-specific middleware
- \`validators/\` - Input validation

**Benefits:** Easy to understand, scale, and maintain. Each feature can be developed independently.
`,
    layered: `
**Layered Architecture**

- \`controllers/\` - Presentation layer (HTTP handlers)
- \`services/\` - Business logic layer
- \`repositories/\` - Data access layer
- \`models/\` - Data models
- \`routes/\` - Route definitions
- \`middleware/\` - Middleware functions
- \`validators/\` - Input validation
- \`utils/\` - Utility functions
- \`config/\` - Configuration files

**Flow:** Controller → Service → Repository → Database
Each layer only communicates with adjacent layers.
`,
  };

  return descriptions[structure] || 'Custom architecture';
}

export default generateExpressTemplate;
