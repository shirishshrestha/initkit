import fs from 'fs-extra';
import path from 'path';

/**
 * Generate Express.js backend project structure
 * Creates organized folder structure with configuration files
 */
export async function generateExpressTemplate(projectPath, config) {
  // Create folder structure
  await createExpressFolderStructure(projectPath, config);

  // Generate configuration files
  await generateExpressConfigFiles(projectPath, config);

  // Generate middleware and utilities
  await generateMiddlewareAndUtilities(projectPath, config);

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

    // Example controller
    await fs.writeFile(
      path.join(srcPath, 'controllers', 'userController.ts'),
      generateUserController()
    );

    // Example model
    if (database !== 'none') {
      await fs.writeFile(
        path.join(srcPath, 'models', 'User.ts'),
        generateUserModel(database)
      );
    }

    // Example routes
    await fs.writeFile(
      path.join(srcPath, 'routes', 'userRoutes.ts'),
      generateUserRoutes()
    );

    await fs.writeFile(
      path.join(srcPath, 'routes', 'index.ts'),
      generateRoutesIndex()
    );

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

    // Example files for clean architecture
    await fs.writeFile(
      path.join(srcPath, 'domain', 'entities', 'User.ts'),
      generateCleanArchitectureUserEntity()
    );

    await fs.writeFile(
      path.join(srcPath, 'domain', 'repositories', 'IUserRepository.ts'),
      generateUserRepositoryInterface()
    );

    await fs.writeFile(
      path.join(srcPath, 'presentation', 'controllers', 'UserController.ts'),
      generateCleanArchitectureController()
    );

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
      
      // Create feature index
      await fs.writeFile(
        path.join(srcPath, 'features', feature, 'index.ts'),
        generateFeatureIndex(feature)
      );
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

    // Example layered structure files
    await fs.writeFile(
      path.join(srcPath, 'controllers', 'userController.ts'),
      generateLayeredController()
    );

    await fs.writeFile(
      path.join(srcPath, 'services', 'userService.ts'),
      generateUserService()
    );

    await fs.writeFile(
      path.join(srcPath, 'repositories', 'userRepository.ts'),
      generateUserRepository(database)
    );
  }

  // Common directories for all structures
  await fs.ensureDir(path.join(srcPath, 'tests'));
  await fs.ensureDir(path.join(projectPath, 'logs'));

  // Database specific setup
  if (database === 'prisma') {
    await fs.ensureDir(path.join(projectPath, 'prisma'));
    await fs.ensureDir(path.join(projectPath, 'prisma', 'migrations'));
    await fs.writeFile(
      path.join(projectPath, 'prisma', 'schema.prisma'),
      generatePrismaSchema()
    );
  }
}

async function generateExpressConfigFiles(projectPath, config) {
  const { language, database, additionalLibraries = [] } = config;
  const srcPath = path.join(projectPath, 'src');
  const isTypeScript = language === 'typescript';

  // TypeScript configuration
  if (isTypeScript) {
    await fs.writeFile(
      path.join(projectPath, 'tsconfig.json'),
      generateTsConfig()
    );
  }

  // ESLint configuration
  await fs.writeFile(
    path.join(projectPath, 'eslint.config.js'),
    generateEslintConfig(isTypeScript)
  );

  // Nodemon configuration
  await fs.writeFile(
    path.join(projectPath, 'nodemon.json'),
    generateNodemonConfig(isTypeScript)
  );

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
      path.join(srcPath, 'config', isTypeScript ? 'database.ts' : 'database.js'),
      generateDatabaseConfig(database, isTypeScript)
    );
  }

  // Docker files (optional)
  if (additionalLibraries.includes('docker')) {
    await fs.writeFile(
      path.join(projectPath, 'Dockerfile'),
      generateDockerfile(isTypeScript)
    );

    await fs.writeFile(
      path.join(projectPath, 'docker-compose.yml'),
      generateDockerCompose(database)
    );

    await fs.writeFile(
      path.join(projectPath, '.dockerignore'),
      generateDockerIgnore()
    );
  }

  // Swagger/OpenAPI setup
  if (additionalLibraries.includes('swagger')) {
    await fs.ensureDir(path.join(srcPath, 'docs'));
    await fs.writeFile(
      path.join(srcPath, 'docs', 'swagger.ts'),
      generateSwaggerSetup()
    );
  }
}

async function generateMiddlewareAndUtilities(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  const { language, additionalLibraries = [] } = config;
  const isTypeScript = language === 'typescript';
  const ext = isTypeScript ? 'ts' : 'js';

  // Error handling middleware
  await fs.writeFile(
    path.join(srcPath, 'middleware', `errorHandler.${ext}`),
    generateErrorHandler(isTypeScript)
  );

  // Authentication middleware (JWT)
  if (additionalLibraries.includes('jwt')) {
    await fs.writeFile(
      path.join(srcPath, 'middleware', `auth.${ext}`),
      generateAuthMiddleware(isTypeScript)
    );
  }

  // Validation middleware (Zod)
  if (additionalLibraries.includes('zod')) {
    await fs.writeFile(
      path.join(srcPath, 'middleware', `validate.${ext}`),
      generateValidationMiddleware(isTypeScript)
    );

    await fs.writeFile(
      path.join(srcPath, 'validators', `userValidator.${ext}`),
      generateUserValidator(isTypeScript)
    );
  }

  // Logger setup (Winston)
  if (additionalLibraries.includes('winston')) {
    await fs.writeFile(
      path.join(srcPath, 'utils', `logger.${ext}`),
      generateLoggerSetup(isTypeScript)
    );
  }

  // CORS configuration
  await fs.writeFile(
    path.join(srcPath, 'config', `cors.${ext}`),
    generateCorsConfig(isTypeScript)
  );

  // Rate limiting
  if (additionalLibraries.includes('rate-limit')) {
    await fs.writeFile(
      path.join(srcPath, 'middleware', `rateLimiter.${ext}`),
      generateRateLimiter(isTypeScript)
    );
  }

  // Utility functions
  await fs.writeFile(
    path.join(srcPath, 'utils', `helpers.${ext}`),
    generateHelpers(isTypeScript)
  );

  // Response formatter
  await fs.writeFile(
    path.join(srcPath, 'utils', `response.${ext}`),
    generateResponseFormatter(isTypeScript)
  );
}

async function generateExpressPackageJson(projectPath, config) {
  const { language, database, additionalLibraries = [], projectName } = config;
  const isTypeScript = language === 'typescript';

  const scripts = {
    dev: isTypeScript ? 'nodemon' : 'nodemon src/server.js',
    build: isTypeScript ? 'tsc' : 'echo "No build step for JavaScript"',
    start: isTypeScript ? 'node dist/server.js' : 'node src/server.js',
    test: 'jest',
    'test:watch': 'jest --watch',
    lint: 'eslint .',
    'lint:fix': 'eslint . --fix',
    format: 'prettier --write "src/**/*.{js,ts}"',
  };

  if (database === 'prisma') {
    scripts['db:generate'] = 'prisma generate';
    scripts['db:push'] = 'prisma db push';
    scripts['db:migrate'] = 'prisma migrate dev';
    scripts['db:seed'] = 'node prisma/seed.js';
    scripts['db:studio'] = 'prisma studio';
  }

  const dependencies = {
    express: '^4.21.2',
    dotenv: '^16.4.7',
    cors: '^2.8.5',
    helmet: '^8.0.0',
    compression: '^1.7.5',
  };

  const devDependencies = {
    nodemon: '^3.1.9',
    jest: '^29.7.0',
    supertest: '^7.0.0',
    ...(isTypeScript && {
      typescript: '^5.7.3',
      '@types/express': '^5.0.0',
      '@types/node': '^22.10.5',
      '@types/cors': '^2.8.17',
      '@types/compression': '^1.7.5',
      '@types/jest': '^29.5.14',
      '@types/supertest': '^6.0.2',
      'ts-node': '^10.9.2',
      'ts-jest': '^29.2.6',
    }),
  };

  // Add JWT if selected
  if (additionalLibraries.includes('jwt')) {
    dependencies['jsonwebtoken'] = '^9.0.2';
    dependencies['bcrypt'] = '^5.1.1';
    if (isTypeScript) {
      devDependencies['@types/jsonwebtoken'] = '^9.0.7';
      devDependencies['@types/bcrypt'] = '^5.0.2';
    }
  }

  // Add Zod for validation
  if (additionalLibraries.includes('zod')) {
    dependencies['zod'] = '^3.24.1';
  }

  // Add Winston for logging
  if (additionalLibraries.includes('winston')) {
    dependencies['winston'] = '^3.17.0';
    dependencies['winston-daily-rotate-file'] = '^5.0.0';
  }

  // Add rate limiting
  if (additionalLibraries.includes('rate-limit')) {
    dependencies['express-rate-limit'] = '^7.5.0';
  }

  // Add Swagger/OpenAPI
  if (additionalLibraries.includes('swagger')) {
    dependencies['swagger-jsdoc'] = '^6.2.8';
    dependencies['swagger-ui-express'] = '^5.0.1';
    if (isTypeScript) {
      devDependencies['@types/swagger-jsdoc'] = '^6.0.4';
      devDependencies['@types/swagger-ui-express'] = '^4.1.6';
    }
  }

  // Database specific dependencies
  if (database === 'prisma') {
    dependencies['@prisma/client'] = '^6.2.0';
    devDependencies['prisma'] = '^6.2.0';
  } else if (database === 'mongodb') {
    dependencies['mongoose'] = '^8.9.3';
  } else if (database === 'postgresql' || database === 'mysql') {
    dependencies['pg'] = '^8.13.1';
    if (isTypeScript) {
      devDependencies['@types/pg'] = '^8.11.10';
    }
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

async function generateExpressReadme(projectPath, config) {
  const { language, database, folderStructure } = config;
  const isTypeScript = language === 'typescript';

  const readme = `# ${config.projectName || 'Express API'}

Express.js backend API with ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}

## 📁 Folder Structure

This project uses **${folderStructure}** architecture.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- ${database !== 'none' ? database + ' database' : 'No database required'}

### Installation

\`\`\`bash
# Install dependencies
npm install

${database === 'prisma' ? `# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate
` : ''}
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

${isTypeScript ? `### Build

\`\`\`bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
\`\`\`
` : ''}

### Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`

## 📚 API Documentation

${config.additionalLibraries?.includes('swagger') ? `
API documentation is available at \`http://localhost:3000/api-docs\` when the server is running.
` : `
// TODO: Add API documentation
`}

## 🏗️ Architecture

### ${folderStructure.toUpperCase()} Pattern

${getArchitectureDescription(folderStructure)}

## 🔧 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm test\` - Run tests
- \`npm run lint\` - Lint code
- \`npm run format\` - Format code

${database === 'prisma' ? `
## 💾 Database Commands

- \`npm run db:generate\` - Generate Prisma Client
- \`npm run db:push\` - Push schema changes
- \`npm run db:migrate\` - Run migrations
- \`npm run db:seed\` - Seed database
- \`npm run db:studio\` - Open Prisma Studio
` : ''}

## 📝 License

MIT
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

async function generateEnvExample(projectPath, config) {
  const { database, additionalLibraries = [] } = config;

  let envContent = `# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

`;

  if (additionalLibraries.includes('jwt')) {
    envContent += `# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=30d

`;
  }

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

  if (additionalLibraries.includes('rate-limit')) {
    envContent += `# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

`;
  }

  envContent += `# Logging
LOG_LEVEL=info

# External Services
# Add your external service API keys here
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envContent);
}

// Helper function generators
function generateUserController() {
  return `import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse } from '../utils/response';

/**
 * User Controller
 * Handles user-related HTTP requests
 */
export class UserController {
  /**
   * Get all users
   */
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Implement get users logic
      const users = [];
      return successResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // TODO: Implement get user by ID logic
      const user = { id, name: 'John Doe' };
      return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new user
   */
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      // TODO: Implement create user logic
      const newUser = { id: '1', ...userData };
      return successResponse(res, newUser, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      // TODO: Implement update user logic
      const updatedUser = { id, ...updateData };
      return successResponse(res, updatedUser, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // TODO: Implement delete user logic
      return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
`;
}

function generateUserModel(database) {
  if (database === 'mongodb') {
    return `import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
`;
  }

  return `// User model
// TODO: Implement user model based on your database choice
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
`;
}

function generateUserRoutes() {
  return `import { Router } from 'express';
import { userController } from '../controllers/userController';
// import { authenticate } from '../middleware/auth';
// import { validateRequest } from '../middleware/validate';
// import { createUserSchema, updateUserSchema } from '../validators/userValidator';

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', userController.getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', userController.getUserById);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Public
 */
router.post(
  '/',
  // validateRequest(createUserSchema),
  userController.createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private
 */
router.put(
  '/:id',
  // authenticate,
  // validateRequest(updateUserSchema),
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private
 */
router.delete(
  '/:id',
  // authenticate,
  userController.deleteUser
);

export default router;
`;
}

function generateRoutesIndex() {
  return `import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// API Routes
router.use('/users', userRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
`;
}

function generateCleanArchitectureUserEntity() {
  return `/**
 * User Entity
 * Core business object with business rules
 */
export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (this.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
  }

  updateName(newName: string): void {
    if (newName.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    this.name = newName;
    this.updatedAt = new Date();
  }

  updateEmail(newEmail: string): void {
    if (!newEmail.includes('@')) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
    this.updatedAt = new Date();
  }
}
`;
}

function generateUserRepositoryInterface() {
  return `import { User } from '../entities/User';

/**
 * User Repository Interface
 * Defines contract for data access
 */
export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
`;
}

function generateCleanArchitectureController() {
  return `import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/utils/response';

/**
 * User Controller (Presentation Layer)
 * Handles HTTP requests and delegates to use cases
 */
export class UserController {
  // constructor(private readonly getUserUseCase: GetUserUseCase) {}

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // const user = await this.getUserUseCase.execute(id);
      // TODO: Implement use case
      return successResponse(res, {}, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
`;
}

function generateFeatureIndex(feature) {
  return `/**
 * ${feature.charAt(0).toUpperCase() + feature.slice(1)} Feature Module
 * Self-contained feature with its own routes, controllers, and services
 */

// Export routes
export { default as ${feature}Routes } from './routes';

// Export controllers
// export * from './controllers';

// Export services
// export * from './services';

// TODO: Implement ${feature} feature
`;
}

function generateLayeredController() {
  return `import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { successResponse } from '../utils/response';

/**
 * User Controller (Presentation Layer)
 * Handles HTTP requests
 */
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers();
      return successResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
      return successResponse(res, newUser, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
`;
}

function generateUserService() {
  return `import { UserRepository } from '../repositories/userRepository';

/**
 * User Service (Business Logic Layer)
 * Contains business logic and coordinates between controller and repository
 */
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    // Business logic here
    return await this.userRepository.findAll();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(userData: any) {
    // Validate business rules
    if (!userData.email) {
      throw new Error('Email is required');
    }

    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    return await this.userRepository.create(userData);
  }

  async updateUser(id: string, updateData: any) {
    const user = await this.getUserById(id);
    return await this.userRepository.update(id, updateData);
  }

  async deleteUser(id: string) {
    await this.getUserById(id);
    return await this.userRepository.delete(id);
  }
}
`;
}

function generateUserRepository(database) {
  if (database === 'prisma') {
    return `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * User Repository (Data Access Layer)
 * Handles database operations
 */
export class UserRepository {
  async findAll() {
    return await prisma.user.findMany();
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(userData: any) {
    return await prisma.user.create({
      data: userData,
    });
  }

  async update(id: string, updateData: any) {
    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  }
}
`;
  }

  return `/**
 * User Repository (Data Access Layer)
 * Handles database operations
 */
export class UserRepository {
  async findAll() {
    // TODO: Implement database query
    return [];
  }

  async findById(id: string) {
    // TODO: Implement database query
    return null;
  }

  async findByEmail(email: string) {
    // TODO: Implement database query
    return null;
  }

  async create(userData: any) {
    // TODO: Implement database insert
    return userData;
  }

  async update(id: string, updateData: any) {
    // TODO: Implement database update
    return updateData;
  }

  async delete(id: string) {
    // TODO: Implement database delete
  }
}
`;
}

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

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum Role {
  USER
  ADMIN
}
`;
}

function generateTsConfig() {
  return JSON.stringify({
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
      declarationMap: true,
      sourceMap: true,
      types: ['node', 'jest'],
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', '**/*.spec.ts', '**/*.test.ts'],
  }, null, 2);
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
    return JSON.stringify({
      watch: ['src'],
      ext: 'ts',
      exec: 'ts-node src/server.ts',
      env: {
        NODE_ENV: 'development',
      },
    }, null, 2);
  }

  return JSON.stringify({
    watch: ['src'],
    ext: 'js',
    exec: 'node src/server.js',
    env: {
      NODE_ENV: 'development',
    },
  }, null, 2);
}

function generateAppFile(config) {
  const { additionalLibraries = [] } = config;
  const hasSwagger = additionalLibraries.includes('swagger');
  const hasLogger = additionalLibraries.includes('winston');
  const hasRateLimit = additionalLibraries.includes('rate-limit');

  return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
${hasLogger ? "import { logger } from './utils/logger';" : ''}
${hasSwagger ? "import swaggerSetup from './docs/swagger';" : ''}
import { corsOptions } from './config/cors';
${hasRateLimit ? "import { limiter } from './middleware/rateLimiter';" : ''}
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

${hasRateLimit ? `// Rate Limiting
app.use(limiter);
` : ''}
${hasLogger ? `// Request Logging
app.use((req, res, next) => {
  logger.info(\`\${req.method} \${req.url}\`);
  next();
});
` : ''}
${hasSwagger ? `// API Documentation
swaggerSetup(app);
` : ''}
// API Routes
app.use('/api', routes);

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      ${hasSwagger ? "docs: '/api-docs'," : ''}
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
${isTypeScript ? "import { logger } from './utils/logger';" : ''}

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(\`🚀 Server is running on port \${PORT}\`);
  console.log(\`📝 Environment: \${process.env.NODE_ENV}\`);
  ${isTypeScript ? "logger.info(`Server started on port ${PORT}`);" : ''}
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
`;
}

function generateDatabaseConfig(database, isTypeScript) {
  if (database === 'mongodb') {
    return `import mongoose from 'mongoose';
${isTypeScript ? "import { logger } from '../utils/logger';" : ''}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI${isTypeScript ? ' as string' : ''});
    console.log(\`✅ MongoDB Connected: \${conn.connection.host}\`);
    ${isTypeScript ? "logger.info('MongoDB connected successfully');" : ''}
  } catch (error) {
    console.error(\`❌ Error: \${error${isTypeScript ? '.message' : ''}}\`);
    ${isTypeScript ? "logger.error('MongoDB connection failed', error);" : ''}
    process.exit(1);
  }
};

export default connectDB;
`;
  }

  if (database === 'prisma') {
    return `import { PrismaClient } from '@prisma/client';
${isTypeScript ? "import { logger } from '../utils/logger';" : ''}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    ${isTypeScript ? "logger.info('Prisma connected to database');" : ''}
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    ${isTypeScript ? "logger.error('Prisma connection failed', error);" : ''}
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
// TODO: Implement database connection based on your choice

export const connectDB = async () => {
  console.log('✅ Database connected');
};

export const disconnectDB = async () => {
  console.log('Database disconnected');
};
`;
}

function generateDockerfile(isTypeScript) {
  return `FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

${isTypeScript ? 'RUN npm run build' : ''}

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=builder --chown=expressjs:nodejs /app/${isTypeScript ? 'dist' : 'src'} ./${isTypeScript ? 'dist' : 'src'}
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/package*.json ./

USER expressjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
`;
}

function generateDockerCompose(database) {
  let services = {
    app: {
      build: '.',
      ports: ['3000:3000'],
      environment: [
        'NODE_ENV=development',
      ],
      volumes: [
        './src:/app/src',
      ],
      depends_on: [],
    },
  };

  if (database === 'postgresql') {
    services.app.environment.push('DATABASE_URL=postgresql://postgres:password@postgres:5432/mydb');
    services.app.depends_on.push('postgres');
    services.postgres = {
      image: 'postgres:15-alpine',
      environment: [
        'POSTGRES_USER=postgres',
        'POSTGRES_PASSWORD=password',
        'POSTGRES_DB=mydb',
      ],
      ports: ['5432:5432'],
      volumes: ['postgres_data:/var/lib/postgresql/data'],
    };
  } else if (database === 'mongodb') {
    services.app.environment.push('MONGODB_URI=mongodb://mongo:27017/mydb');
    services.app.depends_on.push('mongo');
    services.mongo = {
      image: 'mongo:7',
      ports: ['27017:27017'],
      volumes: ['mongo_data:/data/db'],
    };
  } else if (database === 'mysql') {
    services.app.environment.push('DATABASE_URL=mysql://root:password@mysql:3306/mydb');
    services.app.depends_on.push('mysql');
    services.mysql = {
      image: 'mysql:8',
      environment: [
        'MYSQL_ROOT_PASSWORD=password',
        'MYSQL_DATABASE=mydb',
      ],
      ports: ['3306:3306'],
      volumes: ['mysql_data:/var/lib/mysql'],
    };
  }

  const compose = {
    version: '3.8',
    services,
  };

  if (database !== 'none') {
    compose.volumes = {};
    if (database === 'postgresql') compose.volumes.postgres_data = {};
    if (database === 'mongodb') compose.volumes.mongo_data = {};
    if (database === 'mysql') compose.volumes.mysql_data = {};
  }

  return `version: '3.8'

services:
${Object.entries(compose.services).map(([name, service]) => `  ${name}:
    ${Object.entries(service).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n      - ${value.join('\n      - ')}`;
      }
      if (typeof value === 'object') {
        return `${key}:\n      ${Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('\n      ')}`;
      }
      return `${key}: ${value}`;
    }).join('\n    ')}`).join('\n\n')}

${compose.volumes ? `volumes:\n${Object.keys(compose.volumes).map(v => `  ${v}:`).join('\n')}` : ''}
`;
}

function generateDockerIgnore() {
  return `node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
dist
logs
*.log
.DS_Store
coverage
.vscode
.idea
`;
}

function generateSwaggerSetup() {
  return `import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for Express.js application',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export default function swaggerSetup(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('📚 Swagger documentation available at /api-docs');
}
`;
}

function generateErrorHandler(isTypeScript) {
  return `import { Request, Response, NextFunction } from 'express';
${isTypeScript ? "import { logger } from '../utils/logger';" : ''}

${isTypeScript ? `
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
` : ''}

export const errorHandler = (
  err${isTypeScript ? ': any' : ''},
  req${isTypeScript ? ': Request' : ''},
  res${isTypeScript ? ': Response' : ''},
  next${isTypeScript ? ': NextFunction' : ''}
) => {
  ${isTypeScript ? "logger.error('Error:', err);" : ''}

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

export const asyncHandler = (fn${isTypeScript ? ': any' : ''}) => (
  req${isTypeScript ? ': Request' : ''},
  res${isTypeScript : ': Response' : ''},
  next${isTypeScript ? ': NextFunction' : ''}
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
`;
}

function generateAuthMiddleware(isTypeScript) {
  return `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
${isTypeScript ? "import { AppError } from './errorHandler';" : ''}

${isTypeScript ? `
interface JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
` : ''}

export const authenticate = async (
  req${isTypeScript ? ': Request' : ''},
  res${isTypeScript ? ': Response' : ''},
  next${isTypeScript ? ': NextFunction' : ''}
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ${isTypeScript ? "throw new AppError('No token provided', 401);" : "return res.status(401).json({ message: 'No token provided' });"}
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET${isTypeScript ? ' as string' : ''}
    )${isTypeScript ? ' as JwtPayload' : ''};

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    ${isTypeScript ? "throw new AppError('Invalid token', 401);" : "return res.status(401).json({ message: 'Invalid token' });"}
  }
};

export const authorize = (...roles${isTypeScript ? ': string[]' : ''}) => {
  return (req${isTypeScript ? ': Request' : ''}, res${isTypeScript ? ': Response' : ''}, next${isTypeScript ? ': NextFunction' : ''}) => {
    // TODO: Implement role-based authorization
    next();
  };
};
`;
}

function generateValidationMiddleware(isTypeScript) {
  return `import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema${isTypeScript ? ': ZodSchema' : ''}) => {
  return async (
    req${isTypeScript ? ': Request' : ''},
    res${isTypeScript ? ': Response' : ''},
    next${isTypeScript ? ': NextFunction' : ''}
  ) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error${isTypeScript ? ': any' : ''}) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
  };
};
`;
}

function generateUserValidator(isTypeScript) {
  return `import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['user', 'admin']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

${isTypeScript ? `
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
` : ''}
`;
}

function generateLoggerSetup(isTypeScript) {
  return `import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const transports${isTypeScript ? ': winston.transport[]' : ''} = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(
        ({ timestamp, level, message, ...meta }) =>
          \`\${timestamp} [\${level}]: \${message} \${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }\`
      )
    ),
  }),

  // Error log file
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
  }),

  // Combined log file
  new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
  }),
];

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
});

// If we're not in production, log to console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
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

function generateRateLimiter(isTypeScript) {
  return `import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
  },
  skipSuccessfulRequests: true,
});
`;
}

function generateHelpers(isTypeScript) {
  return `/**
 * Utility Helper Functions
 */

/**
 * Delay execution for specified milliseconds
 */
export const delay = (ms${isTypeScript ? ': number' : ''})${isTypeScript ? ': Promise<void>' : ''} => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Generate random string
 */
export const generateRandomString = (length${isTypeScript ? ': number' : ''} = 32)${isTypeScript ? ': string' : ''} => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Check if value is empty
 */
export const isEmpty = (value${isTypeScript ? ': any' : ''})${isTypeScript ? ': boolean' : ''} => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

/**
 * Paginate array
 */
export const paginate = ${isTypeScript ? '<T>' : ''}(
  array${isTypeScript ? ': T[]' : ''},
  page${isTypeScript ? ': number' : ''} = 1,
  limit${isTypeScript ? ': number' : ''} = 10
)${isTypeScript ? ': { data: T[]; total: number; page: number; pages: number }' : ''} => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);

  return {
    data,
    total: array.length,
    page,
    pages: Math.ceil(array.length / limit),
  };
};
`;
}

function generateResponseFormatter(isTypeScript) {
  return `import { Response } from 'express';

${isTypeScript ? `
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
` : ''}

export const successResponse = ${isTypeScript ? '<T>' : ''}(
  res${isTypeScript ? ': Response' : ''},
  data${isTypeScript ? ': T' : ''},
  message${isTypeScript ? ': string' : ''} = 'Success',
  statusCode${isTypeScript ? ': number' : ''} = 200
)${isTypeScript ? ': Response<ApiResponse<T>>' : ''} => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res${isTypeScript ? ': Response' : ''},
  message${isTypeScript ? ': string' : ''} = 'Error',
  statusCode${isTypeScript ? ': number' : ''} = 500,
  error${isTypeScript ? '?: any' : ''}
)${isTypeScript ? ': Response<ApiResponse>' : ''} => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && error && { error }),
  });
};

export const paginatedResponse = ${isTypeScript ? '<T>' : ''}(
  res${isTypeScript ? ': Response' : ''},
  data${isTypeScript ? ': T[]' : ''},
  page${isTypeScript ? ': number' : ''},
  limit${isTypeScript ? ': number' : ''},
  total${isTypeScript ? ': number' : ''},
  message${isTypeScript ? ': string' : ''} = 'Success'
)${isTypeScript ? ': Response' : ''} => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};
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

**Flow:** Controller → Service → Repository → Database
Each layer only communicates with adjacent layers.
`,
  };

  return descriptions[structure] || 'Custom architecture';
}

export default generateExpressTemplate;
