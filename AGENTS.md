# MERN E-Commerce — Agent Guide

## Stack

| Layer     | Tech                                    |
| --------- | --------------------------------------- |
| Backend   | Express 4 + Mongoose 9 (CommonJS)       |
| Frontend  | React 19 + Vite 8 + Redux Toolkit (ESM) |
| Auth      | JWT (cookie + Bearer fallback)          |
| Email     | Nodemailer (Gmail SMTP)                 |
| DB        | MongoDB (`ecommerce` database)          |

## Commands

```sh
# Backend (run from repo root — root package.json is the backend)
npm run dev        # nodemon backend/server.js
npm start          # node backend/server.js

# Frontend (separate terminal)
cd frontend && npm run dev    # Vite dev server
cd frontend && npm run build  # production build
cd frontend && npm run lint   # ESLint (no TypeScript check)

# Full stack requires two terminals: root `npm run dev` + `cd frontend && npm run dev`
```

## Architecture

- **No monorepo workspace** — root and `frontend/` have independent `node_modules` and `package.json`.
- **Root** = backend (`type: commonjs`). **Frontend** = Vite SPA (`type: module`).
- **All API routes** under `/api/v1/*`. Mounted in `backend/app.js`.
- **Entrypoints**: `backend/server.js` (back), `frontend/src/main.jsx` (front).
- **Env**: `backend/config/config.env`. Loaded explicitly via `dotenv.config({ path: "backend/config/config.env" })`.
- **Auth middleware** reads JWT from `req.cookies.token` first, then `Authorization: Bearer <token>`.
- **Redux** store at `frontend/src/store.js`. Currently only `products` reducer wired. Uses `axios` with relative URLs (no Vite proxy config — ensure frontend dev server proxies `/api` to `localhost:4000`, or the backend serves the built frontend).
- **Admin routes** gated by `isAuthenticatedUser` + `authorizeRoles("admin")`. Default user role is `"user"`.

## Key Files

| File | Purpose |
| ---- | ------- |
| `backend/app.js` | Express app setup, route mounting, error middleware |
| `backend/server.js` | DB connect, server start, uncaught exception handlers |
| `backend/config/database.js` | Mongoose connection via `process.env.DB_URL` |
| `backend/middleware/auth.js` | JWT auth + role guard |
| `backend/utils/jwtToken.js` | Token generation + cookie set helper |
| `backend/utils/apiFeatures.js` | Search, filter, pagination query builder |
| `backend/middleware/error.js` | Global error handler (CastError, duplicate key, JWT errors) |
| `frontend/src/store.js` | Redux store config |
| `frontend/src/actions/productAction.js` | Axios call to `/api/v1/products` |

## Important Constraints

- **No tests** exist in the repo. No test framework installed.
- **No CI/CD**, no pre-commit hooks, no lint-staged.
- **No TypeScript** anywhere.
- **No Vite proxy configured** — relative API calls from frontend require either a Vite proxy in `vite.config.js` or the backend serving the Vite build.
- **Config `.env` IS gitignored** via `*.env` rule. The example values in the tracked `config.env` are placeholder secrets.
- **Postman collection** (`MERN_Ecommerce_API.postman_collection.json`) is gitignored.
- **Image assets** at repo root (app store badges) — not related to code.
