# 💡 Examples & Use Cases

> **User Documentation** | Real-world examples and practical use cases for every scenario

## 📋 Table of Contents

- [Quick Start Examples](#quick-start-examples)
- [Frontend Projects](#frontend-projects)
- [Backend Projects](#backend-projects)
- [Full Stack Projects](#full-stack-projects)
- [Library Projects](#library-projects)
- [Advanced Usage](#advanced-usage)
- [CI/CD Integration](#cicd-integration)
- [Scripting Examples](#scripting-examples)
- [Real-World Scenarios](#real-world-scenarios)
- [Pro Tips](#pro-tips)

---

## ⚡ Quick Start Examples ### 1. Interactive Mode (Recommended for First-Time Users) ```bash
initkit
``` Follow the prompts to configure your project step by step. ### 2. Quick Project with Defaults ```bash
initkit create my-project --yes
``` Creates a full-stack project with:
- React frontend
- Express backend
- TypeScript
- npm
- ESLint, Prettier, dotenv ### 3. Named Project with Prompts ```bash
initkit create awesome-app
``` Skips the project name question, but shows all other prompts.

## 🎨 Frontend Projects ### React App with TypeScript and Tailwind ```bash
initkit create my-react-app
``` **Selections:**
- Project Type: Frontend Only
- Framework: React
- Language: TypeScript
- Strictness: Strict
- Folder Structure: Feature-based
- Styling: Tailwind CSS
- Features: ESLint, Prettier, Jest
- Package Manager: npm ### Vue 3 App with Composition API ```bash
initkit create vue-app
``` **Selections:**
- Project Type: Frontend Only
- Framework: Vue.js
- Language: TypeScript
- Styling: CSS Modules
- Additional Libraries: Axios, Zustand
- Features: ESLint, Prettier, Vitest ### Next.js with TypeScript ```bash
initkit create nextjs-app
``` **Selections:**
- Project Type: Frontend Only
- Framework: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Additional Libraries: React Query, Zod
- Features: ESLint, Prettier, EditorConfig ### Simple Vanilla JavaScript Site ```bash
initkit create vanilla-site --javascript
``` **Selections:**
- Project Type: Frontend Only
- Framework: Vanilla JavaScript
- Language: JavaScript
- Folder Structure: Flat
- Styling: Plain CSS

## ⚙️ Backend Projects ### Express API with PostgreSQL ```bash
initkit create express-api
``` **Selections:**
- Project Type: Backend Only
- Framework: Express.js
- Database: PostgreSQL
- Language: TypeScript
- Additional Libraries: Prisma, JWT, Bcrypt
- Features: ESLint, Prettier, Jest, Docker ### Fastify Microservice ```bash
initkit create fastify-service
``` **Selections:**
- Project Type: Backend Only
- Framework: Fastify
- Database: None
- Language: TypeScript
- Strictness: Strict
- Additional Libraries: Zod, Winston
- Features: ESLint, Prettier, Docker, GitHub Actions ### NestJS Application ```bash
initkit create nestjs-app
``` **Selections:**
- Project Type: Backend Only
- Framework: NestJS
- Database: PostgreSQL
- Language: TypeScript
- Additional Libraries: Prisma, JWT
- Features: ESLint, Prettier, Jest ### REST API with MongoDB ```bash
initkit create mongo-api
``` **Selections:**
- Project Type: Backend Only
- Framework: Express.js
- Database: MongoDB
- Language: TypeScript
- Additional Libraries: Lodash, Winston
- Features: ESLint, Prettier, dotenv

## 🔥 Full Stack Projects ### MERN Stack Application ```bash
initkit create mern-app
``` **Selections:**
- Project Type: Full Stack
- Frontend: React
- Backend: Express.js
- Database: MongoDB
- Language: TypeScript
- Folder Structure: Feature-based
- Styling: Styled Components
- Additional Libraries: React Query, Axios, JWT, Bcrypt
- Features: ESLint, Prettier, Jest, Docker ### PERN Stack with Next.js ```bash
initkit create pern-app
``` **Selections:**
- Project Type: Full Stack
- Frontend: Next.js
- Backend: Express.js
- Database: PostgreSQL
- Language: TypeScript
- Styling: Tailwind CSS
- Additional Libraries: Prisma, React Query, Zod
- Features: ESLint, Prettier, GitHub Actions ### Vue + Fastify ```bash
initkit create vue-fastify-app
``` **Selections:**
- Project Type: Full Stack
- Frontend: Vue.js
- Backend: Fastify
- Database: PostgreSQL
- Language: TypeScript
- Styling: Tailwind CSS
- Features: All development tools

## 📦 Library Projects ### NPM Package ```bash
initkit create my-package
``` **Selections:**
- Project Type: Node.js Library/Package
- Language: TypeScript
- Strictness: Strict
- Additional Libraries: Lodash, Date-fns
- Features: ESLint, Prettier, Jest, GitHub Actions ### TypeScript Library ```bash
initkit create ts-lib --typescript
``` **Selections:**
- Project Type: Library
- Language: TypeScript
- Features: ESLint, Prettier, Jest, EditorConfig ### Utility Library ```bash
initkit create utils-lib
``` **Selections:**
- Project Type: Library
- Language: JavaScript
- Features: ESLint, Prettier, Jest

## 🚀 Advanced Usage ### Custom Package Manager ```bash
# Use yarn
initkit create my-app --package-manager yarn # Use pnpm
initkit create my-app --package-manager pnpm
``` ### Skip Git Initialization ```bash
initkit create my-app --no-git
``` Useful when:
- Adding to existing repository
- Using different VCS
- Initializing Git manually later ### Skip Dependency Installation ```bash
initkit create my-app --no-install
``` Useful when:
- Want to review package.json first
- Installing with different registry
- Offline development ### Verbose Mode for Debugging ```bash
initkit create my-app --verbose
``` Shows:
- Detailed operation logs
- Command execution
- File creation details
- Error stack traces ### Combine Multiple Options ```bash
initkit create my-app \ --javascript \ --no-git \ --package-manager pnpm \ --verbose
``` ### Non-Interactive with Defaults ```bash
initkit create quick-test --yes --no-install
``` Perfect for:
- Quick prototyping
- Testing
- CI/CD environments
- Scripts

## 🔄 CI/CD Integration ### GitHub Actions Workflow Create `.github/workflows/init-project.yml`: ```yaml
name: Initialize Project on: workflow_dispatch: inputs: project_name: description: 'Project name' required: true project_type: description: 'Project type' required: true type: choice options: - frontend - backend - fullstack jobs: create-project: runs-on: ubuntu-latest steps: - name: Install InitKit run: npm install -g initkit - name: Create Project run: | initkit create ${{ github.event.inputs.project_name }} \ --yes \ --no-install - name: Commit and Push run: | cd ${{ github.event.inputs.project_name }} git init git add . git commit -m "Initial commit" git push
``` ### GitLab CI Create `.gitlab-ci.yml`: ```yaml
stages: - init initialize_project: stage: init image: node:18 script: - npm install -g initkit - initkit create $PROJECT_NAME --yes --no-install artifacts: paths: - $PROJECT_NAME/
``` ### Jenkins Pipeline ```groovy
pipeline { agent any parameters { string(name: 'PROJECT_NAME', defaultValue: 'my-project') choice(name: 'PROJECT_TYPE', choices: ['frontend', 'backend', 'fullstack']) } stages { stage('Install InitKit') { steps { sh 'npm install -g initkit' } } stage('Create Project') { steps { sh """ initkit create ${params.PROJECT_NAME} \ --yes \ --no-install """ } } }
}
``` ### Docker Container ```dockerfile
FROM node:18 # Install InitKit
RUN npm install -g initkit # Set working directory
WORKDIR /app # Create project on container start
CMD ["initkit", "create", "my-app", "--yes"]
``` Run:
```bash
docker build -t initkit-container .
docker run -v $(pwd):/app initkit-container
```

## 📜 Scripting Examples ### Bash Script for Batch Creation ```bash
#!/bin/bash # create-projects.sh
# Create multiple projects at once projects=( "frontend-app:frontend:react" "backend-api:backend:express" "admin-dashboard:fullstack:vue"
) for project in "${projects[@]}"; do IFS=':' read -r name type framework <<< "$project" echo "Creating $name ($type - $framework)..." initkit create "$name" --yes --no-install echo "✓ $name created"
done echo "All projects created!"
``` ### Node.js Script ```javascript
import { createProject } from 'initkit';
import { promisify } from 'util';
import { exec } from 'child_process'; const execAsync = promisify(exec); async function createMultipleProjects() { const projects = [ { name: 'web-app', type: 'frontend', framework: 'react' }, { name: 'api-server', type: 'backend', framework: 'express' } ]; for (const project of projects) { console.log(`Creating ${project.name}...`); await createProject({ projectName: project.name, projectType: project.type, frontend: project.framework, language: 'typescript', packageManager: 'npm', useGit: true, installDependencies: false, features: ['eslint', 'prettier'] }); console.log(`✓ ${project.name} created`); }
} createMultipleProjects().catch(console.error);
``` ### Python Script Wrapper ```python
#!/usr/bin/env python3
import subprocess
import sys def create_project(name, options=None): """Create project using InitKit CLI""" cmd = ['initkit', 'create', name] if options: cmd.extend(options) try: result = subprocess.run(cmd, check=True, capture_output=True, text=True) print(f"✓ Created {name}") return True except subprocess.CalledProcessError as e: print(f"✗ Failed to create {name}: {e.stderr}") return False if __name__ == '__main__': projects = [ ('frontend-app', ['--yes', '--javascript']), ('backend-api', ['--yes', '--typescript']), ] for name, opts in projects: create_project(name, opts)
```

## 🌍 Real-World Scenarios ### Scenario 1: Startup MVP **Goal:** Create a modern full-stack app quickly ```bash
initkit create startup-mvp
``` **Selections:**
- Full Stack
- Next.js + Express.js
- PostgreSQL
- TypeScript (Strict)
- Tailwind CSS
- All dev tools + Docker + CI/CD **Result:** Production-ready setup in minutes ### Scenario 2: Microservices Architecture Create multiple services: ```bash
# API Gateway
initkit create api-gateway
# Select: Backend, Express, TypeScript # User Service
initkit create user-service
# Select: Backend, Fastify, PostgreSQL # Product Service
initkit create product-service
# Select: Backend, NestJS, MongoDB
``` ### Scenario 3: Learning Project **Goal:** Learn React with best practices ```bash
initkit create learning-react --verbose
``` **Selections:**
- Frontend Only
- React
- TypeScript (Moderate strictness)
- Feature-based structure
- Tailwind CSS
- Jest + React Query **Result:** Well-structured learning environment ### Scenario 4: Open Source Library ```bash
initkit create awesome-lib --typescript
``` **Selections:**
- Library
- TypeScript (Strict)
- Jest + ESLint + Prettier
- GitHub Actions
- EditorConfig **Result:** Publishing-ready npm package

## 💎 Pro Tips ### 1. Template Quick Creation Save time with template flag:
```bash
initkit create my-app --template react --yes
``` ### 2. Consistent Team Setup Create a script for team:
```bash
#!/bin/bash
initkit create "$1" \ --typescript \ --package-manager pnpm \ --verbose
``` ### 3. Testing Different Configurations ```bash
# Test without installing
initkit create test-app --no-install --no-git
``` ### 4. Project Documentation Always check generated README:
```bash
initkit create my-app
cd my-app
cat README.md
``` ### 5. Review Before Install ```bash
# Create without install
initkit create my-app --no-install # Review package.json
cd my-app
cat package.json # Install when ready
npm install
``` --- **Next Steps:**
- [User Guide](./user-guide.md)
- [API Reference](./api-reference.md)
- [Architecture](./architecture.md)