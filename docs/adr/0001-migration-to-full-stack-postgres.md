# ADR 0001: Migration from LocalStorage to Neon Serverless PostgreSQL

## Status
Accepted

## Context
Originally, the Project Management System was a front-end only Single Page Application (SPA). All workspace, project, task, and team membership data was stored in browser-local state (Redux) and hydrated using `localStorage`. This limited the application's utility for multi-tenant collaboration, sharing, and data persistence across browsers and devices.

## Decision
We decided to migrate the data storage architecture to a relational schema hosted on Neon Serverless PostgreSQL, managed by the Prisma ORM.

### Key Factors:
1. **Relational Data Integrity:** Project management relies heavily on relational tables (Workspaces $\rightarrow$ Projects $\rightarrow$ Tasks $\rightarrow$ Users $\rightarrow$ Memberships) where keys must cascade and be consistent.
2. **Serverless Hosting Compatibility:** Neon SQL provides quick connection scaling, connection pooling, and autoscaling, which fits well with lightweight Node.js/Express APIs.
3. **ORM Selection:** Prisma was selected due to its auto-generated types, visual schema modeling, and robust migrations workflow.

## Consequences
* All client state hydration now happens asynchronously through Redux Thunks (`fetchWorkspaces`, `addProjectAsync`, etc.) calling the Express API.
* Added latency for API roundtrips; resolved by keeping optimistic updates in the Redux store state.
* Database connections must be pooled in serverless or server environments to prevent exhaustion.
