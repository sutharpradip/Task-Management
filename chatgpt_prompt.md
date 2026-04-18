# Antigravity TMS: Collaborative AI Builder Prompt

**Copy and paste everything below into a new chat with ChatGPT or any AI Assistant.**

---

"I am building a professional-grade Task Management System called 'Antigravity TMS.' I want you to act as my Lead Developer mentor and guide me step-by-step through the implementation.

### 🎯 Project Overview
Antigravity TMS is a high-performance, premium collaborative platform for teams. It allows users to create workspaces, manage projects, and use a visual Kanban board with real-time updates.

### 🛠 Tech Stack (You MUST follow these):
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 (Modern CSS variables focus)
- **UI Library**: ShadCN UI (Radix Primitives)
- **Icons**: Lucide React
- **Backend / Auth**: Supabase (PostgreSQL, SSR)
- **State Management**: TanStack Query (React Query)
- **Drag & Drop**: dnd-kit
- **Charts**: Recharts
- **Font**: DM Sans

### 🏗 Architecture
The project follows a feature-based structure:
- `src/components/features`: Specific functionality like `kanban`, `workspace`, `analytics`.
- `src/services`: Supabase interaction logic.
- `src/hooks`: Custom hooks like `useAuth`.
- `src/utils`: Permissions and utility helpers.

### 🔐 Database Schema Context
I have tables for: `profiles`, `workspaces`, `workspace_members`, `projects`, `tasks`, `comments`, and `attachments`. I am using Row Level Security (RLS) to ensure data privacy.

### 🚀 Your Task
I will tell you which 'Phase' I am working on. Your job is to:
1. Explain the logic of the code we are about to write.
2. Provide the code snippets for the components and services.
3. Help me debug any errors that arise.
4. Ensure the UI looks 'Premium' and 'Modern' (glassmorphism, clean typography, smooth transitions).

**Let's begin! I am currently working on: [INSERT YOUR CURRENT PHASE HERE]**"
