# Contributing to Project Management

Thank you for considering contributing to **Project Management**!
We welcome contributions from everyone, whether it's fixing a bug, adding a new feature, or optimizing the codebase.

---

## Table of Contents

-   [How to Contribute](#how-to-contribute)
-   [Development Setup](#development-setup)
-   [Contribution Guidelines](#contribution-guidelines)
-   [Ideas for Contribution](#ideas-for-contribution)

---

## How to Contribute

1. **Fork** the repo
2. **Create a new branch** (example: `git checkout -b feature/added-about-page`)
3. **Make your changes** (UI, animations, pages, etc.)
4. **Commit and push**
5. **Open a Pull Request (PR)**

---

### Development Setup

-   **Architecture:** The project is a full-stack application. The frontend is a React application built with Vite and Tailwind CSS. The backend is an Express server connected to a serverless PostgreSQL database (via Prisma ORM).
-   **Frontend Setup:** Run `npm run dev` in the root folder.
-   **Backend Setup:** Run `npm run dev` inside the `/server` folder. Make sure to define the connection string `DATABASE_URL` in `/server/.env`.
-   Use **ReactJS**, **Tailwind CSS**, and **Express.js**
-   Keep code **clean, modular and reusable**
-   Prefer functional components and hooks
-   Follow existing folder structure and naming conventions

---

## Contribution Guidelines

-   **Small, Focused PRs** → Don’t bundle unrelated changes in one PR
-   **Commit Messages** → Use clear and descriptive messages (e.g., `feat: add new feature`, `fix: resolve issue #123`).
-   **Code Style** → Follow the existing code style (e.g., indentation, naming conventions, etc.).
-   **Accessibility** → Ensure that the website is accessible to all users
-   **Discussions First** → For large changes (new features, big design changes), discuss the changes first to avoid wasting time on implementation.
-   **Respect Others** → Follow the [Code of Conduct](./CODE_OF_CONDUCT.md)

---

## Ideas for Contribution

Here are the active areas where you can contribute to expand the Project Management app:

### Core Features & Roadmap (High Priority)

- [ ] **JWT Authentication & Multi-Tenant Isolation**
  - Add password hashing and token-based signup/login endpoints.
  - Wrap backend queries to restrict workspace access by User IDs retrieved from tokens.
  - Implement route guards on the frontend for dashboard pages.
- [ ] **Checklist Subtasks & Comments Neon DB Persistence**
  - Add DB schema models for `Subtask` and `Comment` tables linked to `Task`.
  - Refactor frontend dialogs/sidebars to save updates to the database instead of local state.
- [ ] **Real-Time Collaboration via WebSockets**
  - Integrate Socket.io on backend/frontend to sync board task cards instantly.
- [ ] **Cloud-Based File Attachments**
  - Integrate AWS S3 or Cloudinary for secure file storage on task attachments.

---

### UI/UX & Quality Improvements (Medium/Low Priority)

- [x] Enhance **project list views** and **project detail pages**
- [x] Add **project cards** with dynamic status tags, calculated progress bars, and color-coded deadlines
- [x] Implement **project filtering and sorting** UI (Alphabetical, Deadline, Progress, Status)
- [x] Build **Kanban-style drag-and-drop boards** for tasks
- [x] Improve **responsive design** for mobile and tablet
- [x] Create **skeleton loaders** and **loading states**
- [x] Enhance **accessibility** (keyboard navigation, ARIA roles, color contrast)
- [x] Improve **dashboard layout** with analytics cards (task progress, project summary)
- [x] Refactor UI components into **reusable and modular components**
- [x] Add **error boundaries** and **fallback UI components**
- [x] Enhance **smooth animations** for modals, page transitions, and task movements

---

## Completed Full-Stack Integration Items

The following features have been successfully migrated from mock local storage to the live PostgreSQL database:

- [x] **Relational Database Migration**: Migrated from browser-local Redux store to Neon PostgreSQL with schema relationships.
- [x] **REST API Development**: Created Node.js/Express server controller logic and CORS integrations.
- [x] **Asynchronous Action Creators**: Refactored frontend slice to utilize `createAsyncThunk` mapping updates to the backend API.
- [x] **Fields Mapping**: Decoupled camelCase database attributes and snake_case frontend forms seamlessly in index.js middleware.
- [x] **Modal Stacking Context Resolution**: Portalled dialog overlays outside layout elements preventing transition clips.
