import { execCommand } from './cliRunner.js';
import chalk from 'chalk';

/**
 * Install add-ons/libraries using their official installation methods
 *
 * This module installs additional libraries and tools using their
 * official CLIs and installation commands, ensuring proper setup
 * and configuration.
 *
 * @param {string} projectPath - Project directory
 * @param {Object} config - User configuration with selected add-ons
 * @returns {Promise<void>}
 */
export async function installAddons(projectPath, config) {
  const {
    stateManagement,
    uiLibrary,
    database,
    orm,
    authentication,
    testing = [],
    styling,
    additionalLibraries = [],
  } = config;

  // Styling (MUST be installed before UI libraries like shadcn)
  if (styling && styling !== 'none' && styling !== 'css') {
    console.log(chalk.cyan('\n🎨 Installing styling solution...'));
    await installStyling(projectPath, styling, config);
  }

  // State Management
  if (stateManagement && stateManagement !== 'none') {
    console.log(chalk.cyan('\n📦 Installing state management...'));
    await installStateManagement(projectPath, stateManagement, config);
  }

  // UI Library (must come AFTER styling, especially for shadcn which needs Tailwind)
  if (uiLibrary && uiLibrary !== 'none') {
    console.log(chalk.cyan('\n🎨 Installing UI library...'));
    await installUILibrary(projectPath, uiLibrary, config);
  }

  // Database & ORM
  if (orm && orm !== 'none') {
    console.log(chalk.cyan('\n🗄️  Installing ORM...'));
    await installORM(projectPath, orm, database, config);
  }

  // Authentication
  if (authentication && authentication !== 'none') {
    console.log(chalk.cyan('\n🔐 Installing authentication...'));
    await installAuthentication(projectPath, authentication, config);
  }

  // Testing
  if (testing && testing.length > 0) {
    console.log(chalk.cyan('\n🧪 Installing testing frameworks...'));
    await installTesting(projectPath, testing, config);
  }

  // Additional libraries
  if (additionalLibraries && additionalLibraries.length > 0) {
    console.log(chalk.cyan('\n📦 Installing additional libraries...'));
    for (const lib of additionalLibraries) {
      await installAdditionalLibrary(projectPath, lib, config);
    }
  }
}

/**
 * Install state management library
 */
async function installStateManagement(projectPath, library, config) {
  const { packageManager } = config;
  const installCmd = getInstallCommand(packageManager);

  switch (library) {
    case 'redux-toolkit':
      console.log(chalk.dim('  Installing Redux Toolkit and React Redux...'));
      await execCommand(`${installCmd} @reduxjs/toolkit react-redux`, {
        cwd: projectPath,
      });
      // Store setup will be done in template generator
      break;

    case 'zustand':
      console.log(chalk.dim('  Installing Zustand...'));
      await execCommand(`${installCmd} zustand`, { cwd: projectPath });
      break;

    case 'jotai':
      console.log(chalk.dim('  Installing Jotai...'));
      await execCommand(`${installCmd} jotai`, { cwd: projectPath });
      break;

    case 'recoil':
      console.log(chalk.dim('  Installing Recoil...'));
      await execCommand(`${installCmd} recoil`, { cwd: projectPath });
      break;

    case 'pinia':
      // Pinia is usually included in Vue setup
      console.log(chalk.dim('  Pinia will be configured in Vue setup...'));
      break;

    default:
      console.log(chalk.yellow(`  Unknown state management: ${library}`));
  }
}

/**
 * Install styling solution
 */
async function installStyling(projectPath, styling, config) {
  const { packageManager, frontend } = config;
  const installCmd = getInstallCommand(packageManager);

  switch (styling) {
    case 'tailwind':
      console.log(chalk.dim('  Installing Tailwind CSS...'));
      await execCommand(`${installCmd} -D tailwindcss postcss autoprefixer`, {
        cwd: projectPath,
      });

      // Initialize Tailwind config using the package manager's binary
      console.log(chalk.dim('  Initializing Tailwind configuration...'));
      const execCmd = packageManager === 'npm' ? 'npx' : 
                      packageManager === 'yarn' ? 'yarn' :
                      packageManager === 'pnpm' ? 'pnpm exec' :
                      packageManager === 'bun' ? 'bunx' : 'npx';
      
      await execCommand(`${execCmd} tailwindcss init -p`, { cwd: projectPath });

      // For Vite projects, we need to update the Tailwind config
      if (frontend === 'react' || frontend === 'vue') {
        const fs = await import('fs-extra');
        const path = await import('path');

        // Update tailwind.config.js with proper content paths
        const tailwindConfigPath = path.join(projectPath, 'tailwind.config.js');
        const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
        await fs.writeFile(tailwindConfigPath, tailwindConfig);

        // Create/update main CSS file with Tailwind directives
        const cssPath = path.join(projectPath, 'src', 'index.css');
        const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
        await fs.writeFile(cssPath, tailwindDirectives);
      }
      break;

    case 'scss':
    case 'sass':
      console.log(chalk.dim('  Installing Sass...'));
      await execCommand(`${installCmd} -D sass`, { cwd: projectPath });
      break;

    case 'styled-components':
      console.log(chalk.dim('  Installing Styled Components...'));
      await execCommand(`${installCmd} styled-components`, { cwd: projectPath });
      if (config.language === 'typescript') {
        await execCommand(`${installCmd} -D @types/styled-components`, {
          cwd: projectPath,
        });
      }
      break;

    case 'emotion':
      console.log(chalk.dim('  Installing Emotion...'));
      await execCommand(`${installCmd} @emotion/react @emotion/styled`, {
        cwd: projectPath,
      });
      break;

    case 'css-modules':
      // CSS Modules are built into Vite and Next.js, no installation needed
      console.log(chalk.dim('  CSS Modules are built-in, no installation needed'));
      break;

    default:
      console.log(chalk.yellow(`  Unknown styling solution: ${styling}`));
  }
}

/**
 * Install UI library (some have their own CLIs!)
 */
async function installUILibrary(projectPath, library, config) {
  const { packageManager, language } = config;
  const installCmd = getInstallCommand(packageManager);

  switch (library) {
    case 'shadcn':
    case 'shadcn-ui':
      console.log(chalk.dim('  Running shadcn-ui init...'));

      // Ensure tsconfig has path aliases for shadcn
      const fs = await import('fs-extra');
      const path = await import('path');
      const tsconfigPath = path.join(projectPath, 'tsconfig.json');

      if (await fs.pathExists(tsconfigPath)) {
        const tsconfig = await fs.readJson(tsconfigPath);
        if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
        if (!tsconfig.compilerOptions.baseUrl) tsconfig.compilerOptions.baseUrl = '.';
        if (!tsconfig.compilerOptions.paths) tsconfig.compilerOptions.paths = {};
        tsconfig.compilerOptions.paths['@/*'] = ['./src/*'];
        await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
      }

      // shadcn has its own CLI!
      await execCommand(`npx shadcn@latest init -y`, { cwd: projectPath });
      break;

    case 'mui':
    case 'material-ui':
      console.log(chalk.dim('  Installing Material-UI...'));
      await execCommand(
        `${installCmd} @mui/material @emotion/react @emotion/styled @mui/icons-material`,
        { cwd: projectPath }
      );
      break;

    case 'antd':
    case 'ant-design':
      console.log(chalk.dim('  Installing Ant Design...'));
      await execCommand(`${installCmd} antd`, { cwd: projectPath });
      break;

    case 'chakra':
    case 'chakra-ui':
      console.log(chalk.dim('  Installing Chakra UI...'));
      await execCommand(
        `${installCmd} @chakra-ui/react @emotion/react @emotion/styled framer-motion`,
        { cwd: projectPath }
      );
      break;

    case 'mantine':
      console.log(chalk.dim('  Installing Mantine...'));
      await execCommand(
        `${installCmd} @mantine/core @mantine/hooks @mantine/form @mantine/notifications`,
        { cwd: projectPath }
      );
      break;

    case 'daisyui':
      console.log(chalk.dim('  Installing DaisyUI...'));
      await execCommand(`${installCmd} -D daisyui`, { cwd: projectPath });
      break;

    default:
      console.log(chalk.yellow(`  Unknown UI library: ${library}`));
  }
}

/**
 * Install ORM (Prisma has its own CLI!)
 */
async function installORM(projectPath, orm, database, config) {
  const { packageManager, language } = config;
  const installCmd = getInstallCommand(packageManager);

  switch (orm) {
    case 'prisma': {
      console.log(chalk.dim('  Installing Prisma...'));
      // Prisma has its own init CLI!
      await execCommand(`${installCmd} -D prisma`, { cwd: projectPath });
      await execCommand(`${installCmd} @prisma/client`, { cwd: projectPath });

      // Initialize Prisma with database
      const datasource = getDatasourceForPrisma(database);
      console.log(chalk.dim(`  Initializing Prisma with ${datasource}...`));
      await execCommand(`npx prisma init --datasource-provider ${datasource}`, {
        cwd: projectPath,
      });
      break;
    }

    case 'drizzle': {
      console.log(chalk.dim('  Installing Drizzle ORM...'));
      await execCommand(`${installCmd} drizzle-orm`, { cwd: projectPath });
      await execCommand(`${installCmd} -D drizzle-kit`, { cwd: projectPath });

      // Add database driver
      const driver = getDriverForDrizzle(database);
      console.log(chalk.dim(`  Installing database driver: ${driver}...`));
      await execCommand(`${installCmd} ${driver}`, { cwd: projectPath });
      break;
    }

    case 'typeorm': {
      console.log(chalk.dim('  Installing TypeORM...'));
      await execCommand(`${installCmd} typeorm reflect-metadata`, {
        cwd: projectPath,
      });
      if (language === 'typescript') {
        await execCommand(`${installCmd} -D @types/node`, { cwd: projectPath });
      }
      // Add database driver
      const typeormDriver = getDriverForTypeORM(database);
      if (typeormDriver) {
        console.log(chalk.dim(`  Installing database driver: ${typeormDriver}...`));
        await execCommand(`${installCmd} ${typeormDriver}`, {
          cwd: projectPath,
        });
      }
      break;
    }

    case 'mongoose':
      console.log(chalk.dim('  Installing Mongoose...'));
      await execCommand(`${installCmd} mongoose`, { cwd: projectPath });
      if (language === 'typescript') {
        await execCommand(`${installCmd} -D @types/mongoose`, {
          cwd: projectPath,
        });
      }
      break;

    default:
      console.log(chalk.yellow(`  Unknown ORM: ${orm}`));
  }
}

/**
 * Install authentication library
 */
async function installAuthentication(projectPath, auth, config) {
  const { packageManager } = config;
  const installCmd = getInstallCommand(packageManager);

  switch (auth) {
    case 'nextauth':
    case 'next-auth':
      console.log(chalk.dim('  Installing NextAuth.js...'));
      await execCommand(`${installCmd} next-auth`, { cwd: projectPath });
      break;

    case 'clerk':
      console.log(chalk.dim('  Installing Clerk...'));
      await execCommand(`${installCmd} @clerk/nextjs`, { cwd: projectPath });
      break;

    case 'supabase':
      console.log(chalk.dim('  Installing Supabase client...'));
      await execCommand(`${installCmd} @supabase/supabase-js`, {
        cwd: projectPath,
      });
      break;

    case 'auth0':
      console.log(chalk.dim('  Installing Auth0...'));
      await execCommand(`${installCmd} @auth0/nextjs-auth0`, {
        cwd: projectPath,
      });
      break;

    case 'lucia':
      console.log(chalk.dim('  Installing Lucia...'));
      await execCommand(`${installCmd} lucia`, { cwd: projectPath });
      break;

    default:
      console.log(chalk.yellow(`  Unknown authentication library: ${auth}`));
  }
}

/**
 * Install testing frameworks (Playwright has its own CLI!)
 */
async function installTesting(projectPath, testingLibs, config) {
  const { packageManager } = config;
  const installCmd = getInstallCommand(packageManager);

  for (const lib of testingLibs) {
    switch (lib) {
      case 'vitest':
        console.log(chalk.dim('  Installing Vitest...'));
        await execCommand(`${installCmd} -D vitest`, { cwd: projectPath });
        await execCommand(`${installCmd} -D @vitest/ui`, { cwd: projectPath });
        break;

      case 'jest':
        console.log(chalk.dim('  Installing Jest...'));
        await execCommand(`${installCmd} -D jest @types/jest`, {
          cwd: projectPath,
        });
        break;

      case 'playwright':
        console.log(chalk.dim('  Installing Playwright...'));
        // Playwright has its own init CLI!
        await execCommand(`npm init playwright@latest`, { cwd: projectPath });
        break;

      case 'cypress':
        console.log(chalk.dim('  Installing Cypress...'));
        await execCommand(`${installCmd} -D cypress`, { cwd: projectPath });
        break;

      case 'testing-library':
      case '@testing-library':
        console.log(chalk.dim('  Installing React Testing Library...'));
        await execCommand(
          `${installCmd} -D @testing-library/react @testing-library/jest-dom @testing-library/user-event`,
          { cwd: projectPath }
        );
        break;

      default:
        console.log(chalk.yellow(`  Unknown testing library: ${lib}`));
    }
  }
}

/**
 * Install additional library
 */
async function installAdditionalLibrary(projectPath, lib, config) {
  const { packageManager } = config;
  const installCmd = getInstallCommand(packageManager);

  console.log(chalk.dim(`  Installing ${lib}...`));
  await execCommand(`${installCmd} ${lib}`, { cwd: projectPath });
}

/**
 * Get install command for package manager
 */
function getInstallCommand(packageManager) {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn add',
    pnpm: 'pnpm add',
    bun: 'bun add',
  };
  return commands[packageManager] || 'npm install';
}

/**
 * Helper functions for database mappings
 */
function getDatasourceForPrisma(database) {
  if (!database || database === 'none') return 'postgresql';

  const mapping = {
    postgresql: 'postgresql',
    postgres: 'postgresql',
    mysql: 'mysql',
    sqlite: 'sqlite',
    mongodb: 'mongodb',
    sqlserver: 'sqlserver',
  };
  return mapping[database.toLowerCase()] || 'postgresql';
}

function getDriverForDrizzle(database) {
  if (!database || database === 'none') return 'pg';

  const drivers = {
    postgresql: 'pg',
    postgres: 'pg',
    mysql: 'mysql2',
    sqlite: 'better-sqlite3',
  };
  return drivers[database.toLowerCase()] || 'pg';
}

function getDriverForTypeORM(database) {
  if (!database || database === 'none') return null;

  const drivers = {
    postgresql: 'pg',
    postgres: 'pg',
    mysql: 'mysql2',
    sqlite: 'sqlite3',
    mongodb: 'mongodb',
  };
  return drivers[database.toLowerCase()] || null;
}

/**
 * Check if user selected any add-ons
 */
export function hasAddons(config) {
  return !!(
    (config.stateManagement && config.stateManagement !== 'none') ||
    (config.uiLibrary && config.uiLibrary !== 'none') ||
    (config.orm && config.orm !== 'none') ||
    (config.authentication && config.authentication !== 'none') ||
    (config.testing && config.testing.length > 0) ||
    (config.additionalLibraries && config.additionalLibraries.length > 0)
  );
}
