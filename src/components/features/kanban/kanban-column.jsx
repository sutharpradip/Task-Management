"use client";

import { useDroppable } from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import TaskCard from "./task-card";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KanbanColumn({ column, tasks, tags, onTaskClick }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col w-[320px] bg-slate-100/50 rounded-xl border border-slate-200/60 max-h-full">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-700">{column.title}</h3>
          <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 overflow-y-auto px-2 pb-4 space-y-3 min-h-[150px]"
      >
        <SortableContext 
          items={tasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} tags={tags} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
}
