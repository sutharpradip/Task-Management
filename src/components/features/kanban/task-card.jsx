"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Calendar, 
  Paperclip, 
  MessageSquare, 
  CheckSquare, 
  AlertCircle,
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

const PRIORITY_COLORS = {
  low: "bg-slate-100 text-slate-600 border-slate-200",
  medium: "bg-blue-50 text-blue-600 border-blue-100",
  high: "bg-orange-50 text-orange-600 border-orange-100",
  urgent: "bg-red-50 text-red-600 border-red-100",
};

export default function TaskCard({ task, tags, onClick, isOverlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isOverlay
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertCircle className="h-3 w-3 mr-1" />;
    }
    return null;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (!isDragging && onClick) onClick(e);
      }}
      className={`
        bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm 
        hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 
        transition-all duration-300 cursor-grab active:cursor-grabbing
        group relative overflow-hidden
        ${isOverlay ? 'shadow-2xl border-blue-500 rotate-2 scale-105' : ''}
      `}
    >
      {/* Decorative accent for high priority */}
      {(task.priority === 'urgent' || task.priority === 'high') && (
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500/80" />
      )}

      <div className="flex flex-col gap-4">
        {/* Tags & Priority */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {task.tags?.map(tagId => {
              const tag = tags?.find(t => t.id === tagId);
              return tag ? (
                <span 
                  key={tagId} 
                  className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200"
                  style={{ borderLeftColor: tag.color, borderLeftWidth: '3px' }}
                >
                  {tag.name}
                </span>
              ) : null;
            })}
          </div>
          <Badge variant="outline" className={`text-[9px] uppercase font-bold px-2 py-0 h-5 rounded-lg border-none ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority}
          </Badge>
        </div>

        {/* Title */}
        <h4 className="font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
          {task.title}
        </h4>

        {/* Task Metadata */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex items-center gap-3 text-slate-400">
            {task.due_date && (
              <div className={`flex items-center gap-1 text-[11px] font-bold ${new Date(task.due_date) < new Date() ? 'text-red-500' : ''}`}>
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.due_date), "MMM d")}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <MessageSquare className="h-3 w-3" />
              <span>{task.comment_count || 0}</span>
            </div>

            {task.attachment_count > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Paperclip className="h-3 w-3" />
                <span>{task.attachment_count}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <Avatar className="h-7 w-7 border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-110">
              <AvatarImage src={task.assignee?.avatar_url} />
              <AvatarFallback className="bg-blue-600 text-white text-[10px] font-bold">
                {task.assignee?.full_name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            {task.assignee?.status === 'online' && (
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
