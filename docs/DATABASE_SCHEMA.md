# Database Schema Explanation

This document describes the database architecture for the Task Management System (TMS). We use Supabase (PostgreSQL) as our primary database.

## Tables Overview

### 1. `profiles`
- **Purpose**: Stores extended user data not managed by Supabase Auth (e.g., full name, role).
- **Relationships**: One-to-one with `auth.users`.
- **Roles**: `admin`, `manager`, `member`, `viewer`.

### 2. `workspaces`
- **Purpose**: The top-level container for projects and tasks.
- **Relationships**: Owned by a `profile`. Used as a scoping mechanism for almost all other data.

### 3. `workspace_members`
- **Purpose**: Manages access to workspaces.
- **Relationships**: Junction table between `profiles` and `workspaces`.
- **Note**: This is where Role-Based Access Control (RBAC) is enforced at the workspace level.

### 4. `projects`
- **Purpose**: Groups tasks within a workspace.
- **Relationships**: Belongs to a `workspace`.

### 5. `project_members`
- **Purpose**: Optional fine-grained access to specific projects.

### 6. `tasks` (Core)
- **Purpose**: The main entity in our system.
- **Key Fields**:
  - `status`: `todo`, `in_progress`, `in_review`, `done`.
  - `priority`: `low`, `medium`, `high`, `urgent`.
  - `position`: Floating-point value used for drag-and-drop ordering in Kanban boards.
- **Relationships**: Belongs to a `project` and `workspace`. Assigned to a `profile`.

### 7. `subtasks`
- **Purpose**: Checklist items within a task.
- **Relationships**: Child of a `task`.

### 8. `comments` & `attachments`
- **Purpose**: Collaboration and file storage associated with tasks.
- **Relationships**: Linked to `tasks` and `profiles`.

### 9. `tags` & `task_tags`
- **Purpose**: Flexible categorization of tasks.
- **Relationships**: Many-to-many relationship between `tasks` and `tags`.

### 10. `activity_logs`
- **Purpose**: Audit trail for all major actions (status changes, task creation, etc.).

---

## Security (RLS)

We use **Row Level Security (RLS)** to ensure that:
- Users can only see data belonging to workspaces they are members of.
- Permissions are strictly enforced based on the `role` in `workspace_members`.
- Database-level constraints prevent data leaks or unauthorized modifications.

## Real-time Strategy

All major tables (`tasks`, `comments`, `workspaces`) will have **Supabase Realtime** enabled. This allows the frontend to listen for changes (INSERT, UPDATE, DELETE) and update the UI (like the Kanban board) instantly for all users.
