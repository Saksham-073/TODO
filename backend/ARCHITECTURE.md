# TaskMaster Pro — Backend Architecture

Backend flow for the TaskMaster Pro todo app, built with **Node.js + Express + MongoDB**.
This document is the implementation plan; we build against it step by step.

The frontend already calls these endpoints: `/api/login`, `/api/logout`,
`/api/tasks`, and `/api/weather/:location`. The backend below is designed to slot
into that, upgrading it from a mock into a real, multi-user API.

---

## 1. Stack & dependencies

| Purpose            | Package                |
| ------------------ | ---------------------- |
| Server             | `express`              |
| DB + ODM           | `mongoose` (MongoDB)   |
| Password hashing   | `bcryptjs`             |
| Tokens             | `jsonwebtoken`         |
| Validation         | `zod`                  |
| CORS / security    | `cors`, `helmet`       |
| Rate limiting      | `express-rate-limit`   |
| Config             | `dotenv`               |
| Logging            | `morgan`               |
| Dev reload         | `nodemon` (dev)        |

---

## 2. Folder structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # mongoose connection
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── middleware/
│   │   ├── auth.js            # verify JWT, attach req.user
│   │   ├── validate.js        # run zod schema on req.body
│   │   └── errorHandler.js    # central error formatter
│   ├── validators/
│   │   ├── auth.schema.js
│   │   └── task.schema.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── task.controller.js
│   │   └── weather.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── task.routes.js
│   │   └── weather.routes.js
│   └── app.js                 # express app (middleware + routes)
├── server.js                  # loads env, connects DB, starts app
└── .env
```

**Why this shape:** routes → controllers → models is the standard Express
separation. Routes map URLs, controllers hold logic, models talk to Mongo.
Middleware handles cross-cutting concerns (auth, validation, errors).

---

## 3. Data models

### User

```
{
  _id,
  username   (String, required, unique, lowercased, trimmed),
  password   (String, required, hashed — never returned in responses),
  createdAt, updatedAt   (timestamps)
}
```

- Pre-save hook hashes the password with bcrypt.
- A `comparePassword(plain)` method for login.

### Task (each task belongs to one user)

```
{
  _id,
  user       (ObjectId ref 'User', required, indexed),
  text       (String, required, max 200),
  priority   (enum: 'High' | 'Medium' | 'Low', default 'Medium'),
  category   (enum: Personal/Work/Shopping/Health/Other, default 'Personal'),
  location   (String, optional),
  dueDate    (Date, optional),
  completed  (Boolean, default false),
  createdAt, updatedAt
}
```

- The `user` field is the key change from today's frontend `localStorage` model —
  every query is scoped by `req.user.id` so users only ever touch their own tasks.

---

## 4. Authentication flow

### Register — `POST /api/auth/register`

1. Validate `{ username, password }` (zod: username 3–20 chars, password min 6).
2. Check username not taken → else `409 Conflict`.
3. Hash password (bcrypt, salt rounds 10) via the User pre-save hook.
4. Save user.
5. Sign a JWT (`{ id, username }`, secret, `expiresIn: '7d'`).
6. Return `{ token, user: { id, username } }` (never the password).

### Login — `POST /api/auth/login`

1. Validate body.
2. Find user by username; if none → `401`.
3. `comparePassword` → if mismatch → `401` (generic "Invalid credentials" —
   don't reveal which field was wrong).
4. Sign JWT, return `{ token, user }`.

### Auth middleware (`auth.js`) — protects task routes

1. Read `Authorization: Bearer <token>` header.
2. `jwt.verify` with secret → if invalid/expired → `401`.
3. Attach `req.user = { id, username }`.
4. `next()`.

### Logout — `POST /api/auth/logout`

With stateless JWT, the client just deletes its token. We keep this route as a
no-op `200` so the existing frontend call still works. (True server-side logout
later = refresh tokens + a blacklist.)

**Token storage decision (frontend):** start with JWT in `localStorage` (simple,
matches current pattern). httpOnly cookies are more XSS-resistant — a later upgrade.

---

## 5. Task flow

All routes protected by auth middleware, scoped to `req.user.id`.

| Method | Endpoint          | Action                                                                                   |
| ------ | ----------------- | ---------------------------------------------------------------------------------------- |
| GET    | `/api/tasks`      | List current user's tasks. Supports `?filter=active\|completed`, `?sort=created\|priority\|dueDate`, later `?page=&limit=` |
| POST   | `/api/tasks`      | Create task (validated), `user = req.user.id`                                             |
| PATCH  | `/api/tasks/:id`  | Update text/priority/category/location/dueDate/completed                                  |
| DELETE | `/api/tasks/:id`  | Delete                                                                                    |

**Ownership guard:** every `:id` operation does
`Task.findOne({ _id: id, user: req.user.id })` — if not found → `404`. This
prevents user A from editing user B's task even by guessing the id.

> The filter/sort already built on the frontend can stay client-side initially,
> or move to these query params as data grows.

---

## 6. Weather flow — `GET /api/weather/:location`

Provider: **WeatherAPI.com** (https://www.weatherapi.com/docs/).

- Request: `GET http://api.weatherapi.com/v1/current.json?key=<WEATHER_API_KEY>&q=<location>`
- Response fields we use:
  - `current.temp_f` → `temp`
  - `current.temp_c` → `tempC`
  - `current.condition.text` → `condition`
  - `current.condition.icon` → `icon`
  - `current.humidity` → `humidity`
  - `location.name` → `resolvedName`
- Error body: `{ "error": { "code", "message" } }`. Codes:
  `1006` location not found, `1002`/`2006` key missing/invalid, `1003` q missing.

Flow:
1. Check an in-memory cache (Map with TTL, e.g. 10 min) keyed by location.
2. On miss, call WeatherAPI `current.json` with the server-side key.
3. Normalize to the shape the frontend expects: `{ temp, condition, humidity, icon, tempC }`.
4. Cache and return. Map provider errors → `404` (location not found) or `502`
   (provider/key failure) so the UI degrades gracefully.

---

## 7. Request lifecycle (middleware order in `app.js`)

```
helmet()                       → security headers
cors({ origin: CLIENT_ORIGIN })
express.json()                 → parse body
morgan('dev')                  → request logs
rateLimit (on /api/auth)       → brute-force protection
/api/auth    routes  (public)
/api/tasks   routes  (auth middleware → controller)
/api/weather routes
GET /api/health  → { status: 'ok' }   (uptime checks)
404 handler
errorHandler  (central)        → consistent JSON: { message, ... }
```

---

## 8. Environment variables (`.env`)

```
PORT=5001
MONGODB_URI=<MongoDB Atlas connection string>       # provided separately
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:1234
WEATHER_API_KEY=<WeatherAPI.com key>                # provided separately
WEATHER_API_BASE=http://api.weatherapi.com/v1
```

---

## 9. Response shapes

- **Success:** the resource directly, or `{ data, ... }`.
- **Error** (from central handler): `{ message: "human readable", errors?: [...] }`
  with the right status:
  - `400` validation
  - `401` auth
  - `404` not found
  - `409` conflict
  - `500` server

---

## 10. Frontend changes this implies (after backend is built)

- `authSlice.login` → call `/api/auth/login`, store the returned **token** (not
  just the user) in `localStorage`; add a `register` thunk + a Register form/toggle
  in `Auth.js`.
- `taskService` → already points at `/api/tasks`; add an axios interceptor that
  attaches `Authorization: Bearer <token>`.
- `todoSlice` → switch from writing tasks to `localStorage` to dispatching thunks
  that call the API; seed initial state from `GET /api/tasks` on login instead of
  localStorage. (React Query is a good later upgrade for server state.)

---

## 11. Build order (each step independently testable)

1. **Scaffold** — folder structure, `app.js`, `server.js`, Mongo connection, `/api/health`.
2. **Auth** — User model + register/login + JWT + auth middleware. Test with curl/Postman.
3. **Tasks** — Task model + CRUD scoped to user. Test with the token from step 2.
4. **Weather** — real provider + cache.
5. **Hardening** — validation, helmet, rate limit, central errors.
6. **Wire the frontend** — auth token + task thunks + Register UI.
7. **Seed script** + a few tests (supertest).

---

## Decisions (locked)

- **MongoDB:** Atlas (cloud). URI provided via `MONGODB_URI` env.
- **Token storage:** JWT in `localStorage` on the frontend.
- **Weather:** WeatherAPI.com `current.json`, key provided via `WEATHER_API_KEY`.

## Progress

- [x] Step 1 — Scaffold (structure, app.js, server.js, DB connect, `/api/health`)
- [x] Step 2 — Auth (User model, register/login, JWT, auth middleware) — tested
- [x] Step 3 — Tasks CRUD (scoped to user) — tested, incl. ownership isolation
- [x] Step 4 — Weather (WeatherAPI.com + cache) — tested live
- [~] Step 5 — Hardening — mostly done inline (helmet, CORS, auth rate-limit,
      zod validation, central error handler). Optional: global rate limiter.
- [x] Step 6 — Wire frontend (token + task thunks + Register UI) — tested e2e
- [ ] Step 7 — Seed script + tests
