# Copilot Instructions for MERN Song Management System

Short, actionable notes to help AI coding agents be productive in this repo.

## Quick overview
- Backend: TypeScript + Express + Mongoose. Entry: `backend/src/server.ts` -> `backend/src/app.ts`.
- Frontend: Vite + React + TypeScript. State: Redux Toolkit + Redux-Saga. Entry: `frontend/src/main.tsx`.
- Data flow: Frontend calls REST endpoints on the backend (`/songs`, `/songs/stats`) via `frontend/src/services/api.ts`.

## Development / Build commands
- Backend (development):
  - `cd backend` then `npm install` then `npm run dev` (uses `nodemon` + `ts-node`)
  - Build for production: `npm run build` (runs `tsc`), then `npm start` (runs `node dist/server.js`).
  - Important env vars: `MONGODB_URI` (default `mongodb://localhost:27017/songdb`), `PORT`.
- Frontend:
  - `cd frontend` then `npm install` then `npm run dev` (Vite dev server).
  - Build: `npm run build`. Set `VITE_API_BASE_URL` to point to backend if not default (`http://localhost:5000`).

## Architecture & conventions (backend)
- Routing and order: `backend/src/routes/songs.ts` — note `/stats` is placed before `/:id` to avoid param collisions. Keep that order when adding new routes with static paths.
- Layering pattern: route -> controller -> service -> model. Controllers stay thin and delegate to `services/*` (e.g. `songController.ts` delegates to `songService.ts`).
- Error handling: Use `ApiError` for operational errors (`backend/src/utils/apiError.ts`) and `errorHandler` middleware (`backend/src/utils/errorHandler.ts`) to normalize responses. Throw `ApiError` in services for 4xx conditions (see `findSongById`, `updateSong` in `songService.ts`).
- Validation: Lightweight request validation middleware lives in `backend/src/utils/validators.ts` (`validateSongPayload`) — prefer using it for required fields before calling services.
- Data modelling: `backend/src/models/Song.ts` defines `ISong` and adds indexes for aggregation. Use model-level validation (Mongoose schema) and prefer aggregate pipelines for reports (see `computeStats` in `songService.ts`).

## Architecture & conventions (frontend)
- State management: `@reduxjs/toolkit` slices under `frontend/src/redux/slices/`. Side effects are implemented with sagas in `frontend/src/sagas/`.
- Middleware: Thunk is disabled; sagas are the canonical async flow. When adding async flows, add actions in slices and implement sagas (see `songsSagas.ts` pattern).
- API client: `frontend/src/services/api.ts` centralizes HTTP calls with axios. Use `apiService` methods (`getSongs`, `createSong`, `getStats`, etc.) rather than raw axios calls.
- Env/config: Frontend uses Vite env `VITE_API_BASE_URL` to configure the API base URL. Prefer reading via `import.meta.env.VITE_API_BASE_URL`.

## Important patterns & examples (copy-paste friendly)
- Throwing client errors in services (backend):

  - In `backend/src/services/songService.ts`:
    - Validate ObjectId with `mongoose.Types.ObjectId.isValid(id)` and throw `new ApiError('Invalid song id', 400)` for bad input.
    - If entity not found, throw `new ApiError('Song not found', 404)`.

- Stats aggregation (backend):
  - `computeStats` uses a MongoDB `$facet` aggregation to compute multiple reports in one query. Keep new aggregations indexing-aware — add schema indexes in `Song.ts` when queries become slow.

- Route ordering note (backend):
  - `router.get('/stats', getStats);` is intentionally declared before `router.get('/:id', ...)` to avoid `stats` being handled as an `:id` parameter.

- Frontend sagas triggering stats refresh:
  - After add/update/delete sagas call `yield put(fetchStatsStart())` to refresh aggregated stats. Follow this pattern when mutating song data.

## Integration & external dependencies
- MongoDB: connection in `backend/src/config/database.ts` reads `env.mongoUri` from `backend/src/config/env.ts`.
- No auth is implemented: API is open. If adding auth, update axios interceptors (`frontend/src/services/api.ts`) and backend middleware chain.
- Dockerfile exists under `backend/` but the repo currently relies on local `npm` dev flows.

## Files to inspect first when making changes
- `backend/src/app.ts` — express setup, middleware order (helmet, cors, morgan, parsers).
- `backend/src/routes/songs.ts` — route definitions and ordering.
- `backend/src/services/songService.ts` — business logic and aggregation examples.
- `backend/src/utils/errorHandler.ts` — how errors are normalized for clients.
- `frontend/src/services/api.ts` — centralized HTTP client and error mapping.
- `frontend/src/sagas/*` and `frontend/src/redux/slices/*` — async flow and state update patterns.

## When modifying or adding endpoints
- Follow the established layering: add route -> controller -> service -> model (if needed).
- Use `ApiError` in services for predictable error handling and status codes.
- Add or update Mongoose indexes in `Song.ts` when adding queries/aggregations that filter or group by a field.

## Developer tips for AI agents
- Prefer minimal, focused changes. Run the backend dev server (`npm run dev`) and frontend (`npm run dev`) locally using provided scripts to verify interactions.
- Use the Vite frontend dev server + backend dev server; configure `VITE_API_BASE_URL` during frontend runs when backend is not at the default port.
- When adding features that require persistence, update both the Mongoose model and any aggregation-based stats to include the new fields.

If any area is unclear or you want this guidance expanded (examples, conventional commit messages, or reviewer checklist), tell me which section to expand.
