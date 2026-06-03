# Optio local bring-up plan (macOS)

## Goal
Bring up the existing app with software versions close to the original runtime first, then stage upgrades.

## What the repo currently expects
- Frontend: Create React App 4 + React 17 (see package dependencies).
- Backend: Flask/Connexion app in `rest_api`.
- Database: MongoDB on `localhost:27017`.
- Dev mode wiring: frontend calls backend at `http://localhost:5000/api/` when the browser host is `localhost`.

## Phase 1 — Legacy baseline (no upgrades yet)

### 1) Toolchain targets
- Node: 16.20.x
- npm: 8.x
- Python: 3.10.x
- MongoDB: 5.0.x if available, otherwise the nearest stable local equivalent

### 2) Install base tools (Homebrew)
- `brew install nvm pyenv`
- Optional for local DB without Docker: `brew tap mongodb/brew && brew install mongodb-community@5.0`

### 3) Node setup
- `export NVM_DIR="$HOME/.nvm"`
- `source "$(brew --prefix nvm)/nvm.sh"`
- `nvm install 16.20.2`
- `nvm use 16.20.2`
- In repo root: `npm ci` (fallback: `npm install --legacy-peer-deps`)

### 4) Python setup
- `pyenv install 3.10.14`
- `pyenv local 3.10.14`
- `python -m venv .venv`
- `source .venv/bin/activate`
- `pip install --upgrade pip setuptools wheel`
- `pip install -r rest_api/requirements-legacy.txt`

### 5) MongoDB setup
Option A (recommended if available): Homebrew service
- `brew services start mongodb-community@5.0`

Option B (if Homebrew formula is unavailable): run MongoDB 5 in Docker.

Current macOS note:
- Homebrew no longer exposes `mongodb-community@5.0`.
- A practical baseline on macOS today is `mongodb-community@7.0`, which works with the current local API code.

### 6) Seed a starter map
From the repo root:
- `npm run seed:local-map`

This creates a default `local-dev-map` record and makes it the selected map for local development.

### 7) Start app in dev mode
Terminal 1 (repo root):
- `npm run start:local`

Why:
- the checked-in `npm start` script forces `PORT=80`, which is inconvenient on macOS for normal user-level local development.

Terminal 2 (repo root):
- `npm run backend:local`

Expected endpoints:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/settings

## Phase 2 — Stabilize baseline
- Validate core CRUD endpoints and one full UI flow.
- Export a MongoDB snapshot for repeatability.
- Capture exact versions with:
  - `node -v`, `npm -v`
  - `python --version`
  - `pip freeze > rest_api/requirements-lock-legacy.txt`

## Phase 3 — Upgrade path (after baseline is green)
1. Backend first: move Connexion/Flask compatibility forward in small steps.
2. Frontend second: CRA 4 -> CRA 5 or Vite migration.
3. Database: MongoDB major upgrade after API tests are stable.
4. Add automation:
   - `Makefile` or npm scripts for one-command local startup.
   - CI smoke checks for API + frontend build.

## Notes
- Existing Linux deployment scripts under `install/` are Ubuntu/systemd oriented and not directly applicable to macOS.
- For local development, nginx/gunicorn are not required; direct `npm start` + `python server.py` is the fastest path.
