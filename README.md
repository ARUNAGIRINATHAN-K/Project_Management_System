<div align="center">
  <h1>📋 Project Management System</h1>
  <p>A full-stack, multi-tenant project management platform built with React, Express, Prisma, and PostgreSQL.</p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit">
    <img src="https://img.shields.io/badge/Node.js-1A1A1A?style=for-the-badge&logo=nodedotjs&logoColor=339933" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  </p>

  <a href="https://github.com/ARUNAGIRINATHAN-K/Project_Management_System/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/ARUNAGIRINATHAN-K/Project_Management_System?style=for-the-badge">
  </a>
  <a href="https://github.com/ARUNAGIRINATHAN-K/Project_Management_System/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/ARUNAGIRINATHAN-K/Project_Management_System/issues">
    <img src="https://img.shields.io/github/issues/ARUNAGIRINATHAN-K/Project_Management_System?style=for-the-badge">
  </a>

---

## Features

| | |
|---|---|
| **Workspaces** | Multi-tenant workspaces with dedicated members and org profiles |
| **Kanban Board** | Drag-and-drop task columns — `TODO`, `IN_PROGRESS`, `DONE` |
| **Calendar View** | Visualize deadlines and task timelines dynamically |
| **Analytics** | Charts for progress, priority counts, and status breakdowns |
| **Settings** | Edit workspace/project details, dates, status, and team members |
| **Team Views** | Responsive grid and table layouts for users, roles, and emails |

</div>

---

## Architecture

```mermaid
graph TD
    subgraph Client [React Frontend]
        A[React Views] <--> B[Redux / Thunks]
    end
    subgraph API [Express Backend]
        C[Router] --> D[Case Mapper] --> E[Prisma Client]
    end
    subgraph DB [PostgreSQL · Neon]
        F[Neon Serverless]
    end
    B <-->|REST / JSON| C
    E <-->|Queries| F
```

- **React Client** — handles routing, UI, and async state via Redux Toolkit
- **Express API** — applies `snake_case → camelCase` middleware before delegating to Prisma
- **Prisma + Neon** — type-safe queries on a serverless PostgreSQL instance

---

## Getting Started

**Prerequisites:** Node.js v18+, a [Neon](https://neon.tech) PostgreSQL database

### 1. Clone

```bash
git clone https://github.com/ARUNAGIRINATHAN-K/Project_Management_System.git
cd Project_Management_System
```

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"
```

```bash
npx prisma db push
npm run dev          # → http://localhost:5000
```

Seed data (optional):
```bash
curl -X POST http://localhost:5000/api/seed
```

### 3. Frontend

```bash
cd ..
npm install
npm run dev          # → http://localhost:5173
```

---

## Project Structure

```text
├── src/
│   ├── components/       # Reusable UI (modals, dropdowns, dialogs)
│   ├── features/         # Redux slices
│   ├── pages/            # Dashboard, Team, Projects, Settings
│   ├── App.jsx           # Routing entrypoint
│   └── main.jsx          # DOM root
└── server/
    ├── prisma/
    │   └── schema.prisma # Data models
    └── index.js          # Express router + controllers
```

---

## Deployment

| Layer | Host | Notes |
|---|---|---|
| **Frontend** | Vercel / Netlify | Build: `npm run build`, output: `dist`. Add `/.*→index.html` rewrite for client-side routing. |
| **Backend** | Render / Railway | Start: `node index.js`. Restrict CORS to your frontend URL in production. |
| **Database** | Neon | Append `&pgbouncer=true` to `DATABASE_URL` for connection pooling. Run `npx prisma migrate deploy` on each deploy. |

---

## Architecture Decision Records

Documented in `docs/adr/`:

- **[ADR-001](docs/adr/0001-migration-to-full-stack-postgres.md)** — Migration from `localStorage` to Neon PostgreSQL
- **[ADR-002](docs/adr/0002-modal-stacking-context-escape-react-portals.md)** — Modal stacking context escape via React Portals
- **[ADR-003](docs/adr/0003-snake-case-to-camel-case-mapper.md)** — `snake_case ↔ camelCase` translation middleware

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

## License

MIT — see [LICENSE](./LICENSE) for details.