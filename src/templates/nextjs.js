import fs from 'fs-extra';
import path from 'path';

/**
 * Generate Next.js project structure and files
 */
export async function generateNextjsTemplate(projectPath, config) {
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

  // Determine structure type
  const useAppRouter = folderStructure !== 'pages-router';

  // Create folder structure
  await createNextjsFolderStructure(projectPath, folderStructure, useAppRouter);

  // Generate configuration files
  await generateNextjsConfig(projectPath, config);

  // Generate minimal app files
  await generateNextjsAppFiles(projectPath, ext, useAppRouter, styling);

  // Generate package.json with dependencies
  await generateNextjsPackageJson(projectPath, config);

  // Generate README
  await generateNextjsReadme(projectPath, config);

  // Create .env.example
  await generateNextjsEnvExample(projectPath, additionalLibraries);
}

async function createNextjsFolderStructure(projectPath, structure, useAppRouter) {
  const srcPath = path.join(projectPath, 'src');

  if (structure === 'feature-based') {
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
    await fs.ensureDir(path.join(srcPath, 'shared', 'constants'));

    // Create shared barrel exports
    await fs.writeFile(
      path.join(srcPath, 'shared', 'components', 'index.ts'),
      generateSharedComponentsExport()
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

async function generateNextjsConfig(projectPath, config) {
  const { language, typescriptStrict, styling, features } = config;
  const isTypeScript = language === 'typescript';

  // next.config.js
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
};

export default nextConfig;
`;
  await fs.writeFile(path.join(projectPath, 'next.config.js'), nextConfig);

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
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        ...strictness[typescriptStrict],
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: {
          '@/*': ['./src/*'],
          '@/components/*': ['./src/components/*'],
          '@/lib/*': ['./src/lib/*'],
          '@/types/*': ['./src/types/*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });
  }

  // .eslintrc.json
  const eslintConfig = {
    extends: [
      'next/core-web-vitals',
      'eslint:recommended',
      ...(isTypeScript ? ['plugin:@typescript-eslint/recommended'] : []),
      ...(features.includes('prettier') ? ['prettier'] : []),
    ],
    ...(isTypeScript && {
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
    }),
    rules: {
      ...(isTypeScript && {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
      }),
      'prefer-const': 'error',
      'no-console': 'warn',
    },
  };

  await fs.writeJSON(path.join(projectPath, '.eslintrc.json'), eslintConfig, { spaces: 2 });

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
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
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

async function generateNextjsAppFiles(projectPath, ext, useAppRouter, styling) {
  const srcPath = path.join(projectPath, 'src');

  if (useAppRouter) {
    // App Router files
    const layoutContent = `import type { Metadata } from 'next';
${styling === 'tailwind' ? "import './globals.css';" : ''}

export const metadata: Metadata = {
  title: 'My App',
  description: 'Created with InitKit',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;

    const pageContent = `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Your App</h1>
      <p className="mt-4 text-lg text-gray-600">
        Start building by editing files in the features folder
      </p>
    </main>
  );
}
`;

    await fs.writeFile(path.join(srcPath, 'app', `layout.${ext}`), layoutContent);
    await fs.writeFile(path.join(srcPath, 'app', `page.${ext}`), pageContent);

    // globals.css
    if (styling === 'tailwind') {
      const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
      await fs.writeFile(path.join(srcPath, 'app', 'globals.css'), globalsCss);
    }
  } else {
    // Pages Router files
    const appContent = `import type { AppProps } from 'next/app';
${styling === 'tailwind' ? "import '../styles/globals.css';" : ''}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
`;

    const indexContent = `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Your App</h1>
      <p className="mt-4 text-lg text-gray-600">
        Start building by editing files in the features folder
      </p>
    </main>
  );
}
`;

    await fs.writeFile(path.join(srcPath, 'pages', `_app.${ext}`), appContent);
    await fs.writeFile(path.join(srcPath, 'pages', `index.${ext}`), indexContent);
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
}

async function generateNextjsPackageJson(projectPath, config) {
  const { language, styling, additionalLibraries = [], features = [], packageManager } = config;
  const isTypeScript = language === 'typescript';

  const dependencies = {
    next: '^14.2.0',
    react: '^18.3.0',
    'react-dom': '^18.3.0',
  };

  const devDependencies = {
    ...(isTypeScript && {
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18',
      typescript: '^5',
    }),
    eslint: '^8',
    'eslint-config-next': '14.2.0',
  };

  // Add Tailwind dependencies
  if (styling === 'tailwind') {
    Object.assign(devDependencies, {
      tailwindcss: '^3.4.0',
      postcss: '^8',
      autoprefixer: '^10.4.0',
    });
    Object.assign(dependencies, {
      clsx: '^2.1.0',
      'tailwind-merge': '^2.2.0',
    });
  }

  // Add additional libraries
  if (additionalLibraries.includes('react-query')) {
    dependencies['@tanstack/react-query'] = '^5.28.0';
    devDependencies['@tanstack/react-query-devtools'] = '^5.28.0';
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

  // Add feature dependencies
  if (features.includes('prettier')) {
    devDependencies['prettier'] = '^3.2.0';
    devDependencies['eslint-config-prettier'] = '^9.1.0';
  }

  if (isTypeScript && features.includes('eslint')) {
    devDependencies['@typescript-eslint/eslint-plugin'] = '^7.0.0';
    devDependencies['@typescript-eslint/parser'] = '^7.0.0';
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
      ...(features.includes('prettier') && {
        'format': 'prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"',
        'format:check': 'prettier --check "**/*.{ts,tsx,js,jsx,json,css,md}"',
      }),
    },
    dependencies,
    devDependencies,
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
}

async function generateNextjsReadme(projectPath, config) {
  const { projectName, folderStructure, language, styling, packageManager } = config;

  const readme = `# ${projectName}

Created with InitKit CLI

## Project Structure

This project uses a **${folderStructure}** folder structure.

### Directory Layout

\`\`\`
src/
${folderStructure === 'feature-based' ? `├── features/          # Feature modules
│   ├── auth/          # Authentication feature
│   ├── dashboard/     # Dashboard feature
│   └── users/         # Users feature
├── shared/            # Shared components and utilities
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Utility functions` : `├── components/        # React components
│   ├── ui/            # UI components
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── services/          # API services
└── utils/             # Utility functions`}
├── app/               # Next.js App Router
└── lib/               # Library code and utilities
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

- Next.js 14
- React 18
${language === 'typescript' ? '- TypeScript' : '- JavaScript'}
${styling === 'tailwind' ? '- Tailwind CSS' : ''}

## Next Steps

- [ ] Add your features in \`src/features/\`
- [ ] Build reusable components in \`src/shared/components/\`
- [ ] Set up environment variables in \`.env.local\`
- [ ] Configure database connection (if needed)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
${styling === 'tailwind' ? '- [Tailwind CSS Documentation](https://tailwindcss.com/docs)' : ''}

---

Built with InitKit
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

async function generateNextjsEnvExample(projectPath, libraries) {
  let envContent = `# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

`;

  if (libraries.includes('axios') || libraries.some(lib => lib.includes('api'))) {
    envContent += `# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

`;
  }

  envContent += `# Add your environment variables here
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envContent);
}

function generateBarrelExport(featureName) {
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

function generateSharedComponentsExport() {
  return `// Export UI components
// export { Button } from './ui/Button';
// export { Input } from './ui/Input';
// export { Card } from './ui/Card';

// Export layout components
// export { Header } from './layout/Header';
// export { Footer } from './layout/Footer';

// TODO: Add shared components
`;
}
