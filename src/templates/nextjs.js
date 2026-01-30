import fs from 'fs-extra';
import path from 'path';

/**
 * Generate Next.js project structure (folders only)
 * Next.js CLI creates all config files automatically
 */
export async function generateNextjsTemplate(projectPath, config) {
  // Create folder structure only
  await createNextjsFolderStructure(projectPath, config);

  // Generate package.json
  await generateNextjsPackageJson(projectPath, config);

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
    next: '^15.1.4',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
  };

  const devDependencies = {
    ...(isTypeScript && {
      '@types/node': '^22',
      '@types/react': '^19',
      '@types/react-dom': '^19',
      typescript: '^5',
    }),
  };

  // Add Tailwind v4
  if (styling === 'tailwind') {
    Object.assign(devDependencies, {
      tailwindcss: '^4.0.0',
    });
  }

  // Add libraries
  if (additionalLibraries.includes('tanstack-query')) {
    dependencies['@tanstack/react-query'] = '^5.62.15';
  }

  if (additionalLibraries.includes('zustand')) {
    dependencies['zustand'] = '^5.0.2';
  }

  if (additionalLibraries.includes('axios')) {
    dependencies['axios'] = '^1.7.9';
  }

  if (additionalLibraries.includes('zod')) {
    dependencies['zod'] = '^3.24.1';
  }

  if (additionalLibraries.includes('react-hook-form')) {
    dependencies['react-hook-form'] = '^7.54.2';
    dependencies['@hookform/resolvers'] = '^3.9.1';
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
${folderStructure === 'feature-based' ? `├── features/       # Feature modules
│   ├── auth/       # Authentication
│   ├── dashboard/  # Dashboard
│   └── users/      # Users
├── shared/         # Shared code
├── app/            # Next.js App Router` : `├── components/     # React components
├── hooks/          # Custom hooks
├── services/       # API services
├── app/            # Next.js App Router`}
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
