"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, CheckSquare, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-slate-900">
                  Manage tasks with <span className="text-blue-600">precision</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl dark:text-slate-400">
                  The all-in-one collaborative task management platform for modern teams. 
                  Organize, track, and deliver projects on time.
                </p>
              </div>
              <div className="space-x-4">
                {user ? (
                  <Button asChild size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700">
                    <Link href="/dashboard">
                      Go to Dashboard <LayoutDashboard className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700">
                      <Link href="/register">
                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section Short */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <LayoutDashboard className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Kanban Boards</h3>
                <p className="text-slate-500">
                  Visualize your workflow and drag tasks through different stages of completion.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckSquare className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Real-time Updates</h3>
                <p className="text-slate-500">
                  Stay in sync with your team. Changes are reflected instantly across all devices.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Collaboration</h3>
                <p className="text-slate-500">
                  Invite team members, assign tasks, and communicate through integrated comments.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-white border-t">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© 2026 Antigravity TMS. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-600">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
