# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository.

## Project Overview

**Gestion de reactivos** — a Vue 3 single-page application (SPA) for managing
question banks ("bancos de reactivos") at UANL. It talks to a REST backend
(`bancoreactivosapi.uanl.mx`) and handles auth, question banks, projects,
shared resources, and users.

## Tech Stack

- **Build:** Vite 8, TypeScript (~6), `vue-tsc` for type-checking
- **Framework:** Vue 3 (`<script setup>` + Composition API)
- **Styling:** Tailwind CSS v4 + DaisyUI v5 (theme defined in `src/style.css`)
- **State (client):** Pinia (setup-style stores)
- **State (server):** TanStack Vue Query (`@tanstack/vue-query`)
- **Routing:** Vue Router 4 with auth navigation guards
- **HTTP:** Axios via a custom client in `src/api/http.ts` (sends `Token` header)
- **Forms/validation:** vee-validate + zod
- **Editor:** Froala (`src/components/FroalaEditor.vue`)
- **Toasts:** vue-sonner
- **Utilities:** @vueuse/core
- **Lint/Format:** ESLint (flat config + oxlint) and Prettier

## Commands

| Command             | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Dev server (uses `.env.development`, Vite proxy)     |
| `npm run build`     | Type-check + production build (`.env.production`)    |
| `npm run build:dev` | Type-check + staging build (`.env.staging`)          |
| `npm run preview`   | Preview the built app                                |
| `npm run type-check`| `vue-tsc --build` — MUST pass before finishing work  |
| `npm run lint`      | `oxlint --fix` + `eslint --fix`                      |
| `npm run format`    | Prettier write over `src/`                           |

After editing code, always run `npm run type-check` and `npm run lint`.

## Project Structure (`src/`)

- `api/<feature>/` — backend integration per domain:
  - `actions/*.action.ts` — async functions that call the API (e.g. `getBancosAction`)
  - `composable/` — Vue Query wrappers (`useQuery`/`useMutation`), e.g. `useReactivos`
  - `interfaces/` — TypeScript types/interfaces for the domain
  - `store/` — Pinia stores when needed
- `app/` — app feature area: `views/`, `routes/`, `layout/`, `bancos/`, `proyectos/`, etc.
- `auth/` — authentication: `store/`, `actions/`, `api/`, `views/`, `routes/`, `interface/`, `layout/`
- `common/modals/` — shared modal store/components
- `components/` — cross-cutting components (e.g. `FroalaEditor.vue`)
- `router/index.ts` — route table + auth guard
- `utils/` — helpers (e.g. `html.ts`)
- `main.ts` — app bootstrap (plugins: Pinia, Router, Vue Query, Toaster)
- `style.css` — Tailwind + DaisyUI theme tokens

## Conventions

- **Imports:** Always use the `@/` alias (`@/api/http`), never deep relative paths.
  Alias is defined in `vite.config.ts` and `tsconfig.app.json`.
- **API access:** Use the shared `apiClient` from `@/api/http`. Do not create new
  Axios instances for feature calls. The client automatically attaches the
  `Token` header from `localStorage` and clears the session on HTTP 401.
- **Actions:** Put API calls in `api/<feature>/actions/*.action.ts`. Name them
  `verbThingAction` (e.g. `getBancosAction`, `crear-reactivo.action.ts`). They
  should `throw` on failure rather than returning error objects.
- **Server state:** Wrap data fetching in composables under `composable/` using
  `useQuery`/`useMutation` with a stable `queryKey` (include the entity id, e.g.
  `['reactivos', bancoId]`). Don't fetch directly in components.
- **Client state:** Use Pinia setup-style stores. Keep auth in
  `@/auth/store/auth.store` and reuse `useAuthStore` / `useModalStore`.
- **Styling:** Use Tailwind utility classes and DaisyUI components. Theme colors
  (`primary`, `texto`, etc.) are defined in `src/style.css`. Prefer existing
  tokens over inline styles.
- **Forms:** Validate with `vee-validate` + `zod` schemas; reuse schemas in
  `interfaces/` where possible.
- **TypeScript:** `noUncheckedIndexedAccess` is enabled — handle possibly-undefined
  array/object lookups. Don't disable it to "make errors go away."
- **Components/Views:** `.vue` files live in `views/` (named in PascalCase, e.g.
  `misbancos.vue`). Keep components focused and small.
- **Routing:** Add new pages lazily (`() => import(...)`) in `router/index.ts`
  and protect them with `meta: { requiresAuth: true }`.

## Authentication

- The token is stored in `localStorage` under `token` and sent as the `Token`
  request header by `apiClient` interceptors. Never hardcode tokens or API URLs.
- Session expiry is handled in `useAuthStore`; rely on the store and the router
  guard instead of reimplementing checks.
- To logout/clear state, call `authStore.clearSession()` — it also clears the
  Vue Query cache.

## Environment Variables

- Copy `.env.template` to `.env.development` / `.env.staging` / `.env.production`
  and set `VITE_API_URL` (e.g. `https://dev.bancoreactivosapi.uanl.mx:30704/api/v1`).
- Only variables prefixed with `VITE_` are exposed to the client bundle.
- Never commit `.env.*` files (they are gitignored).

## Before You Finish

1. Run `npm run type-check` and `npm run lint` — both must pass.
2. Respect Prettier config: `semi: false`, `singleQuote: true`, `printWidth: 100`.
3. Don't commit `dist/`, `node_modules/`, or `.env.*`.
4. Follow the existing per-feature folder structure; prefer creating new files
   over bloating existing ones.
5. Keep code and comments consistent with the rest of the codebase (currently
   mixed Spanish/English — match the surrounding file's language).
