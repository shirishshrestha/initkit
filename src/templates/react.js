import fs from 'fs-extra';
import path from 'path';

/**
 * Generate React + Vite project structure and files
 */
export async function generateReactTemplate(projectPath, config) {
  const {
    language = 'typescript',
    folderStructure = 'feature-based',
    styling = 'tailwind',
    typescriptStrict = 'strict',
    additionalLibraries = [],
    features = [],
  } = config;

  const isTypeScript = language === 'typescript';
  const ext = isTypeScript ? 'tsx' : 'jsx';
  const configExt = isTypeScript ? 'ts' : 'js';

  // Create folder structure
  await createReactFolderStructure(projectPath, folderStructure);

  // Generate configuration files
  await generateReactConfig(projectPath, config);

  // Generate app files
  await generateReactAppFiles(projectPath, ext, styling);

  // Generate package.json
  await generateReactPackageJson(projectPath, config);

  // Generate README
  await generateReactReadme(projectPath, config);

  // Create index.html
  await generateReactIndexHtml(projectPath, config);

  // Create .env.example
  await generateReactEnvExample(projectPath, additionalLibraries);
}

async function createReactFolderStructure(projectPath, structure) {
  const srcPath = path.join(projectPath, 'src');

  if (structure === 'feature-based') {
    // Feature-based structure
    const features = ['auth', 'dashboard', 'users'];
    for (const feature of features) {
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'components'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'hooks'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'services'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'types'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'store'));

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
    await fs.ensureDir(path.join(srcPath, 'shared', 'constants'));

    await fs.writeFile(
      path.join(srcPath, 'shared', 'components', 'index.ts'),
      generateSharedExport()
    );
  } else if (structure === 'component-based') {
    // Component-based structure
    await fs.ensureDir(path.join(srcPath, 'components', 'ui'));
    await fs.ensureDir(path.join(srcPath, 'components', 'layout'));
    await fs.ensureDir(path.join(srcPath, 'components', 'forms'));
    await fs.ensureDir(path.join(srcPath, 'components', 'common'));
    await fs.ensureDir(path.join(srcPath, 'hooks'));
    await fs.ensureDir(path.join(srcPath, 'services'));
    await fs.ensureDir(path.join(srcPath, 'utils'));
    await fs.ensureDir(path.join(srcPath, 'types'));
    await fs.ensureDir(path.join(srcPath, 'store', 'slices'));
    await fs.ensureDir(path.join(srcPath, 'pages'));
  } else if (structure === 'atomic') {
    // Atomic design structure
    await fs.ensureDir(path.join(srcPath, 'components', 'atoms'));
    await fs.ensureDir(path.join(srcPath, 'components', 'molecules'));
    await fs.ensureDir(path.join(srcPath, 'components', 'organisms'));
    await fs.ensureDir(path.join(srcPath, 'components', 'templates'));
    await fs.ensureDir(path.join(srcPath, 'pages'));
    await fs.ensureDir(path.join(srcPath, 'hooks'));
    await fs.ensureDir(path.join(srcPath, 'services'));
    await fs.ensureDir(path.join(srcPath, 'store'));
    await fs.ensureDir(path.join(srcPath, 'utils'));
  }

  // Common directories
  await fs.ensureDir(path.join(srcPath, 'routes'));
  await fs.ensureDir(path.join(srcPath, 'lib'));
  await fs.ensureDir(path.join(projectPath, 'public'));
}

async function generateReactConfig(projectPath, config) {
  const { language, typescriptStrict, styling, features } = config;
  const isTypeScript = language === 'typescript';

  // vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
`;
  await fs.writeFile(path.join(projectPath, 'vite.config.ts'), viteConfig);

  // tsconfig.json (if TypeScript)
  if (isTypeScript) {
    const strictness = {
      strict: {
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      moderate: {
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
      relaxed: {
        strict: false,
        noImplicitAny: false,
      },
    };

    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        ...strictness[typescriptStrict],
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
          '@/components/*': ['./src/components/*'],
          '@/hooks/*': ['./src/hooks/*'],
          '@/lib/*': ['./src/lib/*'],
          '@/utils/*': ['./src/utils/*'],
          '@/types/*': ['./src/types/*'],
        },
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });

    // tsconfig.node.json
    const tsConfigNode = {
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowSyntheticDefaultImports: true,
      },
      include: ['vite.config.ts'],
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.node.json'), tsConfigNode, { spaces: 2 });
  }

  // .eslintrc.cjs
  const eslintConfig = `module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
${isTypeScript ? `    'plugin:@typescript-eslint/recommended',` : ''}
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
${features.includes('prettier') ? `    'prettier',` : ''}
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
${isTypeScript ? `  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],` : `  plugins: ['react-refresh'],`}
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
${isTypeScript ? `    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',` : ''}
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
`;
  await fs.writeFile(path.join(projectPath, '.eslintrc.cjs'), eslintConfig);

  // .prettierrc (if selected)
  if (features.includes('prettier')) {
    const prettierConfig = {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      arrowParens: 'always',
      endOfLine: 'lf',
    };
    await fs.writeJSON(path.join(projectPath, '.prettierrc'), prettierConfig, { spaces: 2 });
  }

  // Tailwind config (if selected)
  if (styling === 'tailwind') {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
    await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
    await fs.writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig);
  }

  // .editorconfig
  if (features.includes('editorconfig')) {
    const editorConfig = `root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
`;
    await fs.writeFile(path.join(projectPath, '.editorconfig'), editorConfig);
  }
}

async function generateReactAppFiles(projectPath, ext, styling) {
  const srcPath = path.join(projectPath, 'src');

  // App.tsx
  const appContent = `function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to Your React App</h1>
      <p className="mt-4 text-lg text-gray-600">
        Start building by editing files in the features folder
      </p>
    </div>
  );
}

export default App;
`;

  await fs.writeFile(path.join(srcPath, `App.${ext}`), appContent);

  // main.tsx
  const mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
${styling === 'tailwind' ? "import './index.css';" : ''}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  await fs.writeFile(path.join(srcPath, `main.${ext}`), mainContent);

  // index.css (Tailwind)
  if (styling === 'tailwind') {
    const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  body {
    @apply bg-background text-foreground;
  }
}
`;
    await fs.writeFile(path.join(srcPath, 'index.css'), indexCss);
  }

  // lib/utils.ts (for Tailwind)
  if (styling === 'tailwind') {
    const utilsContent = `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
    await fs.writeFile(path.join(srcPath, 'lib', 'utils.ts'), utilsContent);
  }

  // vite-env.d.ts (TypeScript)
  const viteEnvContent = `/// <reference types="vite/client" />
`;
  await fs.writeFile(path.join(srcPath, 'vite-env.d.ts'), viteEnvContent);
}

async function generateReactIndexHtml(projectPath, config) {
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${config.language === 'typescript' ? 'tsx' : 'jsx'}"></script>
  </body>
</html>
`;

  await fs.writeFile(path.join(projectPath, 'index.html'), indexHtml);
}

async function generateReactPackageJson(projectPath, config) {
  const { language, styling, additionalLibraries = [], features = [] } = config;
  const isTypeScript = language === 'typescript';

  const dependencies = {
    react: '^18.3.1',
    'react-dom': '^18.3.1',
  };

  const devDependencies = {
    '@vitejs/plugin-react': '^4.2.1',
    vite: '^5.2.0',
    ...(isTypeScript && {
      '@types/react': '^18.3.0',
      '@types/react-dom': '^18.3.0',
      typescript: '^5.4.3',
    }),
    eslint: '^8.57.0',
    'eslint-plugin-react-hooks': '^4.6.0',
    'eslint-plugin-react-refresh': '^0.4.6',
  };

  // Add router
  if (additionalLibraries.includes('react-router')) {
    dependencies['react-router-dom'] = '^6.22.3';
  }

  // Add Tailwind
  if (styling === 'tailwind') {
    Object.assign(devDependencies, {
      tailwindcss: '^3.4.1',
      autoprefixer: '^10.4.19',
      postcss: '^8.4.38',
    });
    Object.assign(dependencies, {
      clsx: '^2.1.0',
      'tailwind-merge': '^2.2.0',
    });
  }

  // Add libraries
  if (additionalLibraries.includes('react-query')) {
    dependencies['@tanstack/react-query'] = '^5.28.0';
  }

  if (additionalLibraries.includes('zustand')) {
    dependencies['zustand'] = '^4.5.2';
  }

  if (additionalLibraries.includes('axios')) {
    dependencies['axios'] = '^1.6.8';
  }

  if (additionalLibraries.includes('zod')) {
    dependencies['zod'] = '^3.22.0';
  }

  if (additionalLibraries.includes('react-hook-form')) {
    dependencies['react-hook-form'] = '^7.51.0';
    dependencies['@hookform/resolvers'] = '^3.3.0';
  }

  // Add features
  if (features.includes('prettier')) {
    devDependencies['prettier'] = '^3.2.5';
    devDependencies['eslint-config-prettier'] = '^9.1.0';
  }

  if (isTypeScript) {
    devDependencies['@typescript-eslint/eslint-plugin'] = '^7.2.0';
    devDependencies['@typescript-eslint/parser'] = '^7.2.0';
  }

  const packageJson = {
    name: config.projectName,
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: isTypeScript ? 'tsc && vite build' : 'vite build',
      preview: 'vite preview',
      lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
      'lint:fix': 'eslint . --ext ts,tsx --fix',
      ...(isTypeScript && { 'type-check': 'tsc --noEmit' }),
      ...(features.includes('prettier') && {
        format: 'prettier --write "src/**/*.{ts,tsx,json,css,md}"',
        'format:check': 'prettier --check "src/**/*.{ts,tsx,json,css,md}"',
      }),
    },
    dependencies,
    devDependencies,
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
}

async function generateReactReadme(projectPath, config) {
  const { projectName, folderStructure, language, styling, packageManager } = config;

  const readme = `# ${projectName}

Created with InitKit CLI

## Project Structure

This project uses a **${folderStructure}** folder structure.

### Directory Layout

\`\`\`
src/
${
  folderStructure === 'feature-based'
    ? `├── features/          # Feature modules
│   ├── auth/          # Authentication
│   ├── dashboard/     # Dashboard
│   └── users/         # Users
├── shared/            # Shared code
│   ├── components/    # Reusable components
│   ├── hooks/         # Custom hooks
│   └── utils/         # Utilities`
    : `├── components/        # React components
│   ├── ui/            # UI components
│   └── layout/        # Layout components
├── hooks/             # Custom hooks
├── services/          # API services
└── pages/             # Page components`
}
├── routes/            # Routing configuration
├── lib/               # Library code
└── App.tsx            # Root component
\`\`\`

## Getting Started

1. Install dependencies:
   \`\`\`bash
   ${packageManager} install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   ${packageManager} ${packageManager === 'npm' ? 'run ' : ''}dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- React 18
- Vite 5
${language === 'typescript' ? '- TypeScript' : '- JavaScript'}
${styling === 'tailwind' ? '- Tailwind CSS' : ''}

## Next Steps

- [ ] Build your features in \`src/features/\`
- [ ] Add shared components in \`src/shared/components/\`
- [ ] Set up routing in \`src/routes/\`
- [ ] Configure environment variables in \`.env\`

---

Built with InitKit
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

async function generateReactEnvExample(projectPath, libraries) {
  let envContent = `# API Configuration
VITE_API_URL=http://localhost:3001/api

`;

  envContent += `# Add your environment variables here
# Note: Only variables prefixed with VITE_ are exposed to the client
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envContent);
}

function generateFeatureExport(featureName) {
  return `// Export ${featureName} components
// export { Component } from './components/Component';

// Export ${featureName} hooks
// export { useHook } from './hooks/useHook';

// Export ${featureName} services
// export { service } from './services/service';

// Export ${featureName} types
// export type * from './types/${featureName}.types';

// TODO: Implement ${featureName} feature
`;
}

function generateSharedExport() {
  return `// Export shared components
// export { Button } from './ui/Button';
// export { Input } from './ui/Input';
// export { Header } from './layout/Header';

// TODO: Add shared components
`;
}
