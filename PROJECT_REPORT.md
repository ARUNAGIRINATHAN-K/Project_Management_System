# Project Management System

## Overview

This project is a React-based project management dashboard built with Vite, Tailwind CSS, Redux Toolkit, React Router, and Lucide React icons. It provides a workspace-driven experience for managing projects, tasks, team members, analytics, and task discussions.

The current implementation is a front-end prototype backed by seeded local workspace data. The application structure is already aligned with a future PostgreSQL and Prisma-backed data model defined in `src/assets/schema.prisma`.

## Key Features

- Multiple workspace support with workspace switching.
- Dashboard with summary metrics, recent activity, project overview, and task summaries.
- Projects page with search and filtering by status and priority.
- Project details view with tabbed navigation for tasks, calendar, analytics, and settings.
- Task details view with discussion comments and task metadata.
- Team page for member visibility and role review.
- Dark mode support with persisted theme selection.
- Toast notifications for user actions.

## Installation

### Prerequisites

- Node.js 18 or newer
- npm

### Setup

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open the app in your browser at the Vite development URL shown in the terminal, typically `http://localhost:5173`.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Usage

1. Open the app and land on the dashboard for the currently selected workspace.
2. Use the sidebar workspace switcher to change the active workspace.
3. Go to Projects to browse, search, and filter project cards.
4. Open a project card to view project tasks, calendar, analytics, and settings.
5. Open a task from the project tasks table or My Tasks sidebar to view task discussion and metadata.
6. Use the Team page to inspect members and invite collaborators.

Note: project creation, member invitations, and several edit flows are present in the UI but currently use placeholder submit handlers.

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.