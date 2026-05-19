# ADR 0003: Property Translation Middleware for Schema Decoupling

## Status
Accepted

## Context
The legacy React codebase represents timelines, dates, and hours using `snake_case` attributes (e.g. `start_date`, `end_date`, `due_date`, `estimated_hours`). Conversely, Prisma models require fields to follow `camelCase` conventions (e.g. `startDate`, `endDate`, `dueDate`, `estimatedHours`). Directly refactoring either layer threatened to introduce regressions throughout front-end handlers or database relationships.

## Decision
We decided to implement translation mapping helpers on the backend Express router layer.

### Key Factors:
1. **Separation of Concerns:** Frontend code doesn't need to know the specific casing requirements of database schemas, allowing forms and inputs to remain untouched.
2. **Type Coercion Handling:** The backend handles casting/parsing (e.g. converting date strings to Date objects or numeric hours to floats) consistently in one place.

## Consequences
* Handlers use translation helpers (`mapProjectToFrontend`, etc.) before returning JSON responses.
* Minor execution overhead to map properties; trivial relative to network database roundtrip latency.
