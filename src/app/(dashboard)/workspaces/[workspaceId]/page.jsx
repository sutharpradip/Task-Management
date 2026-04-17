"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, Folder, Calendar, Users, Briefcase, Settings, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import Link from "next/link";
import { RoleGate } from "@/components/common/role-gate";
import { PERMISSIONS } from "@/utils/permissions";

export default function WorkspaceDetailPage() {
  const { workspaceId } = useParams();
  const queryClient = useQueryClient();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  // Fetch Workspace Info
  const { data: workspace } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", workspaceId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch Projects in this workspace
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("workspace_id", workspaceId);
      if (error) throw error;
      return data;
    },
    enabled: !!workspaceId,
  });

  // Create project mutation
  const createProject = useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ ...payload, workspace_id: workspaceId }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects", workspaceId]);
      setIsCreateProjectOpen(false);
      setNewProject({ name: "", description: "" });
      toast.success("Project created successfully!");
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 text-slate-500">
          <Link href="/workspaces">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Workspaces
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {workspace?.name || "Workspace"}
            </h1>
            <p className="text-slate-500 mt-1">Manage all projects in this workspace.</p>
          </div>

          <RoleGate permission={PERMISSIONS.PROJECT_CREATE}>
            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Project</DialogTitle>
                  <DialogDescription>
                    Organize your tasks into projects for better management.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Website Redesign, Product Launch"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="What is this project about?"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={() => createProject.mutate(newProject)}
                    disabled={!newProject.name || createProject.isPending}
                  >
                    {createProject.isPending ? "Creating..." : "Create Project"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </RoleGate>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-all border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                {project.description || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-4 text-sm text-slate-500">
                 <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                 </div>
               </div>
            </CardContent>
            <CardFooter className="border-t border-slate-50 mt-2 p-4">
              <Button asChild className="w-full bg-slate-900 hover:bg-slate-800">
                <Link href={`/workspaces/${workspaceId}/projects/${project.id}`}>
                  View Project Board
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {projects?.length === 0 && !projectsLoading && (
          <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <Folder className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No projects yet</h3>
            <p className="text-slate-500 mb-6">Start by creating your first project.</p>
            <Button onClick={() => setIsCreateProjectOpen(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
