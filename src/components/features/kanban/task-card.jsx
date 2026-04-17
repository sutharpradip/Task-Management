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
        bg-white p-4 rounded-xl border border-slate-200 shadow-sm 
        hover:border-blue-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing
        group relative
        ${isOverlay ? 'shadow-xl border-blue-400 rotate-2' : ''}
      `}
    >
      <div className="flex flex-col gap-3">
        {/* Tags & Priority */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {task.tags?.map(tagId => {
              const tag = tags?.find(t => t.id === tagId);
              return tag ? (
                <span 
                  key={tagId} 
                  className="w-8 h-1.5 rounded-full" 
                  style={{ backgroundColor: tag.color || '#cbd5e1' }}
                  title={tag.name}
                />
              ) : null;
            })}
          </div>
          <Badge variant="outline" className={`text-[10px] uppercase font-bold py-0 h-5 ${PRIORITY_COLORS[task.priority]}`}>
            {getPriorityIcon(task.priority)}
            {task.priority}
          </Badge>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
          {task.title}
        </h4>

        {/* Task Metadata */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3 text-slate-400">
            {task.due_date && (
              <div className="flex items-center gap-1 text-[11px] font-medium">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.due_date), "MMM d")}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-[11px] font-medium">
              <MessageSquare className="h-3 w-3" />
              <span>{task.comment_count || 0}</span>
            </div>

            {task.attachment_count > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-medium">
                <Paperclip className="h-3 w-3" />
                <span>{task.attachment_count}</span>
              </div>
            )}
          </div>

          <Avatar className="h-6 w-6 border-2 border-white shadow-sm ring-1 ring-slate-100">
            <AvatarImage src={task.assignee?.avatar_url} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-[10px] font-bold">
              {task.assignee?.full_name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
