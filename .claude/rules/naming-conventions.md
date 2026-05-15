# Naming Conventions

## Files

- Use kebab-case: `auth.service.ts`, `user.controller.ts`
- DTOs: `<name>.dto.ts`
- Schemas: `<name>.schema.ts`
- Routes: `<name>.routes.ts`
- Controllers: `<name>.controller.ts`

## TypeScript

- Use PascalCase for types, interfaces, classes: `interface UserDTO`
- Use camelCase for variables, functions: `const userId = ...`
- Use UPPER_SNAKE_CASE for constants: `const MAX_RETRY_COUNT = 3`
- Prefix interfaces with `I` only when necessary (avoid: `IUser`)
- Use proper naming: `userId`, `isActive`, `hasPermission`

## API Endpoints

- Use plural nouns: `/users`, `/orders`, `/restaurants`
- Use kebab-case: `/active-orders`, `/pending-payments`
- Nested resources: `/orders/:orderId/items`
- HTTP verbs: GET (retrieve), POST (create), PATCH (update), DELETE (remove)
