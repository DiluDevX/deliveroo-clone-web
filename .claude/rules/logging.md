# Logging Rules

## Pino Logger

This project uses Pino for structured logging.

## Rules

- NEVER use `console.log` — always use `logger` from `src/utils/logger.ts`
- Always inject `service` and `env` on every log line
- Use appropriate log levels: `fatal` (unrecoverable), `error` (errors), `warn` (warnings), `info` (important), `debug` (debugging), `trace` (detailed tracing)
- Log structured data as objects, not interpolated strings

```typescript
import { logger } from "../utils/logger";

// Good
logger.info(
  { userId: user.id, action: "user_created" },
  "User created successfully",
);
logger.error(
  { error: err.message, stack: err.stack },
  "Failed to process payment",
);

// Bad
logger.info("User created: " + user.id);
```
