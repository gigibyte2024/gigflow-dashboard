# GigFlow – Smart Leads Dashboard

A simple full-stack leads management dashboard built as part of the ServiceHive Full Stack Development Internship assignment.

The project allows users to:

* register/login securely
* manage leads
* filter and search leads
* update lead statuses
* perform role-based actions

The goal of this project was to build a clean and practical CRM-style dashboard while keeping the codebase simple, readable, and easy to explain.

---

# Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication

---

# Features

## Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes
* Logout Functionality

## Leads Management

* Create Lead
* View Leads
* Update Lead Status
* Delete Lead

## Filtering & Search

* Search leads by name/email
* Filter by status
* Filter by source

## Access Control

* Admin users can delete leads
* Sales users cannot delete leads

---

# Folder Structure

## Client

```bash
client/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── App.tsx
 │   └── main.tsx
```

## Server

```bash
server/
 ├── src/
 │   ├── controllers/
 │   ├── middleware/
 │   ├── models/
 │   ├── routes/
 │   ├── config/
 │   ├── app.ts
 │   └── server.ts
```

---

# Environment Variables

Create a `.env` file inside the server folder.

Example:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# Installation Steps

## Clone Repository

```bash
git clone YOUR_GITHUB_REPO_LINK
```

---

# Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend runs on:

```bash
https://gigflow-backend-oun3.onrender.com
```

---

# Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```bash
http://127.0.0.1:5173
```

---

# API Routes

## Auth Routes

```bash
POST /api/auth/register
POST /api/auth/login
```

## Lead Routes

```bash
GET /api/leads
POST /api/leads
PUT /api/leads/:id
DELETE /api/leads/:id
```

---

# Notes

This project was intentionally kept simple and modular so that the complete workflow and logic can be easily understood and explained.

The focus was mainly on:

* backend functionality
* authentication flow
* CRUD operations
* API integration
* practical dashboard features

instead of using heavy templates or unnecessary complexity.

---

# Author

Gargi Srivastava
