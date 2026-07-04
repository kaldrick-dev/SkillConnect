# SkillConnect Frontend (React)

Client for the Virtual Internship Platform. Provides the UI for students,
mentors, employers, and admins to log in, browse/apply to internships, manage
tasks and submissions, track progress, and view certificates.

Not scaffolded yet. Suggested setup:

```bash
cd frontend
npm create vite@latest . -- --template react   # or: npx create-react-app .
npm install
npm install axios react-router-dom
```

## Suggested structure

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/       # Reusable UI components (shared across pages)
│   ├── pages/
│   │   ├── auth/         # Login, register
│   │   ├── student/      # Browse/apply internships, tasks, submissions, certificates
│   │   ├── mentor/       # Review performance, assigned students
│   │   ├── employer/     # Post internships, manage applicants
│   │   └── admin/        # User management, platform stats
│   ├── context/          # e.g. AuthContext for the logged-in user/JWT
│   ├── services/         # API client (axios instance pointed at the Flask backend)
│   ├── routes/           # App route definitions, role-protected routes
│   ├── App.jsx
│   └── main.jsx
├── .env.example           # e.g. VITE_API_URL=http://localhost:5000/api
└── package.json
```

## Backend

The frontend talks to the Flask API in [`../backend`](../backend), served by
default at `http://localhost:5000/api`.
