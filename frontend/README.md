# SkillConnect Frontend

React and Vite client for SkillConnect.

## Setup and development

The frontend expects the backend API on `http://127.0.0.1:8000`.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. Requests
starting with `/api` are proxied to the backend.

To use a different backend:

```bash
VITE_BACKEND_URL=http://localhost:9000 npm run dev
```

## Build and verify

```bash
npm run build
npm run preview
```

`npm run build` is the current frontend verification command. There is not yet
an automated component test suite.

## Available scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start Vite with hot module replacement |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally |

See the repository-level `README.md` for backend setup, database migrations,
tests, and production instructions.
