# API Conventions Skill

Follow these conventions when creating or modifying API endpoints.

## Request/Response Format

All responses follow this envelope:

```typescript
// Success
{
  success: true,
  message: 'Operation completed',
  data?: T
}

// Error
{
  success: false,
  message: 'Error description',
  code?: string
}
```

## HTTP Methods

- `GET` — retrieve resources
- `POST` — create new resources
- `PATCH` — partial update
- `PUT` — full replacement
- `DELETE` — remove resources

## Status Codes

- `200 OK` — successful GET, PATCH
- `201 CREATED` — successful POST
- `204 NO CONTENT` — successful DELETE
- `400 BAD REQUEST` — validation error
- `401 UNAUTHORIZED` — auth required
- `403 FORBIDDEN` — insufficient permissions
- `404 NOT FOUND` — resource doesn't exist
- `500 INTERNAL_SERVER_ERROR` — unexpected error

## Versioning

All routes use `/v1/` prefix.

## Validation

Use Zod schemas with validate middleware:

```typescript
router.post("/", validateBody(createRequestSchema), handler);
```
