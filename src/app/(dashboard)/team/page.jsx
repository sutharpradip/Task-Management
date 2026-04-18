"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Mail, Shield, UserPlus, MoreVertical, MessageSquare } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamPage() {
  const { user } = useAuth();

  // Fetch all members across workspaces user has access to
  const { data: members, isLoading } = useQuery({
    queryKey: ["team-members", user?.id],
    queryFn: async () => {
      // 1. Get workspace IDs
      const { data: workspaces } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", user.id);
      
      const workspaceIds = workspaces?.map(w => w.workspace_id) || [];
      
      if (workspaceIds.length === 0) return [];

      // 2. Get all members for these workspaces
      const { data, error } = await supabase
        .from("workspace_members")
        .select(`
          user_id,
          role,
          joined_at,
          profiles:profiles(full_name, avatar_url, email)
        `)
        .in("workspace_id", workspaceIds);

      if (error) throw error;

      // De-duplicate members if they are in multiple workspaces
      const uniqueMembers = Array.from(new Map(data.map(m => [m.user_id, m])).values());
      return uniqueMembers;
    },
    enabled: !!user,
  });

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Team Members</h1>
          <p className="text-slate-500 font-medium font-medium">Manage collaborators across your workspaces.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 h-11 px-6 rounded-2xl shadow-lg shadow-blue-500/20 font-bold transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-wider">
          <UserPlus className="mr-2 h-4 w-4" /> Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members?.map((member) => (
          <Card key={member.user_id} className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-[2rem] bg-white group overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-xl ring-1 ring-slate-100 transition-transform group-hover:scale-110 duration-500">
                      <AvatarImage src={member.profiles?.avatar_url} />
                      <AvatarFallback className="bg-blue-600 text-white font-black text-xl">
                        {member.profiles?.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full shadow-sm" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-900 leading-none text-lg tracking-tight">{member.profiles?.full_name}</h3>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <Mail className="h-3 w-3" /> {member.profiles?.email}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <Badge variant="outline" className={`capitalize font-black text-[9px] tracking-widest px-3 py-1.5 rounded-xl border-none ${
                  member.role === 'admin' ? 'bg-purple-50 text-purple-600 shadow-sm shadow-purple-500/5' :
                  member.role === 'manager' ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5' :
                  'bg-slate-50 text-slate-500'
                }`}>
                  <Shield className="h-3 w-3 mr-1.5" /> {member.role}
                </Badge>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {members?.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserPlus className="h-8 w-8 text-slate-300" />
             </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Focus on Connection</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">Collaboration is the heart of Antigravity. Invite your teammates to start hitting milestones together.</p>
            <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-2xl shadow-xl shadow-blue-500/20 font-black text-xs uppercase tracking-widest transition-all hover:scale-105">
               Invite Teammates
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
