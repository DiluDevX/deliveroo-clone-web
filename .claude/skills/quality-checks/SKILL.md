# Quality Checks Skill

Run quality checks before any commit or PR.

## Commands

```bash
# Type check
npm run types:check

# Lint
npm run lint:check

# Format check
npm run format:check

# All checks
npm run types:check && npm run lint:check && npm run format:check
```

## Fix Issues

```bash
# Auto-fix lint issues
npm run lint:fix

# Auto-fix format issues
npm run format:fix
```

## Pre-commit

Quality checks run automatically via Husky before each commit. Fix any issues before committing.
