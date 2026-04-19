# SmartPlan Module API (JWT)

Base URL: `{APP_URL}/api` (e.g. `http://localhost:8000/api`).

All **Module** responses use this envelope:

**Success:** `{ "success": true, "data": { ... }, "message": "..." }`  
**Error:** `{ "success": false, "error": "...", "code": <number> }`

Set `JWT_SECRET` in `.env` (required for JWT issuance). Access tokens expire in **7 days** (`JWT_TTL_SECONDS`, default `604800`).

## Auth flow (text)

1. `POST /api/auth/register` or `POST /api/auth/login` → receive `data.token` (JWT).
2. Send `Authorization: Bearer <token>` on protected routes.
3. `POST /api/auth/logout` returns success (stateless JWT; discard token client-side).
4. Forgot password: `POST /api/auth/forgot-password` → server logs reset URL with token; `POST /api/auth/reset-password` with `token` + `new_password`.

```
[Client] --register/login--> [API] --JWT--> [Client]
[Client] --Bearer JWT--> [jwt.auth middleware] --user--> [Controller]
```

---

## Rate limiting

All routes under `POST /api/auth/register`, `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password` are limited to **10 requests per minute per IP** (`429` + standard error envelope).

---

## Endpoints

### POST `/api/auth/register`

- **Auth:** no  
- **Body:** `{ "name": string, "email": string, "password": string (min 8) }`  
- **201 example:**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "token": "<jwt>",
    "user": { "id": 1, "name": "...", "email": "...", "role": "user", "plan": "free" }
  }
}
```

### POST `/api/auth/login`

- **Auth:** no  
- **Body:** `{ "email": string, "password": string }`  
- **200 example:** same shape as register `data`.  
- **401:** invalid credentials.

### POST `/api/auth/logout`

- **Auth:** Bearer JWT  
- **Body:** none  
- **200:** `{ "success": true, "data": [], "message": "Logged out successfully." }`

### POST `/api/auth/forgot-password`

- **Auth:** no  
- **Body:** `{ "email": string }`  
- **200:** Always same message (no email enumeration). Server logs: `Reset link: /reset-password?token=<uuid>`.

### POST `/api/auth/reset-password`

- **Auth:** no  
- **Body:** `{ "token": string, "new_password": string (min 8) }`  
- **400:** invalid/expired token.

### GET `/api/auth/me`

- **Auth:** Bearer JWT  
- **200:** `{ "success": true, "data": { "id", "name", "email", "role", "plan" }, "message": "Profile loaded." }`

---

### GET `/api/projects`

- **Auth:** Bearer JWT  
- **Query:** `?search=<text>` (LIKE on name), `?status=<status>`  
- **200:** `data` = array of projects with nested `preferences` (or `null`), sorted by `created_at` desc.

### POST `/api/projects`

- **Auth:** Bearer JWT  
- **Body:** `{ "name": string, "mode": "residential"|"commercial"|"office"|"other" }`  
- **201:** created project.

### GET `/api/projects/{id}`

- **Auth:** Bearer JWT  
- **403:** not owner  
- **404:** not found  

### PUT `/api/projects/{id}`

- **Auth:** Bearer JWT  
- **Body:** optional `name`, `mode`, `status`  
- **403 / 404** as above.

### DELETE `/api/projects/{id}`

- **Auth:** Bearer JWT  
- **200:** project deleted (preferences removed via cascade).

### POST `/api/projects/{id}/duplicate`

- **Auth:** Bearer JWT  
- **201:** duplicate with name `Copy of <original>`; copies preferences if present.

### PUT `/api/projects/{id}/preferences`

- **Auth:** Bearer JWT  
- **Body:** optional `budget`, `style`, `colors` (array), `usage`, `furniture` (boolean)  
- **200:** preferences object (upsert).

### GET `/api/dashboard/metrics`

- **Auth:** Bearer JWT  
- **200 example:**
```json
{
  "success": true,
  "message": "Dashboard metrics loaded.",
  "data": {
    "total_projects": 3,
    "active_projects": 2,
    "plan_status": "free",
    "recent_projects": [
      { "id": 1, "name": "...", "mode": "residential", "status": "active", "created_at": "..." }
    ],
    "monthly_usage": 1
  }
}
```

---

## Legacy v1 API (unchanged)

Sanctum routes remain under `/api/v1/...` (see `routes/api.php`). Laravel’s password broker uses table `laravel_password_reset_tokens` after migration rename; Module forgot/reset uses `password_reset_tokens` with `user_id`.
