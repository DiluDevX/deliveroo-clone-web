# TypeScript Rules

## Strict Mode

This project uses TypeScript strict mode. All compiler options are enforced:

- `strict: true` — enables all strict type checks
- `noImplicitAny` — never leave types unresolved
- `strictNullChecks` — handle null/undefined explicitly
- `noUnusedLocals` — remove unused variables
- `noUnusedParameters` — remove unused function parameters
- `noImplicitReturns` — all code paths must return a value
- Target: `ES2021`, Module: `CommonJS`

## Type Safety

- Never use `any` as a type — find or create the correct type
- Never use `// @ts-ignore` or `// @ts-expect-error` — fix the underlying type issue
- Never use type assertions (`as any`, `as unknown`) to bypass type checking
- Infer DTO types from Zod schemas using `z.infer<typeof schema>` — do not duplicate type definitions
- Use `AppError` subclasses (never generic `Error`) when throwing

## Zod Integration

Prefer inferring types from schemas to keep source of truth in one place:

```typescript
// schema/item.schema.ts
export const createItemRequestBodySchema = z.object({ ... });

// dtos/item.dto.ts
export type CreateItemRequestBodyDTO = z.infer<typeof createItemRequestBodySchema>;
```

## Controller Typing

Use full Express generics on request handlers:

```typescript
import { Request, Response, NextFunction } from 'express';

export const myAction = async (
  req: Request<ParamsDTO, unknown, BodyDTO, QueryDTO>,
  res: Response,
  next: NextFunction,
): Promise<void> => { ... };
```

## Code Quality

- No commented-out code blocks — delete dead code, use git history instead
- Boolean variables use auxiliary verbs: `isActive`, `hasError`, `canDelete`, `shouldRetry`
- Prettier enforces: single quotes, trailing commas (`es5`), semicolons, `printWidth: 100`, `tabWidth: 2`
- ESLint enforces: `@typescript-eslint/recommended` + unused vars with `_` prefix allowance
- Never suppress lint or type errors with inline comments — fix the root cause
