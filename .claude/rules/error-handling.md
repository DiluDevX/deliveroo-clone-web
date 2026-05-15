# Error Handling Rules

## AppError Hierarchy

Use custom `AppError` subclasses for all errors:

```typescript
// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, StatusCodes.NOT_FOUND, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
  }
}
```

## Controller Pattern

Always use try/catch with `next(error)`:

```typescript
export const myAction = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await myService.doSomething(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Action completed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
```

## HTTP Status Codes

Use `http-status-codes` constants:

- `200 OK` — successful GET, PATCH
- `201 CREATED` — successful POST
- `204 NO CONTENT` — successful DELETE (no response body)
- `400 BAD REQUEST` — validation errors
- `401 UNAUTHORIZED` — missing/invalid auth
- `403 FORBIDDEN` — insufficient permissions
- `404 NOT FOUND` — resource doesn't exist
- `409 CONFLICT` — duplicate resource
- `500 INTERNAL_SERVER_ERROR` — unexpected errors
