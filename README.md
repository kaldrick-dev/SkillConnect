# SkillConnect

SkillConnect is a virtual internship platform where students complete practical
company projects, employers manage opportunities and submissions, mentors give
feedback, and administrators monitor the platform.
## Demo Video

https://youtu.be/RowoXTLyiCc

## Project structure

```text
SkillConnect/
├── backend/       Flask API, SQLAlchemy models, migrations, and pytest tests
├── frontend/      React application built with Vite
└── Procfile       Production Gunicorn process command
```

## Prerequisites

- Python 3.9 or newer
- Node.js 20 or newer
- npm
- MySQL for normal development and production

The backend tests use an in-memory SQLite database, so MySQL is not required to
run the automated test suite.

## Run the project locally

The backend and frontend run as separate processes. Open two terminals from the
repository root.

Admin Account

Email: admin.demo@skillconnect.test
Password: Demo_Admin@2026
Role: admin
Admin portal: /admin

### 1. Configure and run the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

On Windows PowerShell, activate the environment with:

```powershell
.venv\Scripts\Activate.ps1
```

Edit `backend/.env` and replace the example secrets and database connection:

```dotenv
SECRET_KEY=replace-with-a-random-secret
JWT_SECRET_KEY=replace-with-another-random-secret
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/skillconnect
```

Create the MySQL database if it does not exist, then apply the checked-in
migrations:

```bash
flask --app run.py db upgrade
```

Start the API:

```bash
python run.py
```

The API runs at `http://127.0.0.1:8000`. Useful checks:

- Health check: `http://127.0.0.1:8000/api/health`
- API documentation: `http://127.0.0.1:8000/api/docs`

### 2. Install and run the frontend

In the second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. During local
development, Vite proxies `/api` requests to `http://127.0.0.1:8000`.

To use a backend at another address:

```bash
VITE_BACKEND_URL=http://localhost:9000 npm run dev
```

## Test and verify the project

### Backend tests

Install the development dependencies once:

```bash
cd backend
source .venv/bin/activate
pip install -r requirements-dev.txt
```

Run the complete backend test suite:

```bash
python -m pytest -q
```

For verbose output:

```bash
python -m pytest -v
```

The tests create an isolated in-memory SQLite database and do not modify the
database configured in `backend/.env`.

### Frontend verification

The frontend does not currently have an automated component test suite. Use the
production build as the required verification check:

```bash
cd frontend
npm ci
npm run build
```

Optionally serve the generated production build:

```bash
npm run preview
```

Then manually verify login, role navigation, opportunities, student tasks,
employer reviews, mentor assessments, the Community directory, and admin user
management.

## Production server

From the repository root, the included `Procfile` starts Gunicorn with:

```bash
gunicorn --chdir backend --bind 0.0.0.0:$PORT run:app
```

When running directly from `backend/`, use:

```bash
gunicorn --bind 0.0.0.0:${PORT:-8000} run:app
```

Set secure `SECRET_KEY`, `JWT_SECRET_KEY`, and `DATABASE_URL` environment
variables in the deployment environment. For lower API latency, deploy the
backend in the same region as the database.

## Common commands

| Task | Command |
| --- | --- |
| Start backend | `cd backend && python run.py` |
| Apply migrations | `cd backend && flask --app run.py db upgrade` |
| Run backend tests | `cd backend && python -m pytest -q` |
| Start frontend | `cd frontend && npm run dev` |
| Build frontend | `cd frontend && npm run build` |

## Team

- Rene Guido Kayigamba — Frontend Developer
- Aldrick Kalisa — System Architect
- David Irihose — Backend Engineer
- Kizito Imena — Database Engineer
- Ganza Gavin — Documentation Lead
- Butera Irebe Asnath — UI/UX
