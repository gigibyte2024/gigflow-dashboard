# GigFlow Dashboard — API Documentation

A CRM-style backend for managing sales leads and users.  
Built with Node.js, Express, MongoDB, and JWT authentication.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Base URL](#2-base-url)
3. [Authentication Flow](#3-authentication-flow)
4. [Environment Variables](#4-environment-variables)
5. [Setup Instructions](#5-setup-instructions)
6. [Folder Structure](#6-folder-structure)
7. [Status Codes](#7-status-codes)
8. [Auth API](#8-auth-api)
   - [Register User](#81-register-user)
   - [Login User](#82-login-user)
9. [Leads API](#9-leads-api)
   - [Create Lead](#91-create-lead)
   - [Get Leads](#92-get-leads)
   - [Update Lead](#93-update-lead)
   - [Delete Lead](#94-delete-lead)
10. [Protected Routes](#10-protected-routes)
11. [Role-Based Access](#11-role-based-access)
12. [Thunder Client / Postman Examples](#12-thunder-client--postman-examples)
13. [Error Reference](#13-error-reference)
14. [Deployment](#14-deployment)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Project Overview

GigFlow Dashboard is a lead management system where sales teams can track and manage their leads. It supports two user roles — `admin` and `sales` — with role-based access control on certain operations.

**What the API does:**
- Lets users register and log in with JWT
- Lets authenticated users create, view, and update leads
- Only admins can delete leads

---

## 2. Base URL

```
Production:  https://gigflow-backend-oun3.onrender.com
Local:       http://localhost:8000
```

All routes are prefixed with `/api`.

---

## 3. Authentication Flow

This API uses **JWT (JSON Web Token)** authentication.

```
1. User registers → POST /api/auth/register
2. User logs in   → POST /api/auth/login  →  receives a token
3. Token is sent in the Authorization header for protected routes
4. Token is valid for 7 days
```

**How to send the token:**

The `Authorization` header takes the raw token — **no `Bearer` prefix**.

```
Authorization: <your_jwt_token>
```

> Note: Most APIs use `Bearer <token>` but this project reads `req.headers.authorization` directly, so send the token as-is without the "Bearer" prefix.

---

## 4. Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
```

| Variable     | Required | Description                              |
|--------------|----------|------------------------------------------|
| `PORT`       | No       | Port the server runs on. Defaults to 8000 |
| `MONGO_URI`  | Yes      | Full MongoDB Atlas connection string      |
| `JWT_SECRET` | Yes      | Secret key used to sign JWT tokens        |

> On Render: add these in Dashboard → Your Service → Environment. Do NOT commit `.env` to Git.

---

## 5. Setup Instructions

### Prerequisites

Make sure you have these installed before you start:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| npm | comes with Node.js | — |
| Git | any | https://git-scm.com |
| MongoDB Atlas account | free tier works fine | https://cloud.mongodb.com |

To check if Node and npm are already installed:
```bash
node -v
npm -v
```

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/gigibyte2024/gigflow-dashboard.git
cd gigflow-dashboard
```

---

### Step 2 — Backend Setup

```bash
# Navigate to the server folder
cd server

# Install all dependencies
npm install

# Create your environment file from the example
cp .env.example .env
```

Now open the `.env` file and fill in your values:

```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=anyRandomStringHere
```

Then start the backend:

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# OR production mode (build first, then start)
npm run build
npm start
```

You should see:
```
Server running on port 8000
MongoDB Connected: <your-cluster>.mongodb.net
```

---

### Step 3 — Frontend Setup

Open a **new terminal tab** (keep the backend running in the first one).

```bash
# Navigate to the client folder from the project root
cd client

# Install all dependencies
npm install

# Start the frontend dev server
npm run dev
```

The frontend will be available at:
```
http://localhost:5173
```

---

### Step 4 — Environment Variables Explained

Create `.env` inside the `server/` folder. Here's what each variable does:

| Variable | Required | What it does |
|---|---|---|
| `PORT` | No | Port the Express server listens on. Defaults to 8000 if not set |
| `MONGO_URI` | **Yes** | Your full MongoDB Atlas connection string. Get it from Atlas → Connect → Drivers |
| `JWT_SECRET` | **Yes** | A secret string used to sign and verify JWT tokens. Make it long and random |

**Sample `.env.example`** (safe to commit — no real values):

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
```

> Never commit your actual `.env` file to Git. It's already in `.gitignore`.

---

### Step 5 — Running the Full Project

You need two terminals open at the same time:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:8000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

Open your browser and go to `http://localhost:5173` — that's your app.

---

## 6. Folder Structure

```
server/
├── src/
│   ├── server.ts          # Entry point — loads dotenv, connects DB, starts server
│   ├── app.ts             # Express app — registers routes and middleware
│   ├── config/
│   │   └── db.ts          # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.ts   # Register and Login logic
│   │   └── leadController.ts   # CRUD logic for leads
│   ├── middleware/
│   │   ├── authMiddleware.ts   # JWT verification — attaches user to request
│   │   └── roleMiddleware.ts   # Role-based access control
│   ├── models/
│   │   ├── User.ts        # Mongoose schema for users
│   │   └── Lead.ts        # Mongoose schema for leads
│   ├── routes/
│   │   ├── authRoutes.ts  # /api/auth routes
│   │   ├── leadRoutes.ts  # /api/leads routes
│   │   └── testRoutes.ts  # /api/test (health check)
│   └── utils/
│       └── generateToken.ts    # Creates signed JWT (expires in 7 days)
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 7. Status Codes

| Code | Meaning                                    |
|------|--------------------------------------------|
| 200  | OK — request succeeded                     |
| 201  | Created — resource was created             |
| 400  | Bad Request — invalid input                |
| 401  | Unauthorized — missing or invalid token    |
| 403  | Forbidden — not enough permissions (role)  |
| 404  | Not Found — resource doesn't exist         |
| 500  | Server Error — something broke on our end  |

---

## 8. Auth API

### 8.1 Register User

Creates a new user account.

| Field       | Value                          |
|-------------|-------------------------------|
| **Route**   | `POST /api/auth/register`     |
| **Auth**    | Not required                  |

**Request Body:**

```json
{
  "name": "Gargi Srivastava",
  "email": "gargi@example.com",
  "password": "mypassword123",
  "role": "sales"
}
```

**Field Rules:**

| Field      | Type   | Required | Notes                              |
|------------|--------|----------|------------------------------------|
| `name`     | String | Yes      | Full name                          |
| `email`    | String | Yes      | Must be unique across all users    |
| `password` | String | Yes      | Stored as a bcrypt hash (10 rounds)|
| `role`     | String | No       | `"admin"` or `"sales"`. Defaults to `"sales"` |

**Success Response — 201:**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "664abc123def456789012345",
    "name": "Gargi Srivastava",
    "email": "gargi@example.com",
    "role": "sales",
    "createdAt": "2024-05-16T13:52:00.000Z",
    "updatedAt": "2024-05-16T13:52:00.000Z"
  }
}
```

**Error Responses:**

```json
// 400 — Email already in use
{ "message": "User already exists" }

// 500 — Something went wrong
{ "message": "Server Error" }
```

---

### 8.2 Login User

Logs in an existing user and returns a JWT token.

| Field       | Value                       |
|-------------|----------------------------|
| **Route**   | `POST /api/auth/login`     |
| **Auth**    | Not required               |

**Request Body:**

```json
{
  "email": "gargi@example.com",
  "password": "mypassword123"
}
```

**Field Rules:**

| Field      | Type   | Required |
|------------|--------|----------|
| `email`    | String | Yes      |
| `password` | String | Yes      |

**Success Response — 200:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "664abc123def456789012345",
    "name": "Gargi Srivastava",
    "email": "gargi@example.com",
    "role": "sales",
    "createdAt": "2024-05-16T13:52:00.000Z",
    "updatedAt": "2024-05-16T13:52:00.000Z"
  }
}
```

> Save the `token` value — you'll need it in the `Authorization` header for all protected routes.

**Error Responses:**

```json
// 400 — Wrong email
{ "message": "Invalid email or password" }

// 400 — Wrong password
{ "message": "Invalid email or password" }

// 500 — Something went wrong
{ "message": "Server Error" }
```

---

## 9. Leads API

All lead routes require a valid JWT token in the `Authorization` header.

```
Authorization: <your_jwt_token>
```

---

### 9.1 Create Lead

Creates a new lead. The lead is automatically linked to the logged-in user via `createdBy`.

| Field       | Value                     |
|-------------|--------------------------|
| **Route**   | `POST /api/leads`        |
| **Auth**    | Required (any role)      |

**Request Headers:**

```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Rahul Mehta",
  "email": "rahul@company.com",
  "status": "New",
  "source": "Instagram"
}
```

**Field Rules:**

| Field    | Type   | Required | Allowed Values                              |
|----------|--------|----------|---------------------------------------------|
| `name`   | String | Yes      | Any string                                  |
| `email`  | String | Yes      | Any string (no uniqueness constraint)       |
| `status` | String | No       | `"New"`, `"Contacted"`, `"Qualified"`, `"Lost"`. Defaults to `"New"` |
| `source` | String | Yes      | `"Website"`, `"Instagram"`, `"Referral"`    |

**Success Response — 201:**

```json
{
  "message": "Lead created successfully",
  "lead": {
    "_id": "664def456abc123789012345",
    "name": "Rahul Mehta",
    "email": "rahul@company.com",
    "status": "New",
    "source": "Instagram",
    "createdBy": "664abc123def456789012345",
    "createdAt": "2024-05-16T14:00:00.000Z",
    "updatedAt": "2024-05-16T14:00:00.000Z"
  }
}
```

**Error Responses:**

```json
// 401 — No token
{ "message": "No token provided" }

// 401 — Bad token
{ "message": "Invalid token" }

// 500 — Something went wrong
{ "message": "Server Error" }
```

---

### 9.2 Get Leads

Fetches a paginated list of leads. Supports filtering, searching, and sorting.

| Field       | Value                     |
|-------------|--------------------------|
| **Route**   | `GET /api/leads`         |
| **Auth**    | Required (any role)      |

**Request Headers:**

```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

| Parameter | Type   | Required | Description                                               |
|-----------|--------|----------|-----------------------------------------------------------|
| `page`    | Number | No       | Page number. Defaults to `1`. Page size is fixed at 10    |
| `status`  | String | No       | Filter by status: `New`, `Contacted`, `Qualified`, `Lost` |
| `source`  | String | No       | Filter by source: `Website`, `Instagram`, `Referral`      |
| `search`  | String | No       | Case-insensitive search on lead `name` and `email`        |
| `sort`    | String | No       | `"oldest"` for ascending. Anything else → newest first    |

**Example Requests:**

```
# All leads (page 1)
GET /api/leads

# Filter by status
GET /api/leads?status=Contacted

# Search by name or email
GET /api/leads?search=rahul

# Filter + sort + paginate
GET /api/leads?source=Instagram&sort=oldest&page=2
```

**Success Response — 200:**

```json
{
  "leads": [
    {
      "_id": "664def456abc123789012345",
      "name": "Rahul Mehta",
      "email": "rahul@company.com",
      "status": "New",
      "source": "Instagram",
      "createdBy": "664abc123def456789012345",
      "createdAt": "2024-05-16T14:00:00.000Z",
      "updatedAt": "2024-05-16T14:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalLeads": 27
}
```

**Error Responses:**

```json
// 401 — No token / bad token
{ "message": "No token provided" }

// 500 — Something went wrong
{ "message": "Server Error" }
```

---

### 9.3 Update Lead

Updates any field of a lead by its ID.

| Field       | Value                        |
|-------------|------------------------------|
| **Route**   | `PUT /api/leads/:id`        |
| **Auth**    | Required (any role)          |

**Request Headers:**

```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**URL Parameter:**

| Param | Description                    |
|-------|-------------------------------|
| `id`  | MongoDB ObjectId of the lead   |

**Request Body:**

Send only the fields you want to update. All fields are optional.

```json
{
  "status": "Qualified"
}
```

Or update multiple fields at once:

```json
{
  "name": "Rahul M.",
  "status": "Contacted",
  "source": "Referral"
}
```

**Success Response — 200:**

```json
{
  "message": "Lead updated successfully",
  "lead": {
    "_id": "664def456abc123789012345",
    "name": "Rahul M.",
    "email": "rahul@company.com",
    "status": "Contacted",
    "source": "Referral",
    "createdBy": "664abc123def456789012345",
    "createdAt": "2024-05-16T14:00:00.000Z",
    "updatedAt": "2024-05-16T15:00:00.000Z"
  }
}
```

**Error Responses:**

```json
// 404 — Lead not found
{ "message": "Lead not found" }

// 401 — No token / bad token
{ "message": "No token provided" }

// 500 — Something went wrong
{ "message": "Server Error" }
```

---

### 9.4 Delete Lead

Deletes a lead by its ID. **Admin only.**

| Field       | Value                        |
|-------------|------------------------------|
| **Route**   | `DELETE /api/leads/:id`     |
| **Auth**    | Required — **admin role only** |

**Request Headers:**

```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**URL Parameter:**

| Param | Description                    |
|-------|-------------------------------|
| `id`  | MongoDB ObjectId of the lead   |

**Success Response — 200:**

```json
{
  "message": "Lead deleted successfully"
}
```

**Error Responses:**

```json
// 403 — Logged-in user is not admin
{ "message": "Access denied" }

// 404 — Lead not found
{ "message": "Lead not found" }

// 401 — No token / bad token
{ "message": "No token provided" }

// 500 — Something went wrong
{ "message": "Server Error" }
```

---

## 10. Protected Routes

The `protect` middleware in `authMiddleware.ts` runs before any protected route handler.

**What it does, step by step:**

1. Reads `req.headers.authorization`
2. If missing → returns `401 No token provided`
3. Verifies the token using `JWT_SECRET`
4. If invalid/expired → returns `401 Invalid token`
5. Looks up the user by the `id` stored in the token payload
6. Attaches the full user object (minus password) to `req.user`
7. Calls `next()` — the actual route handler runs

```
Client  →  Authorization: <token>  →  protect middleware  →  route handler
                                           ↓ fail
                                       401 Unauthorized
```

---

## 11. Role-Based Access

The `allowRoles` middleware in `roleMiddleware.ts` restricts certain routes by role.

| Role    | Can create leads | Can view leads | Can update leads | Can delete leads |
|---------|-----------------|----------------|-----------------|-----------------|
| `sales` | ✅ Yes          | ✅ Yes         | ✅ Yes          | ❌ No           |
| `admin` | ✅ Yes          | ✅ Yes         | ✅ Yes          | ✅ Yes          |

The only route that uses `allowRoles` is `DELETE /api/leads/:id` — restricted to `admin`.

If a `sales` user tries to delete a lead:
```json
// 403
{ "message": "Access denied" }
```

---

## 12. Thunder Client / Postman Examples

### Step 1 — Register

```
Method: POST
URL:    https://gigflow-backend-oun3.onrender.com/api/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test1234",
  "role": "admin"
}
```

### Step 2 — Login and copy token

```
Method: POST
URL:    https://gigflow-backend-oun3.onrender.com/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "test1234"
}
```
→ Copy the `token` from the response.

### Step 3 — Create a Lead

```
Method: POST
URL:    https://gigflow-backend-oun3.onrender.com/api/leads
Headers:
  Authorization: <paste token here>
  Content-Type: application/json
Body (JSON):
{
  "name": "New Client",
  "email": "client@biz.com",
  "status": "New",
  "source": "Website"
}
```

### Step 4 — Get Leads with filters

```
Method: GET
URL:    https://gigflow-backend-oun3.onrender.com/api/leads?status=New&source=Website&page=1
Headers:
  Authorization: <paste token here>
```

### Step 5 — Update a Lead

```
Method: PUT
URL:    https://gigflow-backend-oun3.onrender.com/api/leads/664def456abc123789012345
Headers:
  Authorization: <paste token here>
  Content-Type: application/json
Body (JSON):
{
  "status": "Qualified"
}
```

### Step 6 — Delete a Lead (admin only)

```
Method: DELETE
URL:    https://gigflow-backend-oun3.onrender.com/api/leads/664def456abc123789012345
Headers:
  Authorization: <paste token here>
```

---

## 13. Error Reference

| Message                    | Status | When it happens                                  |
|----------------------------|--------|--------------------------------------------------|
| `User already exists`      | 400    | Email already registered                         |
| `Invalid email or password`| 400    | Login with wrong email or password               |
| `No token provided`        | 401    | Authorization header is missing                  |
| `Invalid token`            | 401    | Token is expired, tampered, or malformed         |
| `User not found`           | 401    | Token is valid but user was deleted from DB      |
| `Access denied`            | 403    | `sales` user tried to delete a lead              |
| `Lead not found`           | 404    | No lead with the given ID exists                 |
| `Server Error`             | 500    | Unhandled error — check server logs              |

---

## 14. Deployment

### Backend — Render

1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Configure the service:

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Environment | `Node` |

5. Add your environment variables under **Environment** tab:
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — your secret key
6. Click **Deploy**

> Important: Go to MongoDB Atlas → **Network Access** → add `0.0.0.0/0` so Render's servers can connect.

---

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Configure:

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. Click **Deploy**

Vercel auto-deploys every time you push to `main`.

> Make sure the backend URL in your frontend files points to your live Render URL (e.g. `https://gigflow-backend-oun3.onrender.com`) and not `localhost`.

---

## 15. Troubleshooting

### MongoDB connection fails

**Error:** `MongoServerError: bad auth` or `buffering timed out after 10000ms`

Things to check:
- Is `MONGO_URI` set in your environment? On Render, you need to add it manually in the dashboard — it doesn't read `.env` files.
- Does your Atlas password have special characters like `@`, `#`, `/`? If yes, URL-encode them. Run: `node -e "console.log(encodeURIComponent('your_password'))"`
- Go to Atlas → **Network Access** → make sure `0.0.0.0/0` is whitelisted (especially on Render where IPs are dynamic)
- Double-check the username in your URI matches exactly what's in Atlas → **Database Access**

---

### CORS issue

**Error:** `Access to fetch blocked by CORS policy`

The backend currently allows all origins (`origin: "*"` in `app.ts`). If you're still seeing CORS errors:
- Make sure you're hitting the correct backend URL (not localhost when deployed)
- Make sure you're not missing `Content-Type: application/json` in your request headers
- Restart the backend after making any CORS config changes

---

### Port already in use

**Error:** `EADDRINUSE: address already in use :::8000`

Something else is already running on port 8000. Fix options:

```bash
# Option 1: Kill whatever is using the port
lsof -ti:8000 | xargs kill

# Option 2: Use a different port
# In your .env, change PORT=8001
# Then restart the server
```

---

### Invalid JWT token

**Error:** `{ "message": "Invalid token" }` on a protected route

Common reasons:
- You copy-pasted the token with a trailing space — paste it again carefully
- The token expired (they last 7 days)
- You're sending `Bearer <token>` — this API expects the raw token without the "Bearer" prefix
- `JWT_SECRET` changed between when the token was issued and now — log in again to get a fresh token

---

### Environment variables missing

**Error:** `FATAL: MONGO_URI is not defined in environment variables`

This means the `.env` file wasn't loaded or the variable wasn't set.

Locally:
- Make sure `.env` exists inside the `server/` folder (not the project root)
- Make sure `dotenv.config()` is called before anything else in `server.ts`

On Render:
- `.env` files are not deployed — you must add variables manually in the Render dashboard under **Environment**
- After adding them, trigger a **Manual Deploy** so the new values take effect

---

*Documentation written for GigFlow Dashboard v1.0 — May 2024*
