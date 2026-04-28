# User Flow Guide

This document maps the current screen-by-screen user journey in the project management app. The flow is based on the implemented React routes, the shared layout, and the current query-string navigation patterns.

## User Journey Diagram

```mermaid
flowchart TD
    A[App Start] --> B[/ / Dashboard]
    B --> C[Sidebar Workspace Switcher]
    B --> D[Projects]
    B --> E[Team]
    B --> F[My Tasks]
    B --> G[Project Overview Card]
    D --> H[Project Detail: /projectsDetail?id=...&tab=tasks]
    F --> I[Task Detail: /taskDetails?projectId=...&taskId=...]
    G --> H
    H --> J[Tasks Tab]
    H --> K[Calendar Tab]
    H --> L[Analytics Tab]
    H --> M[Settings Tab]
    J --> I
    J --> N[Create Task Dialog]
    D --> O[Create Project Dialog]
    E --> P[Invite Member Dialog]
    M --> Q[Add Project Member Dialog]
```

## Route Tree

```text
/ (Layout)
├── / (Dashboard)
├── /team
├── /projects
├── /projectsDetail?id={projectId}&tab={tasks|calendar|analytics|settings}
└── /taskDetails?projectId={projectId}&taskId={taskId}
```

## Screen-by-Screen Flow

### 1. App Shell and Initial Load

- The application mounts through `main.jsx` and wraps the app in `BrowserRouter` and Redux `Provider`.
- `Layout.jsx` loads the active theme and displays a full-screen loading state while workspace data is initializing.
- After loading, the persistent shell appears with the sidebar, navbar, and routed content area.

### 2. Dashboard

**Route:** `/`

**What the user sees:**

- Greeting header with a workspace-aware welcome message.
- `New Project` action button.
- KPI cards from the stats grid.
- Project overview list.
- Recent activity list.
- Task summary cards.

**Primary actions:**

- Click `New Project` to open the create project dialog.
- Click a project in the overview to open project details.
- Use the sidebar to navigate to Projects or Team.

### 3. Workspace Switcher

**Location:** Sidebar top section

**Behavior:**

- The user opens the workspace dropdown.
- Selecting a workspace updates Redux state and returns the user to `/`.
- All downstream dashboard, project, team, and task content is refreshed from the selected workspace.

**Click here -> lands here:**

- Click workspace dropdown -> workspace selection list
- Click a workspace -> `/`

### 4. Projects List

**Route:** `/projects`

**What the user sees:**

- Page header for project management.
- Search box.
- Status filter.
- Priority filter.
- Grid of project cards.

**Primary actions:**

- Search projects by name or description.
- Filter projects by status or priority.
- Click `New Project` to open the create project dialog.
- Click a project card to open its detail page.

**Click here -> lands here:**

- Click project card -> `/projectsDetail?id={projectId}&tab=tasks`
- Click `New Project` -> create project modal

### 5. Project Details

**Route:** `/projectsDetail?id={projectId}&tab={tasks|calendar|analytics|settings}`

**What the user sees:**

- Project header with back navigation.
- Project status badge.
- `New Task` button.
- Summary cards for total tasks, completed tasks, in-progress tasks, and team members.
- Tab switcher.

**Tab flows:**

- **Tasks tab** -> task table/card view with filters, bulk selection, inline status updates, delete, and task detail navigation.
- **Calendar tab** -> month calendar, selected-day tasks, upcoming tasks, overdue tasks.
- **Analytics tab** -> completion rate, charts, priority breakdown, team size.
- **Settings tab** -> editable project information and team member management.

**Click here -> lands here:**

- Click `Tasks` tab -> same route with `tab=tasks`
- Click `Calendar` tab -> same route with `tab=calendar`
- Click `Analytics` tab -> same route with `tab=analytics`
- Click `Settings` tab -> same route with `tab=settings`
- Click task row in Tasks tab -> `/taskDetails?projectId={projectId}&taskId={taskId}`
- Click `New Task` -> create task dialog
- Click member add button in Settings -> add project member dialog

### 6. Project Tasks Tab

**Surface:** Project detail view, Tasks tab

**What the user sees:**

- Filters for status, type, priority, and assignee.
- Task table on desktop.
- Task cards on mobile.
- Checkbox selection for bulk actions.
- Inline status dropdown for each task.

**Primary actions:**

- Filter tasks.
- Change a task’s status inline.
- Select multiple tasks.
- Delete selected tasks.
- Open a task detail page.

### 7. Task Details

**Route:** `/taskDetails?projectId={projectId}&taskId={taskId}`

**What the user sees:**

- Task title and metadata.
- Status, type, priority, assignee, and due date.
- Project details panel.
- Task discussion panel with comments.
- Comment composer.

**Primary actions:**

- Read or post discussion comments.
- Review the linked project context.

**Click here -> lands here:**

- Click task from project table -> task detail screen
- Click task from `My Tasks` sidebar -> task detail screen

### 8. Calendar View

**Surface:** Project detail view, Calendar tab

**What the user sees:**

- Month grid with task counts by day.
- Selected date task list.
- Upcoming tasks sidebar.
- Overdue tasks sidebar.

**Primary actions:**

- Navigate between months.
- Select a day to inspect its tasks.

### 9. Analytics View

**Surface:** Project detail view, Analytics tab

**What the user sees:**

- Completion rate metric.
- Active tasks metric.
- Overdue tasks metric.
- Team size metric.
- Status bar chart.
- Type pie chart.
- Priority breakdown bars.

**Primary actions:**

- Review project health and distribution of work.

### 10. Settings View

**Surface:** Project detail view, Settings tab

**What the user sees:**

- Editable project details form.
- Timeline fields.
- Progress slider.
- Team members list.
- Add member action.

**Primary actions:**

- Edit project fields.
- Open the add member dialog.

### 11. Team Page

**Route:** `/team`

**What the user sees:**

- Team summary cards.
- Search field.
- Member table on desktop.
- Member cards on mobile.
- Invite Member action.

**Primary actions:**

- Search team members.
- Open the invite member dialog.

**Click here -> lands here:**

- Click `Invite Member` -> invite member modal

### 12. Sidebar Shortcuts

**My Tasks**

- Expands to show the current user’s assigned tasks.
- Click a task -> `/taskDetails?projectId={projectId}&taskId={taskId}`

**Projects**

- Expands to show project-specific shortcuts.
- Click a project sub-item -> `/projectsDetail?id={projectId}&tab={tab}`

## Dialog and Modal Flows

- `New Project` opens the create project modal from the dashboard or projects page.
- `Invite Member` opens the invite member modal from the team page.
- `Add Member` opens the add project member modal from project settings.
- `New Task` opens the create task modal from project details.

## Current Implementation Notes

- The flow is fully navigable on the front end.
- Several creation/edit dialogs currently contain placeholder submit handlers.
- The application uses seeded workspace data, so the journey reflects the current prototype state rather than a live backend.