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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Members</h1>
          <p className="text-slate-500 mt-1">Manage collaborators across your workspaces.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="mr-2 h-4 w-4" /> Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members?.map((member) => (
          <Card key={member.user_id} className="border-none shadow-sm hover:shadow-md transition-shadow group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={member.profiles?.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                      {member.profiles?.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none">{member.profiles?.full_name}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {member.profiles?.email}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Badge variant="outline" className={`capitalize font-bold text-[10px] ${
                  member.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                  member.role === 'manager' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  <Shield className="h-3 w-3 mr-1" /> {member.role}
                </Badge>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {members?.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">It's just you here</h3>
            <p className="text-slate-500 mb-6">Invite your teammates to start collaborating on projects.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" /> Invite Teammates
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
