# Security Rules

## Secrets Management

- NEVER commit `.env` files — they contain secrets
- Use AWS Secrets Manager for production secrets
- Never log sensitive data (passwords, tokens, credit cards)
- Use environment variables via `src/config/environment.ts`

## Input Validation

- Validate ALL input using Zod schemas
- Never trust user input without validation
- Use parameterized queries (not string interpolation)

## Authentication

- All protected routes must validate JWT tokens
- Use timing-safe comparison for sensitive operations
- Implement rate limiting on auth endpoints

## API Keys

- Use API key middleware for service-to-service communication
- Store API keys in environment variables
- Rotate API keys regularly
