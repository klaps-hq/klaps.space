# Contributing to Klaps

Thanks for your interest in contributing to Klaps! Here's how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/Biplo12/klaps.git
   cd klaps
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Create a `.env` file (see [README](README.md#environment-variables))
5. Start the dev server:
   ```bash
   bun run dev
   ```

## Branching

- `main` - production, protected
- `dev` - development, PRs target this branch

Create a feature branch from `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

## Code Style

- **TypeScript** - strict mode, no `any`
- **Tailwind CSS** - for all styling, no CSS files
- **Naming** - descriptive names, `handle` prefix for event handlers (e.g. `handleClick`)
- **Components** - arrow functions with `const`, typed props
- **Early returns** - prefer early returns for readability
- **Imports** - use `@/` path aliases

Run linting before committing:

```bash
bun run lint
```

## Pull Request Process

1. Make sure your code passes `bun run lint` and `bun run build`
2. Write a clear PR title and description
3. Target the `dev` branch
4. Keep PRs focused - one feature or fix per PR
5. If your change affects the UI, include a screenshot

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add city filter to screenings page
fix: correct date display in screening card
refactor: extract movie poster component
docs: update deployment instructions
```

## Reporting Bugs

Open an [issue](https://github.com/Biplo12/klaps/issues) with:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS info
- Screenshots if applicable

## Security

If you discover a security vulnerability, **do not** open a public issue. See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
