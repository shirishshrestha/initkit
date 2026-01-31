import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { getLatestVersion } from '../utils/versionFetcher.js';

/**
 * Fetch latest version with fallback
 */
async function fetchVersion(packageName, fallback = 'latest') {
  try {
    const version = await getLatestVersion(packageName);
    return `^${version}`;
  } catch {
    return fallback;
  }
}

/**
 * Generate React + Vite project with modern build tooling
 *
 * Creates a React single-page application using Vite for:
 * - Fast HMR (Hot Module Replacement)
 * - Optimized production builds
 * - TypeScript or JavaScript support
 * - Multiple folder structure patterns
 *
 * Generated project includes:
 * - Vite configuration with React plugin
 * - Folder structure based on preference
 * - Package.json with React 18+ and Vite dependencies
 * - README with getting started instructions
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User configuration object
 * @param {string} config.projectName - Name of the project
 * @param {string} config.language - Programming language ('typescript'|'javascript')
 * @param {string} [config.folderStructure='feature-based'] - Folder organization pattern
 *   - 'feature-based': Organize by features/modules (recommended)
 *   - 'component-based': Organize by component types (pages, components, layouts)
 *   - 'type-based': Organize by file type (components, hooks, utils, services)
 * @param {string} config.packageManager - Package manager to use
 *
 * @returns {Promise<void>}
 *
 * @example
 * // Create React + Vite project with feature-based structure
 * await generateReactTemplate('/path/to/project', {
 *   projectName: 'my-react-app',
 *   language: 'typescript',
 *   folderStructure: 'feature-based',
 *   packageManager: 'npm'
 * });
 */
export async function generateReactTemplate(projectPath, config) {
  // Create folder structure only
  await createReactFolderStructure(projectPath, config);

  // Generate package.json
  await generateReactPackageJson(projectPath, config);

  // Generate essential files (App.jsx, main.jsx, index.css, vite.config)
  await generateReactEssentialFiles(projectPath, config);

  // Generate README
  await generateReactReadme(projectPath, config);
}

async function createReactFolderStructure(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  const folderStructure = config.folderStructure || 'feature-based';

  if (folderStructure === 'feature-based') {
    // Feature-based structure
    const features = ['auth', 'dashboard', 'users'];
    for (const feature of features) {
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'components'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'hooks'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'services'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'types'));

      // Barrel export
      await fs.writeFile(
        path.join(srcPath, 'features', feature, 'index.ts'),
        generateFeatureExport(feature)
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
  } else if (folderStructure === 'atomic') {
    // Atomic design structure
    await fs.ensureDir(path.join(srcPath, 'components', 'atoms'));
    await fs.ensureDir(path.join(srcPath, 'components', 'molecules'));
    await fs.ensureDir(path.join(srcPath, 'components', 'organisms'));
    await fs.ensureDir(path.join(srcPath, 'components', 'templates'));
    await fs.ensureDir(path.join(srcPath, 'pages'));
    await fs.ensureDir(path.join(srcPath, 'hooks'));
    await fs.ensureDir(path.join(srcPath, 'services'));
  }

  // Common directories
  await fs.ensureDir(path.join(srcPath, 'routes'));
  await fs.ensureDir(path.join(srcPath, 'lib'));
  await fs.ensureDir(path.join(projectPath, 'public'));
}

async function generateReactPackageJson(projectPath, config) {
  const { language, styling, additionalLibraries = [] } = config;
  const isTypeScript = language === 'typescript';

  const spinner = ora('Fetching latest package versions...').start();

  try {
    // Fetch core dependencies
    const [reactVer, reactDomVer, viteVer, pluginVer] = await Promise.all([
      fetchVersion('react'),
      fetchVersion('react-dom'),
      fetchVersion('vite'),
      fetchVersion('@vitejs/plugin-react'),
    ]);

    const dependencies = {
      react: reactVer,
      'react-dom': reactDomVer,
    };

    const devDependencies = {
      '@vitejs/plugin-react': pluginVer,
      vite: viteVer,
    };

    // TypeScript dependencies
    if (isTypeScript) {
      const [tsVer, typesReactVer, typesReactDomVer] = await Promise.all([
        fetchVersion('typescript'),
        fetchVersion('@types/react'),
        fetchVersion('@types/react-dom'),
      ]);
      devDependencies['typescript'] = tsVer;
      devDependencies['@types/react'] = typesReactVer;
      devDependencies['@types/react-dom'] = typesReactDomVer;
    }

    // Add router
    if (additionalLibraries.includes('react-router')) {
      dependencies['react-router-dom'] = await fetchVersion('react-router-dom');
    }

    // Add Tailwind
    if (styling === 'tailwind') {
      devDependencies['tailwindcss'] = await fetchVersion('tailwindcss');
    }

    // Add libraries
    if (additionalLibraries.includes('tanstack-query')) {
      dependencies['@tanstack/react-query'] = await fetchVersion('@tanstack/react-query');
    }

    if (additionalLibraries.includes('redux-toolkit')) {
      const [reduxVer, reactReduxVer] = await Promise.all([
        fetchVersion('@reduxjs/toolkit'),
        fetchVersion('react-redux'),
      ]);
      dependencies['@reduxjs/toolkit'] = reduxVer;
      dependencies['react-redux'] = reactReduxVer;
    }

    if (additionalLibraries.includes('zustand')) {
      dependencies['zustand'] = await fetchVersion('zustand');
    }

    if (additionalLibraries.includes('jotai')) {
      dependencies['jotai'] = await fetchVersion('jotai');
    }

    if (additionalLibraries.includes('axios')) {
      dependencies['axios'] = await fetchVersion('axios');
    }

    if (additionalLibraries.includes('zod')) {
      dependencies['zod'] = await fetchVersion('zod');
    }

    if (additionalLibraries.includes('react-hook-form')) {
      const [formVer, resolversVer] = await Promise.all([
        fetchVersion('react-hook-form'),
        fetchVersion('@hookform/resolvers'),
      ]);
      dependencies['react-hook-form'] = formVer;
      dependencies['@hookform/resolvers'] = resolversVer;
    }

    if (additionalLibraries.includes('framer-motion')) {
      dependencies['framer-motion'] = await fetchVersion('framer-motion');
    }

    if (additionalLibraries.includes('react-icons')) {
      dependencies['react-icons'] = await fetchVersion('react-icons');
    }

    if (additionalLibraries.includes('radix-ui')) {
      const [dialogVer, dropdownVer, selectVer, slotVer] = await Promise.all([
        fetchVersion('@radix-ui/react-dialog'),
        fetchVersion('@radix-ui/react-dropdown-menu'),
        fetchVersion('@radix-ui/react-select'),
        fetchVersion('@radix-ui/react-slot'),
      ]);
      Object.assign(dependencies, {
        '@radix-ui/react-dialog': dialogVer,
        '@radix-ui/react-dropdown-menu': dropdownVer,
        '@radix-ui/react-select': selectVer,
        '@radix-ui/react-slot': slotVer,
      });
    }

    spinner.succeed(chalk.green('Fetched latest versions'));

    const packageJson = {
      name: config.projectName,
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: isTypeScript ? 'tsc && vite build' : 'vite build',
        preview: 'vite preview',
      },
      dependencies,
      devDependencies,
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
  } catch (error) {
    spinner.fail(chalk.yellow('Could not fetch versions, using fallbacks'));

    // Fallback with latest tag
    const dependencies = { react: 'latest', 'react-dom': 'latest' };
    const devDependencies = {
      '@vitejs/plugin-react': 'latest',
      vite: 'latest',
      ...(isTypeScript && {
        typescript: 'latest',
        '@types/react': 'latest',
        '@types/react-dom': 'latest',
      }),
    };

    const packageJson = {
      name: config.projectName,
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: isTypeScript ? 'tsc && vite build' : 'vite build',
        preview: 'vite preview',
      },
      dependencies,
      devDependencies,
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
  }
}

async function generateReactEssentialFiles(projectPath, config) {
  const { language } = config;
  const isTypeScript = language === 'typescript';
  const ext = isTypeScript ? 'tsx' : 'jsx';
  const srcPath = path.join(projectPath, 'src');

  // Create App component
  const appContent = `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Welcome to ${config.projectName}</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.${ext}</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  )
}

export default App
`;

  await fs.writeFile(path.join(srcPath, `App.${ext}`), appContent);

  // Create main entry point
  const mainContent = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.${ext}'

createRoot(document.getElementById('root')${isTypeScript ? '!' : ''}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;

  await fs.writeFile(path.join(srcPath, `main.${ext}`), mainContent);

  // Create index.css
  const indexCssContent = `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
`;

  await fs.writeFile(path.join(srcPath, 'index.css'), indexCssContent);

  // Create App.css
  const appCssContent = `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
`;

  await fs.writeFile(path.join(srcPath, 'App.css'), appCssContent);

  // Create vite.config
  const viteConfigContent = isTypeScript
    ? `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
`
    : `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
`;

  await fs.writeFile(
    path.join(projectPath, `vite.config.${isTypeScript ? 'ts' : 'js'}`),
    viteConfigContent
  );

  // Create index.html in project root
  const indexHtmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${ext}"></script>
  </body>
</html>
`;

  await fs.writeFile(path.join(projectPath, 'index.html'), indexHtmlContent);

  // Create .gitignore
  const gitignoreContent = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);
}

async function generateReactReadme(projectPath, config) {
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

- **React 18** - UI library
- **Vite 6** - Build tool${language === 'typescript' ? '\n- **TypeScript** - Type safety' : ''}${styling === 'tailwind' ? '\n- **Tailwind CSS v4** - Styling' : ''}

## Folder Structure

\`\`\`
src/
${
  folderStructure === 'feature-based'
    ? `├── features/       # Feature modules
│   ├── auth/       # Authentication
│   ├── dashboard/  # Dashboard
│   └── users/      # Users
├── shared/         # Shared code`
    : folderStructure === 'atomic'
      ? `├── components/     # Atomic design
│   ├── atoms/      # Basic UI elements
│   ├── molecules/  # Simple components
│   ├── organisms/  # Complex components
│   └── templates/  # Page templates
├── pages/          # Page components`
      : `├── components/     # React components
│   ├── ui/         # UI components
│   └── layout/     # Layout components
├── hooks/          # Custom hooks
├── services/       # API services`
}
├── routes/         # Routing configuration
├── lib/            # Utilities
└── public/         # Static files
\`\`\`

## Next Steps

1. Run \`npm create vite@latest . -- --template react${language === 'typescript' ? '-ts' : ''}\` to initialize Vite${styling === 'tailwind' ? '\n2. Install Tailwind v4: `' + packageManager + (packageManager === 'npm' ? ' install' : ' add') + ' tailwindcss@next`' : ''}
3. Start building in \`src/features/\`
4. Add environment variables in \`.env\`

---

Built with InitKit
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

function generateFeatureExport(featureName) {
  return `// ${featureName.toUpperCase()} Feature

// TODO: Export your components
// export { ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component } from './components/${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component';

// TODO: Export your hooks
// export { use${featureName.charAt(0).toUpperCase() + featureName.slice(1)} } from './hooks/use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}';

// TODO: Export your services
// export * from './services/${featureName}Service';

// TODO: Export your types
// export type * from './types/${featureName}.types';
`;
}
