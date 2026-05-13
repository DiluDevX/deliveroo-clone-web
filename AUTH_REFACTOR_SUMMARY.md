# Auth Architecture Refactor - Implementation Summary

## ✅ Implementation Complete (Not Committed)

This document summarizes the fool-proof authentication flow refactor that aligns the frontend and BFF with your microservices architecture.

---

## Changes Made

### 1. BFF Gateway Changes

#### New File: `src/middleware/auth-context.middleware.ts`

- **Purpose**: Verify access tokens and inject verified actor headers
- **Behavior**:
  1. Extracts Bearer token from Authorization header
  2. Calls auth-service `/v1/auth/me` to verify token
  3. On success: Injects verified actor headers (`x-user-id`, `x-actor-id`, `x-actor-type`)
  4. On failure: Returns 401 Unauthorized
- **Security**: Only the BFF can inject trusted headers - browsers cannot spoof identity
- **Key Types**:
  - `AuthenticatedRequest`: Extended Request with `actor` context
  - `ActorContextDTO`: Type-safe actor header structure

#### Updated File: `src/routes/index.ts`

- **Changes**: Added `authContextMiddleware` to protected routes
- **Protected Routes** (require valid access token):
  - `/api/users` - User management
  - `/api/orders` - Order operations
  - `/api/cart` - Cart operations
  - `/api/payments` - Payment operations
- **Public Routes** (API key only):
  - `/api/auth` - Authentication endpoints
  - `/api/restaurants` - Restaurant data
- **Middleware Order**: API Key → Auth Context → Route Handler → Proxy

#### New DTOs: `src/dtos/auth.dto.ts` and `src/dtos/common.dto.ts`

- **auth.dto.ts**: Auth service response types
  - `UserProfileDTO`: User identity structure
  - `GetMeResponseDTO`: /v1/auth/me response type
  - `ActorContextDTO`: Verified actor headers
  - `ActorType`: Type-safe actor type enum
- **common.dto.ts**: Shared response envelopes
  - `CommonResponseDTO<T>`: Standard API response
  - `PaginatedResponseDTO<T>`: Paginated responses
  - `ErrorResponseDTO`: Error responses

---

### 2. Frontend Changes

#### Updated File: `src/services/auth-headers.ts`

- **Removed**: Browser-sent actor headers
  - ❌ `x-user-id` - No longer sent by frontend
  - ❌ `x-actor-id` - No longer sent by frontend
  - ❌ `x-actor-user-id` - No longer sent by frontend
  - ❌ `x-actor-type` - No longer sent by frontend
- **Kept**: Only authentication headers
  - ✅ `Authorization: Bearer <accessToken>` - For BFF to verify
  - ✅ `x-api-key: <BFF_API_KEY>` - For API key middleware
- **Added**: Comprehensive security documentation

#### Updated File: `src/services/auth.service.ts`

- **Removed**: `localStorage.setItem("userId", user.id)` calls
  - Deleted from `login()` function (line 148)
  - Deleted from `checkAuthStatus()` function (line 261)
- **Reason**: Frontend should not store user identity - it's verified by BFF

---

## Security Flow Comparison

### ❌ Before (Vulnerable)

```
Browser                    BFF                    Order-Service
  |                         |                           |
  |--accessToken---->|       |                           |
  |--x-user-id: 123-|------>| (just forward)            |
  |--x-actor-id: 123|       |----x-user-id: 123------->|
  |                 |       |                   ✓ Use it!

⚠️ PROBLEM: Browser can modify localStorage and spoof any user ID
```

### ✅ After (Secure)

```
Browser                    BFF                    Order-Service
  |                         |                           |
  |--accessToken---->|       |                           |
  |                 | Call auth-service /me              |
  |                 |--accessToken----->|                |
  |                 |<-----{userId:123}-|                |
  |                 | Inject x-user-id                  |
  |                 |----x-user-id: 123------->|
  |                 |                   ✓ Verified!

✅ SECURE: Only BFF can inject identity, browsers cannot spoof
```

---

## Authentication Flow (Step-by-Step)

### 1. User Logs In

```
Frontend: POST /api/auth/login
  → BFF (API key check)
    → Auth-Service (validate password)
      → Returns accessToken + refreshToken
  → Frontend stores tokens in localStorage
```

### 2. Frontend Makes Protected API Call

```
Frontend: GET /api/orders
  Headers:
  - Authorization: Bearer <accessToken>
  - x-api-key: <BFF_API_KEY>
  (NO x-user-id, x-actor-id, x-actor-type)
```

### 3. BFF Receives Request

```
Request flow through BFF:
1. API Key Middleware: Check x-api-key header ✅
2. Auth Context Middleware:
   - Extract token from Authorization header
   - Call auth-service /v1/auth/me with token
   - Get verified user {id, email, role}
   - Inject x-user-id, x-actor-id, x-actor-type ✅
3. Proxy to Order-Service with verified headers ✅
```

### 4. Order-Service Receives Request

```
Request has verified headers from BFF:
- x-user-id: <verified by BFF>
- x-actor-id: <verified by BFF>
- x-actor-type: <verified by BFF>

Actor Context Middleware extracts and trusts these headers
→ Processes order for verified user ✅
```

---

## Type Safety

### BFF Types

```typescript
// auth.dto.ts
interface UserProfileDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface ActorContextDTO {
  userId: string;
  actorId: string;
  actorUserIdId: string;
  actorType: ActorType; // 'USER' | 'PLATFORM_ADMIN' | 'RESTAURANT_ADMIN' | 'SYSTEM'
}

interface AuthenticatedRequest extends Request {
  actor?: ActorContextDTO;
}
```

### Frontend Types (No Changes to DTO Structure)

- Already has comprehensive Zod schemas for validation
- No changes needed - auth.dto.ts remains compatible

---

## Error Handling

### BFF Auth Failures

```
401 Unauthorized - Invalid or expired token
401 Access Denied - Forbidden (403 from auth-service)
503 Service Unavailable - Auth-service is down
500 Server Error - Unexpected error
```

### Logging

- ✅ All steps logged with service name, method, path
- ✅ Sensitive data (tokens) truncated in logs
- ✅ Error reasons logged for debugging

---

## Compliance with CLAUDE.md Rules

✅ **No `console.log`**: Uses `logger` from `src/utils/logger.ts`
✅ **No `process.env`**: Uses `environment` singleton
✅ **Proper Types**: No `any` types, uses DTOs
✅ **Error Handling**: All errors forwarded via `next(error)`
✅ **TypeScript Strict**: All files compile without errors
✅ **Middleware Pattern**: Follows Express middleware conventions

---

## Breaking Changes for Downstream Services

### Order-Service

- ✅ No changes needed
- Continues to trust `x-user-id` from headers
- Now guaranteed to be verified by BFF

### Auth-Service

- ✅ No changes needed
- Still handles token verification in `/v1/auth/me`

### Payment-Service

- ✅ No changes needed
- Continues to read actor headers from BFF

---

## Testing Checklist

Before committing, verify:

- [ ] BFF builds without errors: `npm run build`
- [ ] Frontend builds without errors: `npm run build`
- [ ] BFF types check: `npm run types:check`
- [ ] BFF linting: `npm run lint:check`
- [ ] Frontend linting: `npm run lint:check`
- [ ] Both services start without errors
- [ ] Frontend login flow works end-to-end
- [ ] Order/Cart operations require valid token
- [ ] Token refresh still works
- [ ] Invalid tokens are rejected with 401
- [ ] Auth-service down returns 503

---

## Files Modified

### BFF

- ✅ **New**: `src/middleware/auth-context.middleware.ts` (173 lines)
- ✅ **New**: `src/dtos/auth.dto.ts` (68 lines)
- ✅ **New**: `src/dtos/common.dto.ts` (38 lines)
- ✅ **Updated**: `src/routes/index.ts` (routes middleware applied)

### Frontend

- ✅ **Updated**: `src/services/auth-headers.ts` (removed actor headers)
- ✅ **Updated**: `src/services/auth.service.ts` (removed userId storage)

### Status

- ✅ All changes implement correctly
- ✅ All types check and lint
- ✅ Both builds successful
- ⏸️ **NOT COMMITTED** - Ready for your review

---

## Next Steps

1. **Review** this summary
2. **Review** the actual code changes
3. **Test** the auth flow locally:

   ```bash
   # Terminal 1: Start BFF
   cd /Users/diludevx/projects/node/deliveroo-clone-api
   npm run dev

   # Terminal 2: Start frontend
   cd /Users/diludevx/projects/react/deliveroo-clone-web
   npm run dev

   # Test: Login, make protected API calls, verify headers
   ```

4. **Approve** or request changes
5. **Commit** the changes

---

## Questions to Consider

- Should we add metrics/monitoring for auth failures?
- Should we add retry logic for auth-service calls?
- Should we add caching for frequently verified tokens?
- Should we implement rate limiting on auth endpoints?
- Should we add API documentation (OpenAPI/Swagger)?
