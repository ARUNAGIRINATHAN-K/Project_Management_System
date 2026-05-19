<div align="center">
  <h1>📋 Project Management System</h1>
  <p>A full-stack, multi-tenant project management platform built with React, Redux Toolkit, Express, Prisma, and PostgreSQL (Neon).</p>

  <!-- Tech Stack Logos -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit">
    <img src="https://img.shields.io/badge/Node.js-1A1A1A?style=for-the-badge&logo=nodedotjs&logoColor=339933" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  </p>
</div>

---

## ✨ Features
* **Workspaces:** Multi-tenant workspace configurations with dedicated lists of members and organizational profiles.
* **Kanban Task Board:** Interactive grid layouts showing status columns (`TODO`, `IN_PROGRESS`, `DONE`) with details editing.
* **Calendar View:** Visualize task timelines, deadlines, and project schedules dynamically.
* **Performance Analytics:** Visual charts displaying progress metrics, priority counts, and status breakdowns.
* **Settings Dashboards:** Comprehensive controls to edit workspace names/descriptions, update individual project details (dates, status, priority), and add team members.
* **Team Views:** Modern responsive grid and tabular layouts displaying users, roles, and emails.

---

## 🛠️ Architecture & Tech Stack
* **Frontend:** Built with React 18, Vite, Tailwind CSS, Lucide icons, and React Redux (Toolkit) for state management.
* **Backend:** REST API built with Node.js & Express.
* **Database & ORM:** Neon Serverless PostgreSQL database utilizing Prisma ORM.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- A running PostgreSQL database (e.g., Neon serverless database)

### Installation & Configuration

#### 1. Clone the repository
```bash
git clone https://github.com/ARUNAGIRINATHAN-K/Project_Management_System.git
cd Project_Management_System
```

#### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and define your database connection string:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"
   ```
4. Push the schema to your database:
   ```bash
   npx prisma db push
   ```
5. Seed initial data (optional):
   ```bash
   # Run the server first (see next step) and then send a POST request to seed
   curl -X POST http://localhost:5000/api/seed
   ```
6. Start the server in development mode:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

#### 3. Frontend Setup
1. Open a new terminal session and return to the root folder:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure
```text
├── src/                      # Frontend source
│   ├── assets/               # Local static resources & mock helpers
│   ├── components/           # Reusable React components (modals, dialogs, dropdowns)
│   ├── features/             # Redux Slices (workspaceSlice)
│   ├── pages/                # Page views (Dashboard, Team, Projects, Settings)
│   ├── App.jsx               # Application routing entrypoint
│   └── main.jsx              # DOM rendering root
├── server/                   # Backend source
│   ├── prisma/               # Database ORM schema definition
│   │   └── schema.prisma     # Prisma data models
│   ├── index.js              # Express API router & controller logic
│   └── package.json          # Backend scripts & configurations
```

---

## 🏗️ High-Level System Architecture

The following diagram illustrates the relationship between the React frontend, Express API server, and Neon PostgreSQL database:

```mermaid
graph TD
    subgraph Client [React Frontend SPA]
        A[React View Layer] <--> B[Redux State / Thunks]
    end

    subgraph API [Express Backend API]
        C[Express Router] --> D[Translation Middleware]
        D --> E[Prisma Client]
    end

    subgraph Database [PostgreSQL Cloud]
        F[Neon SQL Instance]
    end

    B <-->|HTTP JSON REST API| C
    E <-->|Queries / Connection Pool| F
```

* **Vite React Client:** Handles user interactions, routing, and optimistic state updates via Redux Toolkit. Communicates asynchronously with the backend.
* **Express.js API Server:** Receives REST requests, applies translation helpers to handle key casing mismatches (e.g. converting `snake_case` fields from the client to Prisma's required `camelCase`), and delegates data retrieval.
* **Prisma ORM & PostgreSQL:** Connects to the serverless PostgreSQL host using type-safe queries.

---

## 🌐 Deployment & Infrastructure

### Staging & Production Hosting Recommendation

1. **Frontend (Vite App):**
   * **Host:** Deploy to **Vercel** or **Netlify**.
   * **Process:** Configure build command as `npm run build` and output directory as `dist`.
   * **Routing:** Add a rewrite rule (`_redirects` or `vercel.json`) redirection `/.*` to `index.html` to support client-side React Router navigation.

2. **Backend (Express API):**
   * **Host:** Deploy to **Render**, **Railway**, or **AWS ECS** (Docker).
   * **Process:** Start using `npm start` (which runs `node index.js`).
   * **CORS Config:** Make sure to restrict CORS domains to only your deployed frontend's URL in production.

3. **Database (Neon Serverless PostgreSQL):**
   * **Pooling:** In serverless or container environments, append pooling parameters to your database connection URI:
     ```env
     DATABASE_URL="postgresql://user:password@neon-host-pooler/dbname?sslmode=require&pgbouncer=true"
     ```
   * **Migrations:** Run migrations during the deployment build phase (`npx prisma migrate deploy`).

---

## 📄 Technical Decision Records (ADRs)

We document major architectural decisions as ADRs in the `docs/adr/` directory to record context and consequences:

* **[ADR-0001: Migration to Neon Relational Database](docs/adr/0001-migration-to-full-stack-postgres.md)** — Relates the reasons and schema architecture decisions transitioning from mock localStorage to a SQL layer.
* **[ADR-0002: Stacking Context Escape via React Portals](docs/adr/0002-modal-stacking-context-escape-react-portals.md)** — Relates the implementation details resolved for trapped modals inside animated layout wrappers.
* **[ADR-0003: Property Translation Middleware](docs/adr/0003-snake-case-to-camel-case-mapper.md)** — Details how backend casework mapping resolves discrepancies between case conventions (camelCase vs. snake_case).

---

## 🤝 Contributing
Please see [CONTRIBUTING.md](./CONTRIBUTING.md) to get started with contribution guidelines.

## 📄 License
MIT — see [LICENSE](./LICENSE) for details.