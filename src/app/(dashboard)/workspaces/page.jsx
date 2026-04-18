"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Layout, Settings, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import Link from "next/link";

export default function WorkspacesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  // Fetch workspaces where user is a member
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces", user?.id],
    queryFn: async () => {
      // Fetch workspaces - RLS will naturally filter this to what you can see
      const { data, error } = await supabase
        .from("workspaces")
        .select(`
          *,
          workspace_members(user_id, role)
        `);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Create workspace mutation
  const createWorkspace = useMutation({
    mutationFn: async (name) => {
      const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substring(2, 5);
      
      // 1. Create workspace - DB Trigger now handles adding the member automatically
      const { data: workspace, error: wError } = await supabase
        .from("workspaces")
        .insert([{ name, slug, owner_id: user.id }])
        .select()
        .single();
 
      if (wError) throw wError;
 
      return workspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["workspaces"]);
      setIsCreateOpen(false);
      setNewWorkspaceName("");
      toast.success("Workspace created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create workspace");
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-white rounded-xl animate-pulse border border-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Workspaces</h1>
          <p className="text-slate-500 font-medium font-medium">Select or create a container for your team and projects.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 h-11 px-6 rounded-2xl shadow-lg shadow-blue-500/20 font-bold transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-wider">
              <Plus className="mr-2 h-4 w-4" /> New Workspace
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2rem] p-8 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Create Workspace</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium pt-2">
                Workspaces are where your team collaborates. You can invite members later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Workspace Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Marketing Team, Engineering"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all px-4 font-medium"
                />
              </div>
            </div>
            <DialogFooter className="gap-3">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl font-bold h-12 px-6 hover:bg-slate-50">Cancel</Button>
              <Button 
                onClick={() => createWorkspace.mutate(newWorkspaceName)}
                disabled={!newWorkspaceName || createWorkspace.isPending}
                className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20"
              >
                {createWorkspace.isPending ? "Creating..." : "Launch Workspace"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workspaces?.map((workspace) => (
          <Card key={workspace.id} className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-[2rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 font-black text-xl shadow-inner border border-blue-100/50">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                {workspace.name}
              </CardTitle>
              <CardDescription className="font-medium text-slate-400">
                Active since {new Date(workspace.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-6 flex justify-between items-center border-t border-slate-50 mt-4 bg-slate-50/30 p-8">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-xl border-4 border-white bg-slate-100 flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
                    <Users className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
              <Button asChild variant="ghost" className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <Link href={`/workspaces/${workspace.id}`}>
                  Enter Workspace <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {workspaces?.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Layout className="h-8 w-8 text-slate-300" />
             </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create your first control center</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">Workspaces are the top-level containers where your team's magic happens. Give it a name and start building.</p>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-2xl shadow-xl shadow-blue-500/20 font-black text-xs uppercase tracking-widest transition-all hover:scale-105">
               Build My First Workspace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
