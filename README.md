# ExamApp Mock React

ExamApp is a React exam-management application for teachers and students.

## Supported Data Modes

The project supports:

1. Browser `localStorage`
2. Local JSON through Express
3. Local PostgreSQL through Docker
4. Remote PostgreSQL

## Architecture

    React Client
         |
         | HTTP when VITE_DATA_MODE=server
         v
    Express API
         |
         +-- DATA_SOURCE=json
         |       |
         |       v
         |   server/data/db.json
         |
         +-- DATA_SOURCE=postgres
                 |
                 +-- Local Docker PostgreSQL
                 |
                 +-- Remote PostgreSQL

React never connects directly to PostgreSQL. Database access goes through the Express API.

## Requirements

- Node.js 18 or newer
- npm
- Docker
- Docker Compose

This computer uses:

    docker-compose

Newer Docker installations normally use:

    docker compose

## Installation

Install frontend dependencies:

    npm install

Install backend dependencies:

    npm --prefix server install

## Frontend Configuration

Create the frontend environment file:

    cp .env.example .env

### Browser Local Storage

Use these values in `.env`:

    VITE_DATA_MODE=client
    VITE_API_BASE_URL=http://localhost:5000/api

The Express server is not required in client mode.

### Express API Mode

Use these values in `.env`:

    VITE_DATA_MODE=server
    VITE_API_BASE_URL=http://localhost:5000/api

## Backend Configuration

Create the backend environment file:

    cp server/.env.example server/.env

### Local JSON

Use these values in `server/.env`:

    DATA_SOURCE=json
    PORT=5000

Start the server:

    npm --prefix server run dev

JSON data is stored in:

    server/data/db.json

### Local PostgreSQL with Docker

Start PostgreSQL:

    docker-compose up -d postgres

Check its status:

    docker-compose ps

Use these values in `server/.env`:

    DATA_SOURCE=postgres
    DATABASE_URL=postgresql://ameer:examapp_local_password@localhost:5433/examapp
    DB_SSL=false
    PORT=5000

Initialize the tables and demo data:

    npm --prefix server run db:init

Check the connection:

    npm --prefix server run db:check

Start the backend:

    npm --prefix server run dev

### Remote PostgreSQL

Use the remote connection in `server/.env`:

    DATA_SOURCE=postgres
    DATABASE_URL=postgresql://USER:PASSWORD@REMOTE_HOST:5432/DATABASE_NAME
    DB_SSL=true
    PORT=5000

Initialize the remote schema once:

    npm --prefix server run db:init

Start the backend:

    npm --prefix server run dev

Never commit `server/.env` because it can contain database credentials.

## Start React

In another terminal:

    npm run dev

Open the Vite URL, normally:

    http://localhost:5173

## Demo Accounts

Teacher:

- Email: `teacher@example.com`
- Password: `123456`

Student:

- Email: `student@example.com`
- Password: `123456`

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API and data source |
| GET | `/api/users` | Get users |
| GET | `/api/exams` | Get all exams |
| GET | `/api/exams/:id` | Get one exam |
| POST | `/api/exams` | Create an exam |
| PUT | `/api/exams/:id` | Update an exam |
| DELETE | `/api/exams/:id` | Delete an exam |
| GET | `/api/submissions` | Get submissions |
| POST | `/api/exams/:id/submit` | Submit an exam |
| GET | `/api/students/:id/submissions` | Get student submissions |
| GET | `/api/exams/:id/grades` | Get exam grades |

## Stop PostgreSQL

Stop the container while preserving its data:

    docker-compose down

Delete the container and its database volume:

    docker-compose down -v

Warning: `docker-compose down -v` permanently deletes the local Docker database data.

## Verification

Build the frontend:

    npm run build

Check the PostgreSQL connection:

    npm --prefix server run db:check

## Git Workflow

Development work is created on feature branches and merged into `dev`.
