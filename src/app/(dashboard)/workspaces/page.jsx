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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Workspaces</h1>
          <p className="text-slate-500 mt-1">Select a workspace to start managing your projects.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 h-10 px-4">
              <Plus className="mr-2 h-4 w-4" /> New Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Workspace</DialogTitle>
              <DialogDescription>
                Workspaces are where your team collaborates. You can invite members later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Marketing Team, Engineering"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => createWorkspace.mutate(newWorkspaceName)}
                disabled={!newWorkspaceName || createWorkspace.isPending}
              >
                {createWorkspace.isPending ? "Creating..." : "Create Workspace"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces?.map((workspace) => (
          <Card key={workspace.id} className="group hover:shadow-lg transition-all border-slate-200 border-2 hover:border-blue-200 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors font-bold text-lg">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <CardTitle className="group-hover:text-blue-600 transition-colors">
                {workspace.name}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                Last updated {new Date(workspace.updated_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 flex justify-between items-center border-t border-slate-50 mt-4 bg-slate-50/50 p-4">
              <div className="flex -space-x-2">
                {[1, 2].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center">
                    <Users className="h-3 w-3 text-slate-400" />
                  </div>
                ))}
              </div>
              <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Link href={`/workspaces/${workspace.id}`}>
                  Open <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {workspaces?.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Layout className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900">No workspaces yet</h3>
            <p className="text-slate-500 mb-6">Create your first workspace to start managing projects.</p>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Create My First Workspace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
