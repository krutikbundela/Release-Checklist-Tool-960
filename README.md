# ReleaseCheck ✅

A full-stack release checklist application to track and manage software releases. Built with React, Redux Toolkit, Material UI on the frontend and Express, TypeScript, TypeORM, and PostgreSQL on the backend.

---

## Screenshots

### Release List Page
<!-- Add your screenshot below -->
![Release List Page](screenshots/release-list.png)

### Release Detail Page
<!-- Add your screenshot below -->
![Release Detail Page](screenshots/release-detail.png)

### Create Release Dialog
<!-- Add your screenshot below -->
![Create Release Dialog](screenshots/create-release.png)

---

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** — fast dev server & build tool
- **Redux Toolkit** — state management
- **Axios** — HTTP client for API requests
- **Material UI (MUI)** — component library
- **React Router** — client-side routing

### Backend
- **Express 5** with TypeScript
- **PostgreSQL** (Neon) — database
- **TypeORM** — robust Object-Relational Mapping (ORM)
- **Zod** — strictly-typed environment variable validation (`env.ts`)
- **Helmet & Rate Limit** — pre-configured security headers and DDoS protection

---

## Features

- Create, view, edit, and delete releases
- 7-step release checklist with auto-computed status (`Planned` → `Ongoing` → `Done`)
- Additional remarks / notes per release
- Loading indicators on save and create actions
- Clean, modern UI with purple accent theme
- Production-ready security (CORS isolation, Helmet, Rate Limiter)
- Dockerized backend for instant local PostgreSQL setup

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** database (or Docker to run it locally)

### 1. Clone the repository

```bash
git clone https://github.com/krutikbundela/Release-Checklist-Tool-960.git
cd Release-Checklist-Tool-960
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory by copying the sample:

```bash
cp .env.sample .env
```
Inside your `backend/.env`, you must at least configure the `DATABASE_URL`:
```env
DATABASE_URL=your_postgresql_connection_string
PORT=5000
TYPEORM_SYNC=false
FRONTEND_URL=http://localhost:5173
```
*(Zod automatically applies default values for PORT, TYPEORM_SYNC, and FRONTEND_URL if omitted).*

Start the backend server:

```bash
npm run dev
```

### 3. Backend via Docker (Alternative)

If you have Docker and Docker Compose installed, you can spin up the backend API alongside a fresh local PostgreSQL database with a single command:

```bash
cd backend
cp .env.sample .env
# Edit .env to set DATABASE_URL=postgres://postgres:password@db:5432/releasecheck and TYPEORM_SYNC=true
docker-compose up --build
```

### 4. Frontend Setup

```bash
cd frontend
npm install
# If you have an .env.sample in the frontend, copy it:
# cp .env.sample .env
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## Building for Production

Both ends can be compiled for production:

**Backend:**
```bash
cd backend
npm run build
# Outputs to backend/dist/
```

**Frontend:**
```bash
cd frontend
npm run build
# Outputs optimized static files to frontend/dist/
```

---

## API Endpoints

| Method   | Endpoint              | Description              |
|----------|-----------------------|--------------------------|
| `GET`    | `/api/releases`       | Fetch all releases       |
| `POST`   | `/api/releases`       | Create a new release     |
| `PATCH`  | `/api/releases/:id`   | Update a release         |
| `DELETE` | `/api/releases/:id`   | Delete a release         |

---

## Database Schema (TypeORM Entity)

```typescript
@Entity("releases")
export class Release {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "date" })
  release_date!: string;

  @Column({ type: "varchar", length: 50, default: "planned" })
  status!: string;

  @Column("boolean", { array: true, default: [false, false, false, false, false, false, false] })
  steps!: boolean[];

  @Column({ type: "text", nullable: true })
  additional_info!: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
```