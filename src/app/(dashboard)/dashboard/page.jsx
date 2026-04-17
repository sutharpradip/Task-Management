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
    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
      <ClipboardList className="h-12 w-12 text-slate-300 mb-4" />
      <h2 className="text-xl font-bold">No data yet</h2>
      <p className="text-slate-500">Create a workspace and add some tasks to see analytics.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Real-time performance metrics and task distribution.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.total} icon={ClipboardList} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="text-green-600" bg="bg-green-50" />
        <StatCard title="Completion Rate" value={`${Math.round((stats.completed / stats.total) * 100) || 0}%`} icon={TrendingUp} color="text-purple-600" bg="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tasks by Status</CardTitle>
            <CardDescription>Current workflow distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Priority Breakdown</CardTitle>
            <CardDescription>Visualizing task urgency levels</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {stats.priorityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-slate-600">{item.name}</span>
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
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${bg}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
