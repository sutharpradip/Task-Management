"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  FolderKanban,
  Users as UsersIcon,
  ChevronRight,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import NotificationDropdown from "./notification-dropdown";

export default function DashboardLayout({ children }) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Workspaces', href: '/workspaces', icon: FolderKanban },
    { name: 'Team', href: '/team', icon: UsersIcon },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100/50">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold">A</span>
            </div>
            {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-slate-900">Antigravity</span>}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto pt-8 pb-4 px-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                pathname === item.href 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${pathname === item.href ? 'text-white' : ''}`} />
              {isSidebarOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100/50">
          <div className={`p-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-200">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xs uppercase">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{profile?.full_name || 'User'}</p>
                <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-wider">{profile?.role}</p>
              </div>
            )}
            {isSidebarOpen && (
              <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <h2 className="text-sm font-medium text-slate-500 hidden sm:block">
              {pathname.split('/').pop().charAt(0).toUpperCase() + pathname.split('/').pop().slice(1) || 'Overview'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 h-10 hover:bg-slate-100 rounded-xl transition-all">
                  <span className="text-sm font-semibold text-slate-700 hidden sm:inline-block">
                    {profile?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                  <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-slate-200/60">
                <DropdownMenuLabel className="font-bold text-slate-900">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem onClick={() => router.push('/settings')} className="rounded-xl focus:bg-slate-50">
                  <Settings className="mr-2 h-4 w-4" /> Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/workspaces')} className="rounded-xl focus:bg-slate-50">
                  <Plus className="mr-2 h-4 w-4" /> Switch Workspace
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-xl">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
