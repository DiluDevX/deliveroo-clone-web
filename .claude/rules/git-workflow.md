# Git Workflow

## Branch Naming

- `main` — production branch
- `develop` — development branch
- `feature/*` — new features
- `fix/*` — bug fixes
- `chore/*` — maintenance tasks

## Commit Messages

Use conventional commits:

```
feat: add new user registration
fix: resolve login issue with expired tokens
docs: update API documentation
refactor: simplify error handling
test: add unit tests for auth service
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`

## Pre-commit

Husky runs before each commit:

- Lint check
- Type check
- Format check

## CI/CD

- PRs run quality checks (lint, type, format)
- Merges to `develop` trigger development releases
- Merges to `main` trigger production releases
- Semantic Release handles versioning and changelog

## NPM

- NEVER use `npm install` in CI — use `npm ci` for reproducible builds
- Use `npm ci` locally after pulling changes with updated dependencies
