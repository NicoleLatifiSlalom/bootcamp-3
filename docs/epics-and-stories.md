  - Story: Add `title` field to task model
  - Story: Add optional `dueDate` (ISO YYYY-MM-DD) to task model
  - Story: Add `priority` enum (`P1`, `P2`, `P3`) with default `P3`
 Epic: Task Data Model
  - Story: Add `title` field to task model
    - Acceptance Criteria:
      - `title` is required when creating or editing a task.
      - Saving a task without a non-empty `title` is blocked and shows a validation message.
  - Story: Add optional `dueDate` (ISO YYYY-MM-DD) to task model
    - Acceptance Criteria:
      - `dueDate` is accepted in ISO `YYYY-MM-DD` format.
      - Malformed or invalid `dueDate` values are ignored/treated as absent and do not block saving.
      - Stored `dueDate` preserves the `YYYY-MM-DD` format.
  - Story: Add `priority` enum (`P1`, `P2`, `P3`) with default `P3`
    - Acceptance Criteria:
      - `priority` defaults to `P3` for new tasks.
      - Only `P1`, `P2`, or `P3` values are stored; other values are rejected or normalized to `P3`.

  - Story: Add create task form with `title`, `dueDate`, and `priority`
  - Story: Add edit task flow to update `title`, `dueDate`, and `priority`
  - Story: Validate and treat invalid `dueDate` values as absent
 Epic: Task Create/Edit UI
  - Story: Add create task form with `title`, `dueDate`, and `priority`
    - Acceptance Criteria:
      - Form exposes `title`, optional `dueDate`, and `priority` fields.
      - Submitting a valid form adds the task to the task list and persists it.
  - Story: Add edit task flow to update `title`, `dueDate`, and `priority`
    - Acceptance Criteria:
      - Editing a task pre-fills the form with current values.
      - Saving changes updates the task in the list and in localStorage.
  - Story: Validate and treat invalid `dueDate` values as absent
    - Acceptance Criteria:
      - If user enters an invalid `dueDate`, the task saves with no `dueDate` instead of failing.
      - The UI indicates when a provided `dueDate` was ignored (non-blocking message or silent normalization).

  - Story: Implement `All` filter that shows completed and incomplete tasks
  - Story: Implement `Today` filter that shows incomplete tasks due today
  - Story: Implement `Overdue` filter that shows incomplete overdue tasks
 Epic: Filters and Views (MVP)
  - Story: Implement `All` filter that shows completed and incomplete tasks
    - Acceptance Criteria:
      - `All` displays every task regardless of completion state.
      - Toggling `All` updates the visible list immediately.
  - Story: Implement `Today` filter that shows incomplete tasks due today
    - Acceptance Criteria:
      - `Today` shows only tasks with a `dueDate` equal to the local current date and that are incomplete.
      - Tasks without a `dueDate` do not appear in `Today`.
  - Story: Implement `Overdue` filter that shows incomplete overdue tasks
    - Acceptance Criteria:
      - `Overdue` shows only tasks with a `dueDate` before the local current date and that are incomplete.
      - Completed tasks are excluded from `Overdue`.

  - Story: Persist tasks (including `dueDate` and `priority`) to localStorage
  - Story: Load tasks from localStorage on app startup
 Epic: Local Storage Persistence
  - Story: Persist tasks (including `dueDate` and `priority`) to localStorage
    - Acceptance Criteria:
      - Creating or updating tasks writes the full task object (including `dueDate` when present and `priority`) to `localStorage`.
      - Data format in `localStorage` is JSON and can be parsed on load.
  - Story: Load tasks from localStorage on app startup
    - Acceptance Criteria:
      - On app startup, tasks are loaded from `localStorage` and rendered in the task list.
      - If `localStorage` contains malformed data, the app handles it gracefully (ignores invalid entries) and does not crash.

  - Story: Keep UI minimal and teachable
  - Story: Ensure filters are discoverable in the main UI
 Epic: Minimal UI/Design Constraints
  - Story: Keep UI minimal and teachable
    - Acceptance Criteria:
      - The UI remains uncluttered: form and list fit without complex navigation.
      - Core actions (add, edit, complete, delete) are visible and intuitive.
  - Story: Ensure filters are discoverable in the main UI
    - Acceptance Criteria:
      - Filter controls (`All`, `Today`, `Overdue`) are visible on initial load and labeled clearly.
      - Changing filters updates the list without requiring a page reload.

  - Story: Highlight overdue tasks visually (e.g., red styling)
  - Story: Add color-coded priority badges for `P1`, `P2`, and `P3`
 Epic: Visual Polishing (Post‑MVP)
  - Story: Highlight overdue tasks visually (e.g., red styling)
    - Acceptance Criteria:
      - Tasks considered overdue (incomplete with `dueDate` before today) render with a distinct visual treatment (color, border, or badge).
      - Styling meets contrast/readability goals.
  - Story: Add color-coded priority badges for `P1`, `P2`, and `P3`
    - Acceptance Criteria:
      - Each priority displays a badge with consistent color mapping (`P1`=red, `P2`=orange, `P3`=gray).
      - Badges appear in task list items and in task edit/create forms.

  - Story: Implement default sort: overdue first
  - Story: Implement secondary sort by priority (P1 → P3)
  - Story: Implement tertiary sort by due date ascending
  - Story: Ensure tasks without due dates appear last
 Epic: Sorting and Ordering (Post‑MVP)
  - Story: Implement default sort: overdue first
    - Acceptance Criteria:
      - Default ordering places overdue tasks at the top of the list.
  - Story: Implement secondary sort by priority (P1 → P3)
    - Acceptance Criteria:
      - Within the same overdue/dated grouping, tasks sort by priority `P1` then `P2` then `P3`.
  - Story: Implement tertiary sort by due date ascending
    - Acceptance Criteria:
      - For tasks with the same priority, earlier `dueDate` appears before later ones.
  - Story: Ensure tasks without due dates appear last
    - Acceptance Criteria:
      - Tasks that have no `dueDate` are ordered after tasks with a `dueDate`.

  - Story: Add transitions for adding and completing tasks
  - Story: Improve empty states and filter affordances
 Epic: UX Refinements (Post‑MVP)
  - Story: Add transitions for adding and completing tasks
    - Acceptance Criteria:
      - Adding or completing a task triggers a short, non-blocking transition/animation.
      - Animations do not block user input or cause layout shift that prevents interaction.
  - Story: Improve empty states and filter affordances
    - Acceptance Criteria:
      - When a filter yields no tasks, a clear empty state message is shown with guidance (e.g., "No tasks found — add a new task").
      - Filter controls include an affordance indicating which filter is active.

Note: Content is based on `docs/prd-todo.md` and follows the structure in `docs/templates/epic-and-stories-template.md`.

## Technical Requirements (implementation notes)

- General:
  - Implement all MVP persistence in the frontend using `localStorage` under a single key (e.g., `tasks`). Current frontend calls `/api/tasks` endpoints; for MVP replace or add a local adapter that exposes `list/save/update/delete` operations and is used by `App.js`, `TaskList.js`, and `TaskForm.js`.
  - Data shape: use task objects with fields `{ id, title, description?, due_date?, priority, completed? }`. Keep `due_date` (YYYY-MM-DD) naming used in current components.
  - Add a small storage utility module: `packages/frontend/src/storage.js` with `loadTasks()`, `saveTasks(tasks)`, `createTask(task)`, `updateTask(id, task)`, `deleteTask(id)`.

- Task Data Model / Validation:
  - Enforce `title` required in `packages/frontend/src/TaskForm.js` (already present) and surface validation messages (`Title is required`).
  - Normalize `due_date` to ISO `YYYY-MM-DD` in `TaskForm` (existing `normalizeDateString` can be reused) and ensure malformed values are dropped before persisting.
  - Add `priority` field to the create/edit flows: implement a `Select` input in `TaskForm.js` defaulting to `P3` and include `priority` in saved task objects.

- UI / Components:
  - `TaskForm.js`: add `priority` select, include `priority` in `onSave` payload, keep existing `due_date` normalization and title validation.
  - `TaskList.js`: read tasks from the storage adapter instead of `/api/tasks` for MVP; display `priority` badges (color-coded) next to `due_date` chips; reuse `formatDueDate` for display.
  - `App.js`: replace `fetch('/api/tasks')`-style flows with calls into the storage adapter (or provide a thin adapter that delegates to localStorage). Ensure `handleSave` writes `priority` and `due_date` and triggers list refresh.
  - Filters UI: Add visible filter controls (`All`, `Today`, `Overdue`) in a shared header area near `TaskList` (e.g., add controls to `App.js` or above `TaskList`), and implement filtering logic in the storage adapter or in `TaskList`.

- Persistence Behavior:
  - `loadTasks()` should return an array of tasks; if stored data is malformed, ignore invalid entries and continue with an empty list.
  - Mutations (`createTask`, `updateTask`, `deleteTask`) must write the canonical JSON array back to `localStorage` and return the new state.
  - Use numeric or UUID `id` values for tasks; when creating a new task, generate a unique id in the adapter.

- Task Actions / API parity:
  - Implement toggling `completed` in `TaskList` using `updateTask(id, { completed })` in the adapter.
  - Implement delete via `deleteTask(id)` in the adapter and refresh the list after operations.

- Filters, Sorting & Post-MVP notes:
  - MVP: implement `All`, `Today`, and `Overdue` filters on the client; `Today` and `Overdue` should only include incomplete tasks.
  - Post-MVP: implement default sort order (overdue → priority `P1`→`P3` → due date asc → undated last) in the list rendering logic (e.g., `TaskList` or adapter-level `listTasks({ sort: true })`).

- Styling / UX:
  - Add small color-coded priority badges in `TaskList.js` next to title or date (map `P1`=red, `P2`=orange, `P3`=gray).
  - Overdue visual state (Post-MVP): apply distinct styling when `due_date` < today and `completed` is false.

- Tests & Backwards compatibility:
  - Update frontend tests (`packages/frontend/src/__tests__/*`) to mock `localStorage` and verify create/edit/delete, filters, and due_date normalization.
  - If backend endpoints remain in the repo, add a compatibility adapter that can switch between `localStorage` and `/api` via a single config flag to ease later integration.

These technical requirements reference existing files: `packages/frontend/src/TaskForm.js`, `packages/frontend/src/TaskList.js`, and `packages/frontend/src/App.js`. Implement storage adapter and add minimal UI changes to match acceptance criteria from the epics file.

Note: Content is based on `docs/prd-todo.md` and follows the structure in `docs/templates/epic-and-stories-template.md`.