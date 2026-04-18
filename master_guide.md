# 🏗️ Antigravity TMS: The Master Learning Guide

Welcome, student! This document is your step-by-step roadmap for building a world-class Task Management System (TMS) from scratch. We will build this like a real-world software team would.

---

## 🛠 Phase 1: The Foundation
**What:** Setting up the "Skeleton" of the app.
**Why:** Before you build the rooms of a house, you need the foundation and the frame.
**Where:** Your local terminal and your code editor.

### Steps:
1. **Initialize Next.js**: Run `npx create-next-app@latest .` with the following choices:
   - TypeScript: No (we are using JavaScript for simplicity).
   - ESLint: Yes.
   - Tailwind CSS: Yes.
   - `src/` directory: Yes.
   - App Router: Yes.
2. **Install ShadCN UI**: This gives us "pre-made" professional components like Buttons, Inputs, and Cards.
3. **Configure Tailwind 4**: Update your `globals.css` to use the new CSS-first approach of Tailwind 4.

**Mentor's Tip:** If you want to change the look later, everything is controlled in `globals.css` and `tailwind.config`.

---

## 🔐 Phase 2: Database & Security (The Brain)
**What:** Setting up Supabase and Row Level Security (RLS).
**Why:** Without a database, your app has no memory. Without RLS, anyone can see anyone's data (which is bad!).
**Where:** `supabase/schema.sql` and the Supabase Dashboard.

### Steps:
1. **Create Tables**: Define `profiles`, `workspaces`, `workspace_members`, `projects`, and `tasks`.
2. **The "Secret Sauce" (RLS)**: Add policies so a user can *only* see workspaces they are a member of.
3. **Triggers**: Create a database function that automatically creates a "Profile" in your public table whenever a user signs up.

**How to add something new**: If you want "Priorities" for tasks, you add a `priority` column to the `tasks` table in Supabase.

---

## 🛡 Phase 3: Auth & Protected Layouts
**What:** Login system and the "Dashboard" sidebar.
**Why:** You don't want strangers accessing the dashboard.
**Where:** `src/hooks/use-auth.js` and `src/app/(dashboard)/layout.jsx`.

### Steps:
1. **Auth Context**: Create a "Provider" that wraps your whole app and keeps track of who is logged in.
2. **Middleware**: Write a simple check that redirects users to `/login` if they aren't authenticated.
3. **Sidebar Layout**: Build a high-end sidebar using Lucide icons.

---

## 📦 Phase 4: Workspace Management
**What:** The ability to create "Workspaces" (like Slack or Notion).
**Why:** Users need to organize their work by team or project.
**Where:** `src/app/(dashboard)/workspaces`.

### Steps:
1. **CRUD Logic**: Write functions to Create, Read, Update, and Delete workspaces.
2. **Role-Based Access (RBAC)**: In `src/utils/permissions.js`, define who can do what (e.g., only an "Admin" can delete a workspace).

**Mentor's Tip**: Use `react-query` to fetch data. It handles "loading" and "error" states automatically so you don't have to!

---

## 📋 Phase 5: The Kanban Board (The Hardest Part!)
**What:** Drag-and-drop tasks between columns.
**Why:** This is the "Productivity" heart of the app.
**Where:** `src/components/features/kanban`.

### Steps:
1. **Dnd-kit Setup**: Define the "Sensors" (how the mouse/touch detects dragging).
2. **Sortable Context**: Wrap your columns so they know which task is being moved.
3. **Optimistic Updates**: When a user moves a task, move it on the UI *immediately* before the database even confirms it. This makes the app feel "Antigravity" (fast!).

---

## 📊 Phase 6: Analytics & Polishing
**What:** Charts showing team progress.
**Why:** Managers love seeing pie charts and bar graphs of their team's performance.
**Where:** `src/app/(dashboard)/dashboard/page.jsx`.

### Steps:
1. **Aggregate Data**: Write a query that counts tasks by status (Todo, In Progress, Done).
2. **Recharts**: Pass that data into `<BarChart>` and `<PieChart>`.

---

## 💡 How to add "New" things to this project
1. **Want a "Dark Mode"?** Go to `globals.css` and define your colors using CSS variables.
2. **Want "Comments"?** Create a `comments` table in Supabase and a list component in the Task Modal.
3. **Want "Notifications"?** Use Supabase "Realtime" to listen for changes in the `tasks` table.

---

### Final Encouragement
Don't worry about making mistakes. Every error message is just a "lesson" in disguise. Reference the code in this repository if you get stuck—it's your answer key!
