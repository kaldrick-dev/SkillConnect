# SkillConnect Backend (Flask API)

REST API for the Virtual Internship Platform. Serves student, mentor, employer,
and admin functionality: profiles, internship postings, task assignment,
submissions, mentorship, and certificate generation.

## Structure

```
backend/
├── app/
│   ├── __init__.py       # App factory, extension init, blueprint registration
│   ├── config.py         # Config (reads from environment / .env)
│   ├── extensions.py     # Shared extension instances (db, migrate, jwt, cors)
│   ├── models/           # SQLAlchemy models (User, Student, Mentor, Employer,
│   │                       Internship, Task, Submission, Certificate)
│   ├── routes/           # Flask Blueprints, one per resource
│   │   ├── auth.py
│   │   ├── students.py
│   │   ├── mentors.py
│   │   ├── employers.py
│   │   ├── internships.py
│   │   ├── tasks.py
│   │   ├── submissions.py
│   │   ├── certificates.py
│   │   └── admin.py
│   └── utils/            # Shared helpers (role guards, response formatting, ...)
├── migrations/            # Flask-Migrate (Alembic) migration scripts
├── tests/                 # Pytest test suite
├── .env.example           # Copy to .env and fill in secrets/DB connection
├── requirements.txt
└── run.py                 # Entrypoint
```

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # then edit values, e.g. DATABASE_URL
```

## Database

```bash
flask db init       # first time only
flask db migrate -m "initial schema"
flask db upgrade
```

## Run

```bash
flask run
# or
python run.py
```

API is served under `/api`, e.g. `GET /api/health`.

## Tech stack

- Flask — application/API framework
- Flask-SQLAlchemy — ORM
- Flask-Migrate — schema migrations
- Flask-JWT-Extended — authentication
- Flask-Cors — cross-origin requests from the React frontend
- MySQL (via PyMySQL) — primary datastore

See Chapter 3.5 of the project proposal for the full tooling rationale.
