"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  X,
  Calendar,
  Clock,
  User,
  Flag,
  Tag as TagIcon,
  Paperclip,
  CheckSquare,
  Trash2,
  Save
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import CommentSection from "./comment-section";

// Placeholder for TipTap (will integrate properly in next step)
const mockEditorStyle = "min-h-[200px] w-full bg-slate-50 border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function TaskModal({ task, isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    due_date: "",
    estimated_time: ""
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        due_date: task.due_date ? task.due_date.split('T')[0] : "",
        estimated_time: task.estimated_time || "",
        assignee_id: task.assignee_id || ""
      });
    }
  }, [task]);

  // Fetch Team Members for the workspace
  const { data: teamMembers } = useQuery({
    queryKey: ["team", task?.workspace_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_members")
        .select(`
          user_id,
          profiles:profiles(id, full_name, avatar_url)
        `)
        .eq("workspace_id", task.workspace_id);
      if (error) throw error;
      return data.map(m => m.profiles);
    },
    enabled: !!task?.workspace_id,
  });

  const updateTask = useMutation({
    mutationFn: async (updatedData) => {
      const { error } = await supabase
        .from("tasks")
        .update(updatedData)
        .eq("id", task.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", task.project_id]);
      toast.success("Task updated");
      onClose();
    }
  });

  const deleteTask = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", task.project_id]);
      toast.success("Task deleted");
      onClose();
    }
  });

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 h-[90vh] flex flex-col gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 border-b bg-white shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-2xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-slate-300"
                placeholder="Task Title"
              />
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold flex items-center gap-2">
                Workspace / Project / <span className="text-blue-600">Task-{task.id.slice(0, 4)}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => {
                if (confirm("Are you sure?")) deleteTask.mutate();
              }}>
                <Trash2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex bg-slate-50/50">
          {/* Main Form Section */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-slate-100 bg-white">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="w-fit mb-6 bg-slate-100/50 p-1">
                <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">General</TabsTrigger>
                <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6 flex-1 focus-visible:ring-0 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider">Status</Label>
                    <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                      <SelectTrigger className="bg-slate-50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider">Priority</Label>
                    <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                      <SelectTrigger className="bg-slate-50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add a detailed description..."
                    className="min-h-[250px] resize-none bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
              </TabsContent>

              <TabsContent value="subtasks" className="mt-0">
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold">Checklist</h3>
                  <p className="text-sm text-slate-500 italic">Coming soon: Subtask management implementation.</p>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="mt-0">
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold">Files</h3>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center">
                    <Paperclip className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">Click or drag files to upload</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-0 h-full">
                <CommentSection taskId={task.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar / Meta Section */}
          <aside className="w-[280px] shrink-0 p-6 flex flex-col gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Assignee</Label>
                <Select value={formData.assignee_id} onValueChange={(val) => setFormData({ ...formData, assignee_id: val })}>
                  <SelectTrigger className="h-10 bg-white border-slate-200">
                    <div className="flex items-center gap-2">
                      {formData.assignee_id ? (
                        <>
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={teamMembers?.find(m => m.id === formData.assignee_id)?.avatar_url} />
                            <AvatarFallback className="text-[8px] bg-blue-100 text-blue-600">
                              {teamMembers?.find(m => m.id === formData.assignee_id)?.full_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate">{teamMembers?.find(m => m.id === formData.assignee_id)?.full_name}</span>
                        </>
                      ) : (
                        <span className="text-sm text-slate-400">Unassigned</span>
                      )}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {teamMembers?.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={member.avatar_url} />
                            <AvatarFallback className="text-[8px] bg-blue-100 text-blue-600">
                              {member.full_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member.full_name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Due Date
                </Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="h-9 bg-transparent border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Estimated Time
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.estimated_time || ""}
                    onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
                    className="h-9 w-20 bg-transparent border-slate-200"
                  />
                  <span className="text-xs text-slate-500 font-medium font-sans">minutes</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-200">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 shadow-lg shadow-blue-100"
                onClick={() => updateTask.mutate(formData)}
                disabled={updateTask.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {updateTask.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
