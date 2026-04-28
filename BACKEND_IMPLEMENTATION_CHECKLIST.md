# Production Implementation Checklist

This checklist consolidates backend, frontend, UX, and bug-fix work needed to move the current prototype to production quality.

## Discovery and Review Tasks

- [ ] Map the exact user flow screen by screen.
- [ ] Identify backend pieces missing for production use.
- [ ] Review the app for bugs and data-model mismatches.

## Critical Bug Fixes

### Calendar Date Alignment Bug

- [ ] Fix weekday alignment in project calendar rendering so each date appears under the correct weekday.
- [ ] Add leading empty or disabled cells before day 1 of the month.
- [ ] Verify behavior for months where day 1 is not Sunday (for example, January 2026).
- [ ] Add unit and UI tests for calendar grid generation and weekday mapping.
- [ ] Validate parity against standard calendar behavior.

**Repro steps**

- [ ] Open Calendar view.
- [ ] Navigate to a month where day 1 is not Sunday.
- [ ] Confirm date placement and weekday headers align correctly.

**Acceptance criteria**

- [ ] Dates align to real-world weekdays.
- [ ] Days before the first day of month are padded with empty or disabled cells.
- [ ] Calendar visuals are consistent with common calendar products.

## P0 - Required Before Production

- [ ] Create an API server and define the service boundary for the app.
- [ ] Implement authentication and session management.
- [ ] Add authorization rules for workspace, project, and task access.
- [ ] Connect the backend to PostgreSQL using Prisma and the schema in [src/assets/schema.prisma](src/assets/schema.prisma).
- [ ] Replace seeded workspace data in [src/assets/assets.js](src/assets/assets.js) with real API-driven data.
- [ ] Implement CRUD endpoints for workspaces, projects, tasks, members, and comments.
- [ ] Wire the create/edit dialogs to real submit handlers:
  - [ ] [CreateProjectDialog.jsx](src/components/CreateProjectDialog.jsx)
  - [ ] [InviteMemberDialog.jsx](src/components/InviteMemberDialog.jsx)
  - [ ] [AddProjectMember.jsx](src/components/AddProjectMember.jsx)
  - [ ] [ProjectSettings.jsx](src/components/ProjectSettings.jsx)
  - [ ] [TaskDetails.jsx](src/pages/TaskDetails.jsx)
- [ ] Replace simulated async behavior in [ProjectTasks.jsx](src/components/ProjectTasks.jsx) with real persistence calls.
- [ ] Persist task comments and load them from the backend in [TaskDetails.jsx](src/pages/TaskDetails.jsx).
- [ ] Add server-side validation for all create/update operations.

## P1 - Needed for a Reliable Production Release

- [ ] Add loading, error, and empty states for every network-backed screen.
- [ ] Add global API error handling and consistent toast messaging.
- [ ] Introduce pagination or infinite loading for large project and task lists.
- [ ] Add filtering and search support on the backend for projects, tasks, and members.
- [ ] Normalize workspace switching so the active workspace is loaded from the server, not only from local state.
- [ ] Add audit timestamps and update tracking for changes to projects, tasks, and comments.
- [ ] Add request-level rate limiting and input sanitization.
- [ ] Add file upload support if project avatars, attachments, or comment media are required.
- [ ] Add backend tests for auth, CRUD, and permission rules.

## P2 - Important Product Enhancements

- [ ] Add real-time or near-real-time refresh for task and comment updates.
- [ ] Add notification delivery for mentions, assignments, invitations, and status changes.
- [ ] Add activity logging for workspace and project actions.
- [ ] Add soft delete or archival support for projects and tasks.
- [ ] Add background jobs for reminders, overdue task checks, and digest emails.
- [ ] Add API documentation for frontend integration and future clients.
- [ ] Add seed and migration scripts for test and staging environments.

## Core UI Features

### Project Management

- [ ] Enhance project list views and project detail pages.
- [ ] Add and refine project cards with status, progress, and deadlines.
- [ ] Implement project filtering and sorting UI.

### Task Management

- [ ] Build Kanban-style drag-and-drop boards for tasks.
- [ ] Enhance UI for task comments, subtasks, and attachments.
- [ ] Implement task assignment indicators and quick actions.

## UI and UX Improvements

- [ ] Improve responsive design for mobile and tablet breakpoints.
- [ ] Create skeleton loaders and loading states for primary screens.
- [ ] Improve accessibility with keyboard navigation, ARIA roles, and color contrast checks.
- [ ] Improve dashboard layout with analytics cards for task progress and project summary.

## Frontend Technical Enhancements

- [ ] Refactor UI into reusable and modular component patterns.
- [ ] Improve form handling and client-side validation consistency.
- [ ] Add error boundaries and fallback UI components.

## Interactivity and Animations

- [ ] Improve drag-and-drop interactions for tasks and projects.
- [ ] Add smooth animations for modals, page transitions, and task movement.
- [ ] Implement interactive filters and search bars across major list views.
- [ ] Add tooltips, popovers, and hover affordances for better usability.

## Suggested Build Order

1. Set up the API server, authentication, and Prisma/PostgreSQL connectivity.
2. Implement workspace, project, task, member, and comment CRUD.
3. Fix critical calendar correctness bug and add coverage.
4. Replace placeholder UI actions with real API calls.
5. Add validation, authorization, and error handling.
6. Add tests, pagination, accessibility, and production hardening.
7. Add richer UI features, animations, notifications, and real-time sync.

## Files That Currently Need Backend Wiring

- [src/components/CreateProjectDialog.jsx](src/components/CreateProjectDialog.jsx)
- [src/components/InviteMemberDialog.jsx](src/components/InviteMemberDialog.jsx)
- [src/components/AddProjectMember.jsx](src/components/AddProjectMember.jsx)
- [src/components/ProjectSettings.jsx](src/components/ProjectSettings.jsx)
- [src/components/ProjectTasks.jsx](src/components/ProjectTasks.jsx)
- [src/pages/TaskDetails.jsx](src/pages/TaskDetails.jsx)
- [src/features/workspaceSlice.js](src/features/workspaceSlice.js)

## Success Criteria

- [ ] Users can sign in and access only their permitted workspaces.
- [ ] Project, task, member, and comment changes persist to the database.
- [ ] The dashboard and detail pages render live server data instead of dummy objects.
- [ ] Inline task updates, deletions, and discussion comments work end to end.
- [ ] The app behaves correctly across reloads, multiple users, and multiple workspaces.