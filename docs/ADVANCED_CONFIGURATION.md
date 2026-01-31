# Advanced Configuration Guide

Master advanced InitKit features and customization options.

## Table of Contents

- [Custom Template Creation](#custom-template-creation)
- [Configuration Files](#configuration-files)
- [Environment Variables](#environment-variables)
- [Monorepo Setup](#monorepo-setup)
- [Docker Configuration](#docker-configuration)
- [CI/CD Pipelines](#cicd-pipelines)
- [TypeScript Configuration](#typescript-configuration)
- [Database Setup](#database-setup)
- [API Integration](#api-integration)
- [Testing Setup](#testing-setup)
- [Performance Optimization](#performance-optimization)

## Custom Template Creation

### Creating a Custom Framework Template

If you need a framework not included in InitKit, you can create your own template generator.

#### 1. Create Template File

Create a new file in `src/templates/`:

```javascript
// src/templates/my-framework.js
import fs from 'fs-extra';
import path from 'path';

/**
 * Generate project structure for My Framework
 * @param {string} projectPath - Target directory
 * @param {Object} config - Project configuration
 */
export async function generateMyFrameworkTemplate(projectPath, config) {
  // Create directory structure
  const directories = [
    'src/components',
    'src/lib',
    'src/styles',
    'public',
  ];

  for (const dir of directories) {
    await fs.ensureDir(path.join(projectPath, dir));
  }

  // Generate main file
  const mainContent = generateMainFile(config);
  await fs.writeFile(
    path.join(projectPath, 'src', 'main.js'),
    mainContent
  );

  // Generate package.json
  const packageJson = {
    name: config.projectName,
    version: '1.0.0',
    description: 'My Framework application',
    scripts: {
      dev: 'my-framework dev',
      build: 'my-framework build',
      start: 'my-framework start',
    },
    dependencies: {
      'my-framework': '^1.0.0',
    },
    devDependencies: {
      '@types/my-framework': '^1.0.0',
    },
  };

  await fs.writeJSON(
    path.join(projectPath, 'package.json'),
    packageJson,
    { spaces: 2 }
  );

  // Generate configuration files
  await generateConfigFiles(projectPath, config);
}

function generateMainFile(config) {
  return `import { createApp } from 'my-framework';

const app = createApp({
  name: '${config.projectName}',
  // ... configuration
});

app.start();
`;
}

async function generateConfigFiles(projectPath, config) {
  // Generate framework-specific config
  const frameworkConfig = {
    // Your config options
  };

  await fs.writeJSON(
    path.join(projectPath, 'my-framework.config.js'),
    frameworkConfig,
    { spaces: 2 }
  );
}
```

#### 2. Register Template

Update `src/utils/templateGenerator.js`:

```javascript
import { generateMyFrameworkTemplate } from '../templates/my-framework.js';

async function generateFrontendFiles(projectPath, config) {
  switch (config.frontend) {
    case 'my-framework':
      await generateMyFrameworkTemplate(projectPath, config);
      break;
    // ... other cases
  }
}
```

#### 3. Add to Prompts

Update `src/prompts/questions.js`:

```javascript
{
  type: 'list',
  name: 'frontend',
  message: 'Which frontend framework?',
  choices: [
    { name: 'My Framework', value: 'my-framework' },
    // ... other choices
  ],
  when: (answers) => answers.projectType === 'frontend',
}
```

## Configuration Files

### TypeScript Configuration

#### Strict Mode (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### Moderate Mode

Remove strict flags:
```json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false,
    // ... other options
  }
}
```

### ESLint Configuration

#### React + TypeScript (.eslintrc.cjs)

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', '@typescript-eslint', 'jsx-a11y'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
    }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### Prettier Configuration

#### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Vite Configuration

#### Advanced vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
```

## Environment Variables

### Frontend (.env)

```bash
# API Configuration
VITE_API_URL=http://localhost:4000
VITE_API_TIMEOUT=5000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false

# External Services
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Backend (.env)

```bash
# Server
NODE_ENV=development
PORT=4000
HOST=localhost

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=postgres
DB_PASSWORD=password

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# External Services
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=my-bucket
```

### Environment-Specific Files

```
.env                  # Default variables
.env.local           # Local overrides (not committed)
.env.development     # Development settings
.env.production      # Production settings
.env.test            # Test settings
```

## Monorepo Setup

### Turborepo Configuration

#### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

### Workspace Package.json

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  }
}
```

### Shared Package Setup

#### packages/shared-types/package.json

```json
{
  "name": "@myapp/shared-types",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

#### packages/shared-types/src/index.ts

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};
```

## Docker Configuration

### Multi-Stage Dockerfile

#### Frontend (Next.js)

```dockerfile
# Base stage
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]
```

#### Backend (Express)

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

EXPOSE 4000

CMD ["node", "dist/index.js"]
```

### Docker Compose

#### Complete Stack

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/mydb
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

## CI/CD Pipelines

### GitHub Actions

#### .github/workflows/ci.yml

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to production
        run: |
          # Your deployment script
          echo "Deploying to production..."
```

## Database Setup

### Prisma Configuration

#### prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

#### Running Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

## API Integration

### Frontend API Client

#### src/lib/api.ts

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Backend API Routes

#### src/routes/api.ts

```typescript
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);

// Protected routes
router.use(authenticate);
router.get('/users/me', userController.getProfile);
router.put('/users/me', userController.updateProfile);

export default router;
```

## Testing Setup

### Jest Configuration

Already configured in InitKit! See `jest.config.js`.

### Writing Tests

#### Component Test (React)

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Performance Optimization

### Code Splitting (React)

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Bundle Analysis

```bash
# Vite
npm run build -- --mode analyze

# Next.js (add to next.config.js)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... config
});

# Run analysis
ANALYZE=true npm run build
```

## Learn More

- [User Guide](./user-guide.md) - Complete usage documentation
- [Architecture](./architecture.md) - Technical architecture
- [Examples](./examples.md) - Real-world examples
- [Contributing](../CONTRIBUTING.md) - Contribute to InitKit

Need help? [Open an issue](https://github.com/shirishshrestha/initkit/issues) or start a [discussion](https://github.com/shirishshrestha/initkit/discussions).
