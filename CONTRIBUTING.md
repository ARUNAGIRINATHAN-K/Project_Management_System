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

## Development Setup

-   **Architecture:** The project is a client-only React SPA. All data is persisted locally in the browser using Redux and `localStorage`. No backend database setup is required.
-   Use **ReactJS** and **Tailwind CSS**
-   Run `npm run dev` for local development.
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

Here are some areas where you can contribute to improve and expand the Project Management app:

### Core UI Features

- **Project Management**
  - [ ] Enhance **project list views** and **project detail pages**
  - [x] Add **project cards** with dynamic status tags, calculated progress bars, and color-coded deadlines
  - [x] Implement **project filtering and sorting** UI (Alphabetical, Deadline, Progress, Status)

- **Task Management**
  - [x] Build **Kanban-style drag-and-drop boards** for tasks
  - [x] Enhance UI for **task comments, subtasks, and attachments**
  - [x] Implement **task assignment indicators** and quick actions

---

### UI/UX Improvements
- [x] Improve **responsive design** for mobile and tablet
- [x] Create **skeleton loaders** and **loading states**
- [ ] Enhance **accessibility** (keyboard navigation, ARIA roles, color contrast)
- [x] Improve **dashboard layout** with analytics cards (task progress, project summary)

---

### Frontend Technical Enhancements
- [ ] Refactor UI components into **reusable and modular components**
- [ ] Improve **form handling and validation** 
- [x] Add **error boundaries** and **fallback UI components**

---

### Interactivity & Animations
- [ ] Enhance **drag-and-drop interactions** for tasks/projects
- [x] Enhance **smooth animations** for modals, page transitions, and task movements
- [ ] Implement **interactive filters and search bars**
- [ ] Add **tooltips, popovers, and hover effects** for better UX
