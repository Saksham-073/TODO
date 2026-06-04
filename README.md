# TaskMaster Pro — Full-Stack To-Do App

A full-stack todo application: a React + Redux frontend with a warm, hand-crafted
UI, backed by a Node/Express + MongoDB API with real user accounts (JWT auth) and
live weather from WeatherAPI.com.

## Features

- **Real accounts** — register & log in; passwords hashed with bcrypt, sessions via JWT
- **Per-user tasks** — each user only sees their own tasks (server-enforced)
- **Task management** — add, complete, delete; priority, category, due date, location
- **Filter & sort** — All / Active / Done, sort by newest, priority, or due date
- **Live weather** — current conditions for a task's location (WeatherAPI.com, cached)
- **Persistent** — tasks live in MongoDB Atlas, not the browser
- **Responsive, themed UI** — warm "organic" design (Fraunces + Figtree, Tailwind v4)

## Tech stack

**Frontend:** React 19 · Redux Toolkit · Tailwind CSS v4 · lucide-react · Parcel
**Backend:** Node.js · Express · MongoDB (Mongoose) · JWT · bcryptjs · zod · helmet

See [`backend/ARCHITECTURE.md`](backend/ARCHITECTURE.md) for the full backend design.

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- A MongoDB Atlas connection string
- A free WeatherAPI.com API key (https://www.weatherapi.com/)

## Installation

```bash
# from the project root
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
npm install
```

## Configuration

The backend reads `backend/.env` (already gitignored). Copy the example and fill it in:

```bash
cp backend/.env.example backend/.env
```

```
PORT=5001
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:1234
WEATHER_API_KEY=<your WeatherAPI.com key>
WEATHER_API_BASE=http://api.weatherapi.com/v1
```

The frontend defaults to `http://localhost:5001/api`; override with an `API_URL`
env var at build time if needed.

## Running the app

From the project root:

```bash
npm start
```

This runs the Express API (port **5001**) and the Parcel dev server (port **1234**)
together. Open **http://localhost:1234**.

You can also run them separately:

```bash
npm --prefix backend run dev    # API with auto-reload (nodemon)
npm --prefix frontend start     # frontend dev server
```

## Getting started

You can either create your own account or use the built-in demo.

**Create an account**
1. Open the app and use the **Create account** tab.
2. Pick a username (3–20 chars) and a password (min 6 chars), then submit.
3. You're logged in immediately and can start adding tasks.
4. Returning users switch to the **Sign in** tab. Sessions persist across refreshes
   (JWT in `localStorage`); **Sign out** clears the session.

**Demo account (for testing)**

Seed a ready-to-use demo user with sample tasks:

```bash
npm --prefix backend run seed
```

Then click **“Try the demo account”** on the login card, or sign in manually with:

```
username: demo
password: demo1234
```

> The demo account is shared — anyone testing uses the same tasks. Re-run the seed
> command anytime to reset it to a clean sample set.

## API overview

| Method | Endpoint | Auth | Purpose |
| ------ | -------- | ---- | ------- |
| GET    | `/api/health` | — | Health check |
| POST   | `/api/auth/register` | — | Create account → `{ token, user }` |
| POST   | `/api/auth/login` | — | Log in → `{ token, user }` |
| GET    | `/api/auth/me` | ✅ | Current user |
| GET    | `/api/tasks` | ✅ | List your tasks (`?filter=`, `?sort=`) |
| POST   | `/api/tasks` | ✅ | Create a task |
| PATCH  | `/api/tasks/:id` | ✅ | Update a task |
| DELETE | `/api/tasks/:id` | ✅ | Delete a task |
| GET    | `/api/weather/:location` | — | Current weather (cached) |

Protected routes require an `Authorization: Bearer <token>` header.
