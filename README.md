# Mobile App — PlanBuddy

This repository is a small Expo + Node prototype that generates structured task plans using OpenAI and persists them locally.

Summary of what was implemented
- Full-stack prototype: Express TypeScript backend + Expo React Native frontend (TypeScript).
- Backend endpoint `POST /plan` that calls OpenAI and returns a JSON plan (now returns `{ tasks: [...] }`).
- Frontend Expo app with two screens: Create (generate plan) and Plan (history, per-plan task lists).
- Persisted plan history (append-only) in AsyncStorage under key `latest_plan_v1`.
- Task toggles (complete/incomplete) that only dim the item (no deletion) and are persisted per-plan.
- Delete plan action (with confirmation) in the Plan list header.
- Theme toggle, header/footer, priority filter, emoji & notes shown in task rows.
- Minimal pure-logic unit test for task filtering/sorting: `frontend/__tests__/taskUtils.test.js`.

Important files / structure
- `backend/` — Express + OpenAI server (TypeScript). Key file: `backend/server.ts`.
- `frontend/` — Expo app. Primary source tree under `frontend/src/`:
  - `src/components/` — UI components (CreatePlan, Plan, TaskItem, etc.)
  - `src/hooks/` — hooks (`usePlan` centralizes generate + delete)
  - `src/api/plan.ts` — client API helper that reads runtime base URL from Expo extras / env
  - `src/utils/` — pure utilities (filter/sort)
  - `__tests__/` — unit tests (Jest logic tests)

How to run (Windows PowerShell)

1) Backend

```powershell
cd "d:\Mobile App\backend"
npm install
# create .env with OPENAI_API_KEY and optional PORT
# Example .env:
# OPENAI_API_KEY=sk_...
# PORT=8787

npm run dev   # or `node dist/server.js` in production
```

Watch server console for incoming requests and logs.

2) Frontend (Expo)

```powershell
cd "d:\Mobile App\frontend"
# Choose the base URL your app should call. Examples:
# iOS simulator: http://localhost:8787
# Android emulator: http://10.0.2.2:8787
# Physical device: use your machine LAN IP, e.g. http://192.168.1.5:8787
$env:EXPO_PUBLIC_API_BASE_URL='http://localhost:8787'
npm install
npm start
```

Notes
- If you change `app.config.ts`, restart Metro (`npm start`) so Expo re-injects runtime `extra`.
- Android emulator requires `10.0.2.2` to reach host `localhost`.
- If Metro bundling fails, try clearing cache: `npm start -- --reset-cache`.

API & security
- The OpenAI API key must only live on the backend (`backend/.env`). The frontend never contains secrets — it only calls `POST /plan`.
- Frontend resolves the server base URL at runtime from Expo extras (`EXPO_PUBLIC_API_BASE_URL`) or falls back to `http://localhost:8787`.

Tests
- Run unit tests (logic-only Jest tests):

```powershell
cd "d:\Mobile App\frontend"
npm test
```

Design choices & tradeoffs
- Light dependencies: chosen to keep the prototype small and easy to run (small set of RN libs and a simple Express backend).
- TypeScript: used across both backend and frontend for type safety and clearer shared types.
- Shared types: `src/types/*` keep task/plan shapes consistent between client and server.
- Persistence: AsyncStorage holds the whole plan history; this is simple and local-only (no sync). For multi-device sync, add a backend store.
- API shape: the backend returns `{ tasks: [...] }` to make the response explicit and extensible.
- Model choice: switched from `gpt-40` to `gpt-5-mini` — rationale: bigger effective context and more cost-efficient for this use case. This was a pragmatic tradeoff to get larger prompt/context capacity while keeping cost lower during testing and early usage.

Assessment notes (what to highlight)

- Starter used: I began from the assessment starter provided in the assignment (the starter details doc). I kept the minimal structure and focused on a light integration: small backend + Expo frontend, shared types, and clear runtime config.

- Prompting & response format: To make the OpenAI output deterministic and easy to parse, I simplified the prompt and asked the model to output a strict JSON object. In the backend I used the OpenAI chat/completions response format and requested a json_object type for structured output. The backend parses the JSON and returns a normalized `{ tasks: [...] }` structure to the client. This reduces brittle text parsing and makes the client integration robust.

- AsyncStorage & persistence strategy: The frontend keeps an append-only `plans` history in AsyncStorage under key `latest_plan_v1`. New plans are prepended to the array so the most recent plan shows first. Each `PlanEntry` includes:
  - `id` (string)
  - `name` (goal)
  - `tasks` (Task[])
  - `createdAt` (ISO timestamp)

  Each `Task` has:
  - `id`, `title`, `dueDate` (YYYY-MM-DD), `priority` ('high'|'medium'|'low'), optional `notes`, optional `emoji`, and `completed` boolean.

- Platform-specific API base URL handling: The app reads the server base URL at runtime from Expo's `extra` (injected via `app.config.ts`) using the environment variable `EXPO_PUBLIC_API_BASE_URL`. This allows:
  - iOS simulator: `http://localhost:8787`
  - Android emulator: `http://10.0.2.2:8787` (the code maps localhost to 10.0.2.2 on Android)
  - Physical devices: the developer's LAN IP (e.g., `http://192.168.1.5:8787`)

  The API helper (`src/api/plan.ts`) resolves the final base URL from Expo Constants at runtime (with fallbacks to `process.env`). This keeps the app flexible across simulators and devices and avoids hardcoding different URLs per platform in source files.

- Data types (summary)
  - `Task`:
    - `id: string`
    - `title: string`
    - `dueDate: string` (YYYY-MM-DD)
    - `priority: 'high' | 'medium' | 'low'`
    - `notes?: string`
    - `emoji?: string`
    - `completed?: boolean`

  - `PlanEntry`:
    - `id: string`
    - `name: string` (goal)
    - `tasks: Task[]`
    - `createdAt: string` (ISO timestamp)

  - Storage key: `latest_plan_v1` stores `PlanEntry[]` (append-only history).

