"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { Plus, Filter, Search, MoreVertical, Calendar, Tag, MessageSquare, Paperclip, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";

// Components
import KanbanColumn from "@/components/features/kanban/kanban-column";
import TaskCard from "@/components/features/kanban/task-card";
import TaskModal from "@/components/features/kanban/task-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-slate-200" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-100" },
  { id: "in_review", title: "In Review", color: "bg-amber-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
];

export default function ProjectBoardPage() {
  const { workspaceId, projectId } = useParams();
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" });

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Fetch Tags for the workspace (needed for task cards)
  const { data: tags } = useQuery({
    queryKey: ["tags", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("workspace_id", workspaceId);
      if (error) throw error;
      return data;
    },
  });

  // Fetch Tasks for the project
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          assignee:profiles!tasks_assignee_id_fkey(full_name, avatar_url),
          task_tags(tag_id)
        `)
        .eq("project_id", projectId)
        .order("position", { ascending: true });
      
      if (error) throw error;
      return data.map(task => ({
        ...task,
        tags: task.task_tags?.map(tt => tt.tag_id) || []
      }));
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`project-tasks:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          queryClient.invalidateQueries(["tasks", projectId]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  // Mutation to create task
  const createTaskMutation = useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ 
          ...payload, 
          project_id: projectId, 
          workspace_id: workspaceId,
          position: tasks?.length ? Math.max(...tasks.map(t => t.position)) + 1000 : 1000,
          status: "todo"
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", projectId]);
      setIsAddTaskOpen(false);
      setNewTask({ title: "", description: "", priority: "medium" });
      toast.success("Task created");
    },
  });

  // Mutation to update task status/position
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status, position }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ status, position, updated_at: new Date() })
        .eq("id", taskId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", projectId]);
    },
  });

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Check if dropping into a different column or same column
    const activeTask = tasks.find(t => t.id === activeId);
    const overItem = tasks.find(t => t.id === overId) || { id: overId }; // overId might be column id
    
    let newStatus = activeTask.status;
    let newPosition = activeTask.position;

    const isOverColumn = COLUMNS.some(c => c.id === overId);
    
    if (isOverColumn) {
      newStatus = overId;
      // If dropped at the bottom of a column
      const columnTasks = tasks.filter(t => t.status === overId);
      newPosition = columnTasks.length > 0 
        ? Math.max(...columnTasks.map(t => t.position)) + 1000 
        : 1000;
    } else {
      const overTask = tasks.find(t => t.id === overId);
      newStatus = overTask.status;
      
      const columnTasks = tasks.filter(t => t.status === newStatus).sort((a,b) => a.position - b.position);
      const overIndex = columnTasks.findIndex(t => t.id === overId);
      
      if (overIndex === 0) {
        newPosition = columnTasks[0].position / 2;
      } else if (overIndex === columnTasks.length - 1) {
        newPosition = columnTasks[overIndex].position + 1000;
      } else {
        newPosition = (columnTasks[overIndex - 1].position + columnTasks[overIndex].position) / 2;
      }
    }

    // Optimistic update
    queryClient.setQueryData(["tasks", projectId], (old) => {
      return old.map(t => t.id === activeId ? { ...t, status: newStatus, position: newPosition } : t)
        .sort((a, b) => a.position - b.position);
    });

    try {
      await updateTaskMutation.mutateAsync({ taskId: activeId, status: newStatus, position: newPosition });
    } catch (err) {
      queryClient.invalidateQueries(["tasks", projectId]);
      toast.error("Failed to move task");
    }
  };

  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === "all" || task.assignee_id === filterAssignee;
    
    return matchesSearch && matchesPriority && matchesAssignee;
  }) || [];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Board</h1>
          <p className="text-sm text-slate-500">Track and manage tasks for this project.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input 
                placeholder="Search tasks..." 
                className="pl-9 w-[200px] h-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>

           <div className="flex items-center gap-2">
             <Select value={filterPriority} onValueChange={setFilterPriority}>
               <SelectTrigger className="h-10 w-[130px] bg-white border-slate-200">
                 <Filter className="mr-2 h-4 w-4 text-slate-400" />
                 <SelectValue placeholder="Priority" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Priorities</SelectItem>
                 <SelectItem value="urgent">Urgent</SelectItem>
                 <SelectItem value="high">High</SelectItem>
                 <SelectItem value="medium">Medium</SelectItem>
                 <SelectItem value="low">Low</SelectItem>
               </SelectContent>
             </Select>
           </div>
           
           <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 h-10">
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="t-title">Task Title</Label>
                    <Input
                      id="t-title"
                      placeholder="e.g. Design Login Page"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="t-desc">Description</Label>
                    <Textarea
                      id="t-desc"
                      placeholder="Add some details..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={() => createTaskMutation.mutate(newTask)}
                    disabled={!newTask.title || createTaskMutation.isPending}
                  >
                    {createTaskMutation.isPending ? "Adding..." : "Add Task"}
                  </Button>
                </DialogFooter>
              </DialogContent>
           </Dialog>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-6 h-full min-w-max">
            {COLUMNS.map((column) => (
              <KanbanColumn 
                key={column.id} 
                column={column} 
                tasks={filteredTasks.filter(t => t.status === column.id)}
                tags={tags}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
        </div>

        <TaskModal 
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
        />

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeTask ? (
            <div className="w-[300px] rotate-2 cursor-grabbing">
              <TaskCard task={activeTask} tags={tags} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
