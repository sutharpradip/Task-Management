# Antigravity TMS - Professional Task Management System

Antigravity is a high-performance, collaborative task management platform built for modern teams. It features a stunning UI, real-time collaboration, and a robust role-based access control system.

## 🚀 Features

- **User Authentication**: Secure login and registration with integrated role selection.
- **RBAC (Role-Based Access Control)**: Strict permissions for Admin, Manager, Member, and Viewer.
- **Workspace Management**: Organize teams into dedicated workspaces.
- **Project Boards**: Visual Kanban boards with drag-and-drop functionality.
- **Task Modals**: Full-featured task editing with descriptions, priority, custom tags, and file attachments.
- **Real-time Collaboration**: Task movements and comments sync instantly across all users.
- **Analytics Dashboard**: Comprehensive charts and metrics using Recharts.
- **Responsive Design**: Premium, mobile-friendly interface built with Tailwind CSS and ShadCN UI.
- **Notifications**: Real-time alerts for task assignments and updates.

## 🛠 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Backend/DB**: [Supabase](https://supabase.com/) (Auth, PostgreSQL, Realtime, Storage)
- **State Management**: [React Query](https://tanstack.com/query) (Server state), Context API (Auth state)
- **Interactions**: [dnd-kit](https://dndkit.com/) (Drag & Drop)
- **Charts**: [Recharts](https://recharts.org/)
- **Typography**: [DM Sans](https://fonts.google.com/specimen/DM+Sans)

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- Supabase account

### 2. Setup Environment
Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup
Run the SQL found in `supabase/schema.sql` in your Supabase SQL Editor. This will create:
- All required tables (profiles, workspaces, tasks, etc.)
- Row Level Security (RLS) policies
- Profile creation triggers

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Locally
```bash
npm run dev
```

## 🏗 Folder Structure

- `src/app`: Next.js App Router and page definitions.
- `src/components/features`: Feature-specific UI (Kanban, Analytics, etc.).
- `src/components/common`: Reusable UI components.
- `src/components/layouts`: Global dashboard and navigation layouts.
- `src/hooks`: Custom hooks like `useAuth`.
- `src/lib`: Configuration for Supabase and other libraries.
- `src/services`: Database interaction logic.
- `src/utils`: Helper functions and permission mappings.

## 🔐 Role-Level Permissions

- **Admin**: Full control over all workspaces, projects, and tasks.
- **Manager**: Workspace settings, project creation, and team management.
- **Member**: Create and manage tasks within projects.
- **Viewer**: Read-only access to workspaces and boards.

## 📄 Documentation

- [Database Schema Details](./docs/DATABASE_SCHEMA.md)

---
Developed by Antigravity AI Coding Agent.
