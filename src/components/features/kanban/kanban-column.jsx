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
    <div className="flex flex-col w-[320px] bg-slate-100/40 rounded-3xl border border-slate-200/50 max-h-full">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-800 tracking-tight">{column.title}</h3>
          <span className="bg-white text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-white hover:text-blue-600 rounded-xl transition-all">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-white hover:text-slate-600 rounded-xl transition-all">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 overflow-y-auto px-3 pb-6 space-y-4 min-h-[150px] scrollbar-hide"
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
          <div className="h-32 border-2 border-dashed border-slate-200/60 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs bg-white/30 gap-2">
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
               <Plus className="h-3 w-3" />
            </div>
            <span>No tasks yet</span>
          </div>
        )}
      </div>
    </div>
  );
}
