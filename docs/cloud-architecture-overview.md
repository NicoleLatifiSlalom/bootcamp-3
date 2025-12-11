# Cloud Architecture Overview

This document provides a simple system-context diagram for the monorepo TODO app: a React frontend, an Express API, and an in-memory store (ephemeral). It is intended for documentation and onboarding; the diagram is illustrative rather than a full deployment design.

```mermaid
flowchart TB
  subgraph User
    U[User (Browser)]
  end

  subgraph Frontend[React Frontend\n(packages/frontend)]
    F[React SPA]
  end

  subgraph Backend[Express API\n(packages/backend)]
    B[Express API]
    DB[(In-memory Store)]
  end

  subgraph BrowserStorage[Optional Client Storage]
    LS[Browser localStorage]
  end

  U -->|Interacts via UI (clicks, form)| F
  F -->|HTTP/Fetch (REST)| B
  B -->|Read / Write| DB
  F -->|Reads / Writes (MVP)| LS

  classDef infra fill:#f3f4f6,stroke:#9ca3af;
  class Frontend,Backend infra

  click F "" "packages/frontend: React SPA (client)"
  click B "" "packages/backend: Express API (server)"

  %% Notes
  DB ---|ephemeral| note[In-memory store is ephemeral — suitable for demo/local development]
```

Notes:
- MVP storage is local (browser localStorage) or an in-memory store for the Express API during demos.
- For production, replace the in-memory store with a persistent datastore and add deployment infrastructure (load balancer, app hosting, managed DB, etc.).

## Sequence: User creates a TODO

The diagram below shows the typical flow when a user creates a new task. It covers the MVP localStorage path and an alternate server-backed path.

```mermaid
sequenceDiagram
  participant U as User (Browser)
  participant F as React SPA (packages/frontend)
  participant S as Storage Adapter
  participant LS as Browser localStorage
  participant B as Express API (packages/backend)
  participant DB as In-memory Store

  U->>F: Open Add Task form and submit (title, due_date, priority)
  F->>F: Validate `title`; normalize `due_date` to YYYY-MM-DD

  alt MVP (localStorage)
    F->>S: createTask(task)
    S->>LS: write JSON array (tasks)
    LS-->>S: success
    S-->>F: return created task with `id`
    F-->>U: render new task in list
  else Server-backed
    F->>B: POST /api/tasks (task JSON)
    B->>DB: persist task in memory
    DB-->>B: return task id
    B-->>F: 201 Created + task
    F-->>U: render new task in list
  end

```

Notes:
- The `Storage Adapter` is an implementation suggestion: a small module that exposes `createTask`, `updateTask`, `deleteTask`, and `listTasks` and can delegate either to `localStorage` (MVP) or HTTP calls to the Express API.
- The `In-memory Store` is ephemeral and intended for local demos; swap for a persistent DB for production.
