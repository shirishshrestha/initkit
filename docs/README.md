# 📚 InitKit CLI Documentation

Welcome to the InitKit CLI documentation! InitKit is a powerful command-line tool for scaffolding modern web projects with best practices built-in.

---

## Table of Contents

### 🚀 Getting Started

1. **[User Guide](./user-guide.md)**
   - Installation & setup
   - Command reference
   - Interactive prompts
   - Usage examples
   - Troubleshooting

2. **[Examples & Use Cases](./examples.md)**
   - Quick start examples
   - Frontend/Backend/Fullstack projects
   - Library scaffolding
   - CI/CD integration

### 🔧 Technical Documentation

3. **[Architecture](./architecture.md)**
   - Project structure
   - Core components
   - Data flow diagrams
   - Module responsibilities
   - Error handling strategy

4. **[API Reference](./api-reference.md)**
   - Programmatic API
   - Validation utilities
   - Error handling classes
   - Type definitions

### 📋 Changelog & Updates

5. **[Template Refactoring](./TEMPLATE_REFACTORING.md)**
   - v2.0 template system changes
   - Migration guide
   - Tailwind v4 update

6. **[Phase 3 Implementation](./PHASE_3_IMPLEMENTATION.md)**
   - Frontend template generators
   - Framework support details

7. **[Build Summary](./BUILD_SUMMARY.md)**
   - Initial implementation notes
   - Feature completion status

8. **[Documentation Improvements](./DOCUMENTATION_IMPROVEMENTS.md)**
   - Documentation changelog
   - Content enhancements

---

## 🚀 Quick Start

### Installation

```bash
npm install -g initkit
```

### Basic Usage

```bash
# Interactive mode (recommended)
initkit

# Quick start with defaults
initkit create my-project --yes

# Specific project type
initkit create my-app --template react
```

### Commands
- `initkit create [project-name]` - Create a new project
- `initkit list` - Show available templates
- `initkit info` - Display CLI information
- `initkit --version` - Show version number
- `initkit --help` - Show help information

## 📖 Documentation Sections

### For End Users

#### [User Guide](./user-guide.md)
Start here if you want to use InitKit to create projects. Covers:
- All CLI commands and options
- Step-by-step interactive prompts
- Configuration options
- Examples and troubleshooting

#### [Examples & Use Cases](./examples.md)
Real-world examples for:
- Different project types (React, Vue, Express, etc.)
- Advanced usage scenarios
- CI/CD integration
- Batch project creation
- Team setups

### For Developers

#### [Architecture](./architecture.md)
Understanding InitKit's internals:
- How the CLI is structured
- Component relationships
- Error handling mechanisms
- How to extend InitKit
- Best practices

#### [API Reference](./api-reference.md)
Using InitKit programmatically:
- Public API methods
- Validation functions
- Error classes and codes
- Utility functions
- Type definitions

## 🌟 Key Features

### Comprehensive Project Templates
-  Frontend frameworks (React, Vue, Angular, Svelte, etc.)
-  Backend frameworks (Express, Fastify, NestJS, etc.)
-  Full-stack combinations
-  Node.js library scaffolding

### Smart Configuration
-  TypeScript or JavaScript
-  Multiple folder structures
-  CSS frameworks (Tailwind, Sass, etc.)
-  Database integration
-  Package manager choice (npm, yarn, pnpm)

### Development Tools
-  ESLint & Prettier
-  Testing frameworks (Jest, Vitest)
-  Git hooks (Husky)
-  Docker configuration
-  CI/CD workflows
-  EditorConfig

### Developer Experience
-  Interactive prompts with validation
-  Real-time input feedback
-  Helpful error messages
-  Automatic rollback on failure
-  Verbose mode for debugging
-  Non-interactive mode for automation

## 🎯 Use Cases

### Learning & Experimentation
- Quickly spin up projects to learn new frameworks
- Experiment with different tech stacks
- Follow tutorials with proper setup

### Production Projects
- Start new projects with best practices
- Consistent team setup
- Enterprise-ready configurations

### Microservices
- Create multiple services quickly
- Consistent architecture across services
- Docker and CI/CD ready

### Open Source
- Library scaffolding with testing
- Proper documentation structure
- Publishing-ready configuration

## 🔧 Core Concepts

### Project Types
1. **Frontend Only** - Client-side applications
2. **Backend Only** - APIs and server applications
3. **Full Stack** - Combined frontend and backend
4. **Library** - NPM packages and modules

### Interactive vs Non-Interactive
- **Interactive Mode**: Step-by-step prompts (default)
- **Non-Interactive Mode**: Use defaults with `--yes` flag

### Validation & Error Handling
- Real-time input validation
- npm package name compliance
- Directory existence checks
- Automatic project rollback on errors
- Graceful shutdown handling

## 📝 Contributing

Want to contribute to InitKit? Check out our [Contributing Guide](../CONTRIBUTING.md) for:
- Development setup
- Code style guidelines
- Pull request process
- Testing requirements

## 🐛 Troubleshooting

Common issues and solutions:

### Project Name Validation Errors
See [User Guide - Troubleshooting](./user-guide.md#troubleshooting)

### Installation Failures
See [User Guide - Installation Failures](./user-guide.md#installation-failures)

### Permission Issues
See [User Guide - Permission Denied Errors](./user-guide.md#permission-denied-errors)

## 🆘 Getting Help

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Search this documentation
- **Examples**: Check the examples guide
- **Community**: Join discussions on GitHub

## 📚 Further Reading

### Internal Documentation
- [User Guide](./user-guide.md) - Comprehensive usage guide
- [Architecture](./architecture.md) - Technical architecture
- [API Reference](./api-reference.md) - Programming interface
- [Examples](./examples.md) - Practical examples

### External Resources
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Ora](https://github.com/sindresorhus/ora) - Spinners

## 📄 License

InitKit CLI is MIT licensed. See [LICENSE](../LICENSE) for details.

---

**Version**: 1.0.0  
**Last Updated**: January 30, 2026  
**Status**: Production Ready

