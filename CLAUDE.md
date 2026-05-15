# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Deliveroo Clone Web - React frontend application for restaurant browsing, menu exploration, cart management, ordering, and payment processing.

- **Runtime:** Node.js >= 20
- **Package Manager:** npm (use `npm ci` in CI, `npm install` locally)
- **Language:** TypeScript 5.x (strict mode)
- **Framework:** React 18.x + Vite
- **State Management:** Redux Toolkit + Redux Persist
- **UI Framework:** Material-UI (MUI)
- **Validation:** Zod for schemas
- **Authentication:** Firebase + JWT tokens
- **Payment:** Stripe integration
- **CI/CD:** GitHub Actions — PR quality checks, Semantic Release

## Common Commands

```bash
npm run dev                  # Start Vite dev server with hot reload
npm run build                # Build for production (vite build)
npm run preview              # Preview production build locally
npm run lint:check           # ESLint check
npm run lint:fix             # ESLint auto-fix
npm run format:check         # Prettier check
npm run format:fix           # Prettier auto-fix
npm run types:check          # TypeScript type-check without emitting
npm run release              # Run semantic-release
npm run release:dry-run      # Preview release without publishing
```

## Architecture

**Component-based architecture with Redux state management:**

```text
src/
├── config/                  # stripe.ts, environment.ts, API configuration
├── pages/                   # Page components (Auth, Checkout, Menu, Profile, etc.)
├── layout/                  # Layout wrappers (MainLayout, SignPageLayout, etc.)
├── features/                # Feature modules (menu, filtering, etc.)
│   └── menu/
│       ├── components/      # Reusable components (Cart, Button, TextInput, etc.)
│       ├── validations/     # Feature-specific validations
│       └── views/           # Feature views
├── routes/                  # Route guards (ProtectedRoute, AdminProtectedRoute)
├── services/                # API clients (auth, cart, order, payment, etc.)
├── store/                   # Redux state management
│   ├── authSlice.tsx        # Auth state
│   ├── cartSlice.tsx        # Cart state
│   ├── adminSlice.tsx       # Admin state
│   └── hooks/               # Redux hooks
├── theme/                   # Design system (colors, fonts, sizes, etc.)
├── types/                   # TypeScript interfaces and types
├── utils/                   # Utilities (constants, helpers, notifications)
└── App.tsx & main.tsx       # Entry point
```

### Key Patterns

- **Data Flow:** Components → Redux selectors → Actions → Reducers → Store
- **API Communication:** Services layer abstracts API calls via axios
- **Authentication:** JWT tokens stored in Redux (persisted via redux-persist)
- **Validation:** Zod schemas + react-hook-form for form handling
- **Styling:** Material-UI components + custom theme system
- **Route Protection:** ProtectedRoute wrapper checks auth state before rendering
- **State Persistence:** Redux Persist auto-saves auth & cart state to localStorage
- **Type Safety:** Zod inferred types (z.infer) eliminate duplicate type definitions

## Important Rules

- NEVER use `console.log` — use browser DevTools or structured logging
- NEVER commit `.env` files — they contain secrets; use `.env.example` instead
- NEVER use `any` type — infer types from Zod schemas via `z.infer<typeof schema>`
- NEVER use `// @ts-ignore` or type assertions (`as any`) — fix the underlying type issue
- NEVER bypass Prettier or ESLint warnings — all checks are enforced pre-commit via Husky
- Use `import.meta.env` for environment variables (Vite injected, not Node.js `process.env`)
- Prefer Material-UI theme tokens (`Colors` from `src/theme`) over hardcoded colors
- Always use `useAppSelector` and `useAppDispatch` from Redux hooks instead of plain `useSelector`/`useDispatch`
- Validate all user input with Zod schemas before sending to API
- Handle errors gracefully — show snackbar notifications via `notistack`
