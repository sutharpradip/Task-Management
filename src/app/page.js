"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Kanban,
  BarChart,
  Users,
  Lock,
  Zap,
  CheckCircle2,
  Layers,
  Clock,
  FolderKanban,
  Shield,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 w-full z-50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl px-6 py-3 shadow-sm">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-shadow">
              <Layers className="text-white h-5 w-5" />
            </div>
            <span className="font-black text-xl tracking-tight">TaskFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">How it Works</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild className="bg-slate-900 hover:bg-slate-800 rounded-xl px-5 h-10 font-semibold text-sm">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 px-3 transition-colors hidden sm:block">Sign In</Link>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-xl px-5 h-10 font-semibold text-sm shadow-lg shadow-blue-600/20">
                  <Link href="/register">Get Started Free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* ───── Hero ───── */}
        <section className="relative pt-36 pb-24 overflow-hidden">
          {/* Subtle gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white -z-10" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/8 blur-[120px] rounded-full -z-10" />

          <div className="max-w-5xl mx-auto px-6 text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-10">
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 tracking-wide">The smarter way to manage tasks</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Organize your work,{" "}
              <br className="hidden sm:block" />
              <span className="text-blue-600">deliver on time.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed mb-10">
              TaskFlow is a collaborative task management platform with Kanban boards, real-time analytics, role-based access, and workspace isolation — everything your team needs to ship projects with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
              <Button asChild size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg shadow-blue-600/20 group text-base">
                <Link href={user ? "/dashboard" : "/register"}>
                  {user ? "Open Dashboard" : "Start for Free"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-xl font-semibold text-base border-slate-200 hover:bg-slate-50">
                <Link href="#features">See Features</Link>
              </Button>
            </div>

            {/* ── Dashboard Preview ── */}
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute -inset-3 bg-gradient-to-b from-blue-100/40 to-transparent rounded-3xl blur-2xl -z-10" />
              <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden bg-white">
                <img
                  src="/dashboard-preview.png"
                  alt="TaskFlow — Kanban board with drag-and-drop task cards, status columns, and team avatars"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ───── Trusted-by strip ───── */}
        <section className="py-12 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Built with modern tools you already love</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-slate-400">
              <span className="text-sm font-bold">Next.js</span>
              <span className="text-slate-200">•</span>
              <span className="text-sm font-bold">Supabase</span>
              <span className="text-slate-200">•</span>
              <span className="text-sm font-bold">Tailwind CSS</span>
              <span className="text-slate-200">•</span>
              <span className="text-sm font-bold">shadcn/ui</span>
              <span className="text-slate-200">•</span>
              <span className="text-sm font-bold">Recharts</span>
            </div>
          </div>
        </section>

        {/* ───── Features Grid ───── */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Core Features</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                Everything your team needs
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                From drag-and-drop Kanban boards to deep analytics — TaskFlow covers the full project lifecycle.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Kanban}
                title="Kanban Boards"
                description="Drag-and-drop task cards across custom status columns. Visualize your entire workflow at a glance."
              />
              <FeatureCard
                icon={Users}
                title="Team Collaboration"
                description="Invite teammates, assign tasks, track ownership. Everyone stays aligned in shared workspaces."
              />
              <FeatureCard
                icon={BarChart}
                title="Real-time Analytics"
                description="Interactive charts showing task distribution, completion rates, and priority breakdown."
              />
              <FeatureCard
                icon={Shield}
                title="Role-Based Access"
                description="Admin, Manager, Member, Viewer — granular permissions keep sensitive projects secure."
              />
              <FeatureCard
                icon={FolderKanban}
                title="Workspace Isolation"
                description="Separate clients, departments, or projects into dedicated workspaces with their own members."
              />
              <FeatureCard
                icon={Clock}
                title="Priority & Deadlines"
                description="Tag tasks with urgency levels, set due dates, and never let important items slip through."
              />
            </div>
          </div>
        </section>

        {/* ───── How it Works ───── */}
        <section id="how-it-works" className="py-24 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">How it Works</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Up and running in minutes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                step="01"
                title="Create a Workspace"
                description="Sign up and create your first workspace. Name it after your team, project, or client."
              />
              <StepCard
                step="02"
                title="Add Tasks & Boards"
                description="Create projects with Kanban boards. Add tasks with priorities, descriptions, and tags."
              />
              <StepCard
                step="03"
                title="Invite & Ship"
                description="Invite your team, assign tasks, drag cards across columns, and track progress in real-time."
              />
            </div>
          </div>
        </section>

        {/* ───── CTA ───── */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="relative p-12 sm:p-16 bg-slate-900 rounded-3xl text-white overflow-hidden">
              {/* Decorative blurs */}
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-600/15 blur-[80px] rounded-full" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-600/10 blur-[80px] rounded-full" />

              <div className="relative z-10">
                <Star className="h-10 w-10 text-blue-400 mx-auto mb-6" />
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                  Ready to streamline your workflow?
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                  Create your free workspace and start managing tasks with your team today.
                </p>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-xl h-12 px-8 font-semibold shadow-lg shadow-blue-600/25">
                  <Link href="/register">Get Started — It&apos;s Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ───── Footer ───── */}
      <footer className="w-full py-10 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Layers className="text-white h-4 w-4" />
            </div>
            <span className="font-bold text-sm tracking-tight">TaskFlow</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Terms</Link>
            <Link href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Reusable Components ── */

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 group">
      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
        <Icon className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }) {
  return (
    <div className="text-center p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-5 text-white font-extrabold text-sm">
        {step}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
