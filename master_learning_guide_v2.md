# 🎓 Antigravity TMS: Detailed Developer Walkthrough (V2)

This guide is your mentor. It tells you exactly **where** we put files and **what** logic we wrote inside them.

---

## 🛠 Step 1: Initialization & Styling
**Goal**: Get the project running and looking premium.

1.  **Project Creation**: We used `npx create-next-app@latest .` inside the `Task-Management` folder. 
2.  **Tailwind 4 Setup**: 
    - **Where**: `src/app/globals.css`.
    - **What**: Instead of the old `@tailwind` directives, we imported the modern Tailwind 4 CSS layer. We also defined custom HSL color variables for the "Premium Sidebar" look.
3.  **ShadCN UI**:
    - **How**: We ran `npx shadcn@latest init`.
    - **Result**: This created the `components/ui` folder. We added components like `button.jsx`, `input.jsx`, and `card.jsx` which we use everywhere.

---

## 🔐 Step 2: The Authentication Flow
**Goal**: Allow users to log in securely using Supabase.

1.  **Folder Grouping**: We created `src/app/(auth)`. The `()` means this extra folder doesn't show up in the URL, but it keeps our auth pages together.
2.  **Login Page**: 
    - **File**: `src/app/(auth)/login/page.jsx`.
    - **Logic**: We created a `formData` state using `useState`.
    - **API Call**: Inside `handleLogin`, we called `supabase.auth.signInWithPassword({ email, password })`.
3.  **Supabase Client**:
    - **File**: `src/lib/supabase.js`.
    - **What**: We initialized the Supabase client here using `createClient` so we don't have to rewrite the connection code in every file.

---

## 🧠 Step 3: Global Auth State (The Context)
**Goal**: Make sure the app "remembers" who is logged in across all pages.

1.  **The Hook**:
    - **File**: `src/hooks/use-auth.js`.
    - **Logic**: We used React's `Context API`. We created a `useEffect` that listens to `supabase.auth.onAuthStateChange`.
    - **Result**: Now, any component can just call `const { user } = useAuth()` to get the current user.
2.  **The Provider**:
    - **File**: `src/components/providers.js`.
    - **What**: We wrapped the entire app (in `layout.js`) with this provider so the session is global.

---

## 🏗 Step 4: Database Schema & RBAC
**Goal**: Define how data is stored and who can access it.

1.  **SQL Script**:
    - **File**: `supabase/schema.sql`.
    - **Tables**: We created `profiles` (for user info), `workspaces` (the groups), and `tasks` (the work).
2.  **Permissions Utility**:
    - **File**: `src/utils/permissions.js`.
    - **Logic**: We mapped roles (Admin, Manager, Member, Viewer) to specific permissions like `task:create` or `workspace:delete`.
    - **How to use**: We created a `<RoleGate>` component that hides buttons if a user doesn't have the right role.

---

## 📦 Step 5: Dashboard & Sidebar Layout
**Goal**: Create a professional-looking workspace.

1.  **Dashboard Group**: Created `src/app/(dashboard)`.
2.  **Sidebar Component**:
    - **File**: `src/components/layouts/sidebar.jsx`.
    - **UI**: Used `Lucide React` for icons and `clsx` for smooth hover states.
3.  **The Main Layout**:
    - **File**: `src/app/(dashboard)/layout.jsx`.
    - **Logic**: This file wraps all dashboard pages. It places the Sidebar on the left and the `{children}` (the page content) on the right.

---

## 📋 Step 6: Workspace & Project Logic
**Goal**: Organizing teams and their work.

1.  **Fetching Data**: 
    - **Where**: `src/app/(dashboard)/workspaces/[workspaceId]/page.jsx`.
    - **Logic**: We used `useQuery` from **TanStack Query**. 
    - **How**: It calls our Supabase function, handles the loading spinner automatically, and caches the data so it loads instantly next time.

---

## 🚀 Step 7: The Kanban Board (Drag & Drop)
**Goal**: The visual heart of the app.

1.  **The Components**: 
    - **Where**: `src/components/features/kanban/`.
    - **Files**: `kanban-board.jsx`, `kanban-column.jsx`, and `task-card.jsx`.
2.  **Dnd-kit Logic**: 
    - **Logic**: In `kanban-board.jsx`, we use `DndContext`. When a card is dropped (`onDragEnd`), we calculate its new status and update Supabase immediately.

---

## 📊 Step 8: Analytics Dashboard
**Goal**: Show statistics to the user.

1.  **Charts**:
    - **Where**: `src/app/(dashboard)/dashboard/page.jsx`.
    - **What**: We used **Recharts**. 
    - **Logic**: We fetch all tasks, group them by status (e.g., how many are 'Done'), and pass that array to the `<BarChart />` component.

---

### 💡 Mentorship Note: Troubleshooting
If you see a blank page, always check your **Browser Console (F12)**. 
- **Error 42501**: This means your Supabase RLS policies are blocking you. You need to go to Supabase and "Allow Select" for that table.
- **Hydration Error**: This usually means you tried to use a "Client Component" but forgot to put `"use client";` at the very top of the file.
