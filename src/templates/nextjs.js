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
 * Generate Next.js project with App Router or Pages Router structure
 *
 * Creates a modern Next.js project with:
 * - Folder structure based on user preference (feature-based, type-based, or pages-router)
 * - TypeScript or JavaScript configuration
 * - App Router (default) or Pages Router architecture
 * - Package.json with Next.js 14+ dependencies
 * - README with getting started instructions
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User configuration object
 * @param {string} config.projectName - Name of the project
 * @param {string} config.language - Programming language ('typescript'|'javascript')
 * @param {string} [config.folderStructure='feature-based'] - Folder organization pattern
 *   - 'feature-based': Organize by features/modules (recommended for large apps)
 *   - 'type-based': Organize by file type (components, hooks, utils)
 *   - 'pages-router': Use legacy Pages Router instead of App Router
 * @param {string} config.packageManager - Package manager to use
 *
 * @returns {Promise<void>}
 *
 * @example
 * // Create Next.js project with App Router and feature-based structure
 * await generateNextjsTemplate('/path/to/project', {
 *   projectName: 'my-nextjs-app',
 *   language: 'typescript',
 *   folderStructure: 'feature-based',
 *   packageManager: 'npm'
 * });
 */
export async function generateNextjsTemplate(projectPath, config) {
  // Create folder structure only
  await createNextjsFolderStructure(projectPath, config);

  // Generate package.json
  await generateNextjsPackageJson(projectPath, config);

  // Generate essential files (layout, page, etc.)
  await generateNextjsEssentialFiles(projectPath, config);

  // Generate README
  await generateNextjsReadme(projectPath, config);
}

async function createNextjsFolderStructure(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  const folderStructure = config.folderStructure || 'feature-based';
  const useAppRouter = folderStructure !== 'pages-router';

  if (folderStructure === 'feature-based') {
    // Feature-based structure
    const features = ['auth', 'dashboard', 'users'];
    for (const feature of features) {
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'components'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'hooks'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'services'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'types'));

      // Create barrel export
      await fs.writeFile(
        path.join(srcPath, 'features', feature, 'index.ts'),
        generateBarrelExport(feature)
      );
    }

    // Shared directory
    await fs.ensureDir(path.join(srcPath, 'shared', 'components', 'ui'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'components', 'layout'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'hooks'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'utils'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'types'));

    await fs.writeFile(
      path.join(srcPath, 'shared', 'components', 'index.ts'),
      `// Export shared components\n// TODO: Add your shared components here\n`
    );
  } else if (folderStructure === 'component-based') {
    // Component-based structure
    await fs.ensureDir(path.join(srcPath, 'components', 'ui'));
    await fs.ensureDir(path.join(srcPath, 'components', 'layout'));
    await fs.ensureDir(path.join(srcPath, 'components', 'forms'));
    await fs.ensureDir(path.join(srcPath, 'hooks'));
    await fs.ensureDir(path.join(srcPath, 'services'));
    await fs.ensureDir(path.join(srcPath, 'utils'));
    await fs.ensureDir(path.join(srcPath, 'types'));
  }

  // App or pages directory
  if (useAppRouter) {
    await fs.ensureDir(path.join(srcPath, 'app'));
    await fs.ensureDir(path.join(srcPath, 'app', 'api'));
  } else {
    await fs.ensureDir(path.join(srcPath, 'pages'));
    await fs.ensureDir(path.join(srcPath, 'pages', 'api'));
  }

  // Common directories
  await fs.ensureDir(path.join(srcPath, 'lib'));
  await fs.ensureDir(path.join(projectPath, 'public'));
}

async function generateNextjsPackageJson(projectPath, config) {
  const { language, styling, additionalLibraries = [] } = config;
  const isTypeScript = language === 'typescript';

  const dependencies = {
    next: 'latest',
    react: 'latest',
    'react-dom': 'latest',
  };

  const devDependencies = {
    ...(isTypeScript && {
      '@types/node': 'latest',
      '@types/react': 'latest',
      '@types/react-dom': 'latest',
      typescript: 'latest',
    }),
  };

  // Add Tailwind
  if (styling === 'tailwind') {
    devDependencies['tailwindcss'] = 'latest';
  }

  // Add libraries
  if (additionalLibraries.includes('tanstack-query')) {
    dependencies['@tanstack/react-query'] = 'latest';
  }

  if (additionalLibraries.includes('redux-toolkit')) {
    dependencies['@reduxjs/toolkit'] = 'latest';
    dependencies['react-redux'] = 'latest';
  }

  if (additionalLibraries.includes('zustand')) {
    dependencies['zustand'] = 'latest';
  }

  if (additionalLibraries.includes('jotai')) {
    dependencies['jotai'] = 'latest';
  }

  if (additionalLibraries.includes('axios')) {
    dependencies['axios'] = 'latest';
  }

  if (additionalLibraries.includes('zod')) {
    dependencies['zod'] = 'latest';
  }

  if (additionalLibraries.includes('react-hook-form')) {
    dependencies['react-hook-form'] = 'latest';
    dependencies['@hookform/resolvers'] = 'latest';
  }

  if (additionalLibraries.includes('framer-motion')) {
    dependencies['framer-motion'] = 'latest';
  }

  if (additionalLibraries.includes('react-icons')) {
    dependencies['react-icons'] = 'latest';
  }

  if (additionalLibraries.includes('radix-ui')) {
    Object.assign(dependencies, {
      '@radix-ui/react-dialog': 'latest',
      '@radix-ui/react-dropdown-menu': 'latest',
      '@radix-ui/react-select': 'latest',
      '@radix-ui/react-slot': 'latest',
    });
  }

  const packageJson = {
    name: config.projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies,
    devDependencies,
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
}

async function generateNextjsEssentialFiles(projectPath, config) {
  const { language, folderStructure } = config;
  const isTypeScript = language === 'typescript';
  const ext = isTypeScript ? 'tsx' : 'jsx';
  const useAppRouter = folderStructure !== 'pages-router';
  const appPath = path.join(projectPath, 'src', useAppRouter ? 'app' : 'pages');

  if (useAppRouter) {
    // Create layout file for App Router
    const layoutContent = `${isTypeScript ? "import type { Metadata } from 'next'\n" : ''}import './globals.css'

${
  isTypeScript
    ? `export const metadata: Metadata = {
  title: '${config.projectName}',
  description: 'Generated by InitKit CLI',
}

`
    : ''
}export default function RootLayout(${
      isTypeScript
        ? `{
  children,
}: Readonly<{
  children: React.ReactNode
}>`
        : '{ children }'
    }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`;

    await fs.writeFile(path.join(appPath, `layout.${ext}`), layoutContent);

    // Create page file for App Router
    const pageContent = `export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Welcome to ${config.projectName}</h1>
      <p>Get started by editing <code>src/app/page.${ext}</code></p>
    </div>
  )
}
`;

    await fs.writeFile(path.join(appPath, `page.${ext}`), pageContent);

    // Create globals.css
    const globalsCssContent = `:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}
`;

    await fs.writeFile(path.join(appPath, 'globals.css'), globalsCssContent);
  } else {
    // Create _app file for Pages Router
    const appPageContent = `${isTypeScript ? "import type { AppProps } from 'next/app'\n" : ''}import '../styles/globals.css'

export default function App(${isTypeScript ? '{ Component, pageProps }: AppProps' : '{ Component, pageProps }'}) {
  return <Component {...pageProps} />
}
`;

    await fs.writeFile(path.join(appPath, `_app.${ext}`), appPageContent);

    // Create index page for Pages Router
    const indexPageContent = `export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Welcome to ${config.projectName}</h1>
      <p>Get started by editing <code>src/pages/index.${ext}</code></p>
    </div>
  )
}
`;

    await fs.writeFile(path.join(appPath, `index.${ext}`), indexPageContent);

    // Create styles directory
    const stylesPath = path.join(projectPath, 'src', 'styles');
    await fs.ensureDir(stylesPath);
    await fs.writeFile(
      path.join(stylesPath, 'globals.css'),
      `:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
`
    );
  }

  // Create next.config file
  const nextConfigContent = isTypeScript
    ? `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

export default nextConfig
`
    : `/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
}

export default nextConfig
`;

  await fs.writeFile(
    path.join(projectPath, isTypeScript ? 'next.config.ts' : 'next.config.js'),
    nextConfigContent
  );

  // Create .gitignore
  const gitignoreContent = `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);

  // Create tsconfig.json if TypeScript
  if (isTypeScript) {
    const tsconfigContent = {
      compilerOptions: {
        target: 'ES2017',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [
          {
            name: 'next',
          },
        ],
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsconfigContent, { spaces: 2 });
  }
}

async function generateNextjsReadme(projectPath, config) {
  const { projectName, folderStructure, language, styling, packageManager } = config;

  const readme = `# ${projectName}

Created with InitKit CLI

## Setup

1. Install dependencies:
\`\`\`bash
${packageManager} install
\`\`\`

2. Run the development server:
\`\`\`bash
${packageManager} ${packageManager === 'npm' ? 'run ' : ''}dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 15** - React framework
- **React 19** - UI library${language === 'typescript' ? '\n- **TypeScript** - Type safety' : ''}${styling === 'tailwind' ? '\n- **Tailwind CSS v4** - Styling' : ''}

## Folder Structure

\`\`\`
src/
${
  folderStructure === 'feature-based'
    ? `├── features/       # Feature modules
│   ├── auth/       # Authentication
│   ├── dashboard/  # Dashboard
│   └── users/      # Users
├── shared/         # Shared code
├── app/            # Next.js App Router`
    : `├── components/     # React components
├── hooks/          # Custom hooks
├── services/       # API services
├── app/            # Next.js App Router`
}
├── lib/            # Utilities
└── public/         # Static files
\`\`\`

## Next Steps

1. Run \`npx create-next-app@latest . --use-${packageManager}\` to initialize Next.js${styling === 'tailwind' ? '\n2. Install Tailwind v4: `' + packageManager + (packageManager === 'npm' ? ' install' : ' add') + ' tailwindcss@next`' : ''}
3. Start building in \`src/features/\`
4. Add environment variables in \`.env.local\`

---

Built with InitKit
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

function generateBarrelExport(featureName) {
  return `// ${featureName.toUpperCase()} Feature

// TODO: Export your components
// export { default as ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component } from './components/${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component';

// TODO: Export your hooks
// export { use${featureName.charAt(0).toUpperCase() + featureName.slice(1)} } from './hooks/use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}';

// TODO: Export your services
// export * from './services/${featureName}Service';

// TODO: Export your types
// export type * from './types/${featureName}.types';
`;
}
