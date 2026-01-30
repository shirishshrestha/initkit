# InitKit A powerful CLI tool for scaffolding web projects with best practices. **Built with ES Modules** - Modern JavaScript using native import/export syntax. ## 📚 Documentation - **[User Guide](./docs/user-guide.md)** - Complete usage guide with examples
- **[API Reference](./docs/api-reference.md)** - Programmatic API documentation
- **[Architecture](./docs/architecture.md)** - Technical architecture and design
- **[Examples](./docs/examples.md)** - Real-world examples and use cases
- **[Build Summary](./docs/BUILD_SUMMARY.md)** - Implementation details ## Features - 🎨 **Multiple Frameworks** - React, Vue, Angular, Svelte, Next.js, Express, NestJS, and more
- 📘 **TypeScript Support** - First-class TypeScript support with configurable strictness
- 🗄 **Database Integration** - PostgreSQL, MySQL, MongoDB, SQLite
- 🎯 **Smart Validation** - Real-time input validation with helpful suggestions
- 🔄 **Automatic Rollback** - Cleanup on failure with graceful error handling
- 🛠 **Development Tools** - ESLint, Prettier, Jest, Docker, CI/CD out of the box
- 📦 **Package Manager Choice** - Support for npm, yarn, and pnpm
- 🎨 **Styling Solutions** - Tailwind CSS, CSS Modules, Styled Components, Sass, and more
- **Fast & Reliable** - Optimized for speed with comprehensive error handling ## Installation ```bash
npm install -g initkit
``` ## Usage ### Interactive Mode ```bash
initkit
``` ### Quick Start ```bash
# Create a new project
initkit my-awesome-project # Use a specific template
initkit my-app --template react # Skip prompts and use defaults
initkit my-app --yes
``` ## Features - 🎨 **Multiple Frontend Frameworks**: React, Vue, Angular, Svelte, Next.js, Nuxt.js
- **Backend Frameworks**: Express, Fastify, Koa, NestJS, Hapi
- 🗄 **Database Support**: PostgreSQL, MySQL, MongoDB, SQLite
- 📘 **TypeScript Support**: Optional TypeScript configuration
- 🎨 **Styling Solutions**: Tailwind CSS, Sass, CSS Modules, Styled Components
- 🛠 **Developer Tools**: ESLint, Prettier, Husky, Jest
- 🐳 **Docker Ready**: Optional Docker configuration
- 🚀 **CI/CD**: GitHub Actions workflows ## Command Line Options ```
Usage: initkit [options] [project-name] Options: -V, --version output the version number -t, --template <template> Specify template (react, vue, express, etc.) -y, --yes Skip prompts and use defaults --typescript Use TypeScript --no-git Skip Git initialization -h, --help display help for command
``` ## Development ```bash
# Clone the repository
git clone https://github.com/yourusername/initkit.git
cd initkit # Install dependencies
npm install # Run locally
npm start # Run tests
npm test # Lint code
npm run lint
``` ## License MIT