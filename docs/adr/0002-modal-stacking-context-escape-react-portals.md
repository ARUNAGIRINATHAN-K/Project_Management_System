# ADR 0002: Escaping CSS Stacking Contexts with React Portals

## Status
Accepted

## Context
Interactive modals (Create Project, Create Task, Add Project Member) were getting cut off, trapped, or rendering behind the top navigation bar. Investigation showed that page slide-in animations (e.g. `animate-page-enter` applying CSS `transform` declarations) on parent wrapper elements created a new stacking context. This forced any `position: fixed` or `position: absolute` children to calculate their z-index relative to that wrapper rather than the HTML body, leading to backdrop overlap bugs.

## Decision
We decided to wrap all global modal, drawer, and dialog dialog structures inside React Portals using `createPortal(<JSX>, document.body)`.

### Key Factors:
1. **Visual Independence:** Rendering modals directly as children of the `body` element completely bypasses any CSS transforms or overflow properties set on main layout containers.
2. **Tab Access & Semantics:** Keeps screen reader access and focus states floating top-level.

## Consequences
* Modals now overlay seamlessly on top of sidebars, headers, and dashboard widgets regardless of parent transitions.
* Developers must make sure that events bubbling from portals don't trigger unintended handlers on ancestor components.
