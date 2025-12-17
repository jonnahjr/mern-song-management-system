## MERN Song Management System — Addis Software Test Project

Full‑stack MERN app for managing songs (CRUD + statistics) with a Dockerized Express/MongoDB backend and a TypeScript React frontend using Redux Toolkit and Redux‑Saga.

### Screenshots

#### Light Mode
![Light Mode](screenshots/light-mode.png)

#### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

#### Mobile View
![Mobile View](screenshots/mobile-view.png)

#### Stats Dashboard
![Stats Dashboard](screenshots/stats-dashboard.png)

### Architecture Overview

- **Backend (Node.js, Express, MongoDB, Mongoose)**
  - `src/config`: environment + MongoDB connection (`env.ts`, `database.ts`).
  - `src/models`: `Song` schema with `title`, `artist`, `album`, `genre` and indexes for stats.
  - `src/services`: business logic and aggregation (`songService.ts` with `computeStats`).
  - `src/controllers`: HTTP controllers (`songController.ts`, `statsController.ts`).
  - `src/routes`: REST routes (`songs.ts` exposes CRUD + `/songs/stats`).
  - `src/utils`: `ApiError`, centralized `errorHandler`, and `validateSongPayload`.
  - `backend/Dockerfile`: multi‑stage build (TypeScript → dist → minimal runtime).

- **Frontend (React, TypeScript, Redux Toolkit, Redux‑Saga, Emotion)**
  - `src/redux`: `songsSlice`, `statsSlice`, typed store and hooks.
  - `src/sagas`: `songsSagas` (CRUD + refresh stats), `statsSagas` (load stats).
  - `src/services/api.ts`: Axios client using `VITE_API_BASE_URL` (defaults to `http://localhost:5000`).
  - `src/components`: `SongForm`, `SongList` (with genre filter).
  - `src/features/stats/StatsDashboard.tsx`: shows totals, per‑genre/artist/album stats, top genres, latest songs.
  - `src/app/App.tsx`: layout with modern gradient background and glassmorphism cards.

### Running the Backend (Node + Docker)

**1. Prerequisites**
- Node.js 18+
- MongoDB running locally (e.g. `mongodb://localhost:27017/songdb`)  
  or via Docker:
  ```bash
  docker run -d --name mongo -p 27017:27017 mongo
  ```

**2. Local (no Docker)**
```bash
cd backend
npm install

# Optional: create .env (or use defaults)
echo PORT=5000        >> .env
echo MONGODB_URI=mongodb://localhost:27017/songdb >> .env

# Development
npm run dev

# Production
npm run build
npm start
```

**3. With Docker**
```bash
cd backend
docker build -t song-backend .

# On Windows with local MongoDB, use host.docker.internal to reach the host DB
docker run -p 5000:5000 ^
  -e MONGODB_URI=mongodb://host.docker.internal:27017/songdb ^
  --name song-backend song-backend
```

The backend will be available at `http://localhost:5000` with:
- `GET /health` – health check
- `POST /songs`, `GET /songs`, `GET /songs/:id`, `PUT /songs/:id`, `DELETE /songs/:id`
- `GET /songs/stats` – aggregated statistics

### Running the Frontend

**1. Install and run in development**
```bash
cd frontend
npm install

# If backend is on localhost:5000, this is enough:
npm run dev

# Or explicitly:
VITE_API_BASE_URL=http://localhost:5000 npm run dev
```
The app will be available at the Vite dev URL (typically `http://localhost:5173`).

**2. Build for production**
```bash
cd frontend
npm run build
```
This creates a static bundle in `frontend/dist` which you can serve with any static host (Vercel, Netlify, Nginx, etc.).  
Set `VITE_API_BASE_URL` in your hosting environment to point to the deployed backend URL.