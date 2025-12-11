# Product Requirements Document (PRD) - TODO App: Due Dates, Priorities, Filters

## 1. Overview

We are upgrading the existing minimal TODO app to make it more practical for everyday task management by adding optional due dates, a simple three-level priority system, and quick filters (All, Today, Overdue). The goal is a small, teachable MVP that provides clear value without backend changes or complex features.

---

## 2. MVP Scope

- Data model:
  - `title`: required string.
  - `dueDate`: optional ISO `YYYY-MM-DD` (invalid values ignored / treated as absent).
  - `priority`: enum `"P1" | "P2" | "P3"` (default `"P3"`).
- Storage: local only (browser localStorage); no backend or external storage changes.
- UI / Features:
  - Add and edit tasks with `title`, optional `dueDate`, and `priority` selector.
  - Filters: **All**, **Today**, **Overdue**.
  - `All` view shows completed and incomplete tasks; `Today` and `Overdue` show only incomplete tasks.
  - Validation: treat invalid or malformed `dueDate` values as absent (do not block save).
- Accessibility / Design: keep UI simple and minimal; no keyboard navigation or advanced accessibility features required for MVP.

---

## 3. Post-MVP Scope

- Visual polish:
  - Visually highlight overdue tasks (e.g., red text or card border) to increase prominence.
  - Color-coded priority badges (e.g., red for `P1`, orange for `P2`, gray for `P3`).
- Sorting:
  - Default sort order: overdue tasks first → by priority (`P1` → `P3`) → due date ascending → tasks without a due date last.
- UX refinements: transitions/animations for adding/completing tasks, clearer empty states, and more visible filter controls.

---

## 4. Out of Scope

- Notifications, reminders, or push alerts.
- Recurring tasks or repeating schedules.
- Multi-user support, authentication, or server-side syncing.
- Backend or database changes; the system will remain localStorage-based for MVP.
- Advanced accessibility (keyboard navigation, screen-reader-specific flows) for initial delivery.

