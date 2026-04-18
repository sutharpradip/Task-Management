"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ClipboardList, 
  TrendingUp,
  Users as UsersIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useAuth();

  // Fetch all tasks across all user's workspaces
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      // 1. Get user's workspaces
      const { data: workspaces } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", user.id);
      
      const workspaceIds = workspaces?.map(w => w.workspace_id) || [];
      
      if (workspaceIds.length === 0) return null;

      // 2. Get tasks
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .in("workspace_id", workspaceIds);

      if (error) throw error;

      // 3. Process Stats
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'done').length;
      const todo = tasks.filter(t => t.status === 'todo').length;
      const inProgress = tasks.filter(t => t.status === 'in_progress').length;
      
      const priorityData = [
        { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#94a3b8' },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#3b82f6' },
        { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#f97316' },
        { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, color: '#ef4444' },
      ];

      const statusData = [
        { name: 'To Do', count: todo },
        { name: 'In Progress', count: inProgress },
        { name: 'In Review', count: tasks.filter(t => t.status === 'in_review').length },
        { name: 'Done', count: completed },
      ];

      return { total, completed, todo, inProgress, priorityData, statusData };
    },
    enabled: !!user,
  });

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
  </div>;

  if (!stats) return (
    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm animate-in fade-in zoom-in duration-500">
      <div className="p-4 bg-slate-50 rounded-2xl mb-4">
        <ClipboardList className="h-10 w-10 text-slate-300" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your world is empty</h2>
      <p className="text-slate-500 mt-2 max-w-sm text-center">Create a workspace and add some tasks to see your team's performance metrics here.</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Good Morning!</h1>
        <p className="text-slate-500 font-medium">Here's what's happening across your workspaces today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Tasks" value={stats.total} icon={ClipboardList} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="text-green-600" bg="bg-green-50" />
        <StatCard title="Success Rate" value={`${Math.round((stats.completed / (stats.total || 1)) * 100)}%`} icon={TrendingUp} color="text-purple-600" bg="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold tracking-tight">Workflow Status</CardTitle>
            <CardDescription className="font-medium text-slate-400">Current task distribution by stage</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 12 }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 8, 8]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold tracking-tight">Priority Levels</CardTitle>
            <CardDescription className="font-medium text-slate-400">Task urgency breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] flex flex-col items-center justify-center pt-4">
            <div className="relative w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.priorityData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Optional: Center text for Pie Chart */}
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">{stats.total}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks</p>
              </div>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-3 mt-4">
              {stats.priorityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-bold text-slate-600 truncate">{item.name}</span>
                  <span className="ml-auto text-[11px] font-black text-slate-400">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] bg-white overflow-hidden group">
      <CardContent className="p-8">
        <div className="flex flex-col gap-6">
          <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
            <Icon className={`h-7 w-7 ${color}`} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
