"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { Send, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function CommentSection({ taskId }) {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  // Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .eq("task_id", taskId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!taskId,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content) => {
      const { data, error } = await supabase
        .from("comments")
        .insert([{ task_id: taskId, user_id: user.id, content }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", taskId]);
      setNewComment("");
      toast.success("Comment added");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment);
  };

  if (isLoading) return <div className="animate-pulse space-y-4">
    {[1, 2].map(i => <div key={i} className="h-20 bg-slate-50 rounded-lg" />)}
  </div>;

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={comment.user?.avatar_url} />
              <AvatarFallback className="bg-slate-200 text-slate-600 text-[10px]">
                {comment.user?.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{comment.user?.full_name}</span>
                <span className="text-[10px] text-slate-400">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 border border-slate-100">
                {comment.content}
              </div>
            </div>
          </div>
        ))}

        {comments?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400">No comments yet. Be the first to start the conversation!</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto border-t pt-4">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] pr-12 resize-none bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-xl"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!newComment.trim() || addCommentMutation.isPending}
          className="absolute bottom-6 right-3 bg-blue-600 hover:bg-blue-700 rounded-lg h-8 w-8 shadow-md"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
