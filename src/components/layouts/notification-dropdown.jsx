"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  AlertTriangle 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // For this demo, we'll simulate some notifications since activity_logs table is empty
  useEffect(() => {
    const mockNotifications = [
      { id: 1, type: 'assign', text: 'You were assigned to Website Redesign', time: '2 mins ago', icon: UserPlus, color: 'text-blue-600' },
      { id: 2, type: 'comment', text: 'New comment on Login Bug', time: '10 mins ago', icon: MessageSquare, color: 'text-green-600' },
      { id: 3, type: 'urgent', text: 'Task "API Migration" is overdue', time: '1 hour ago', icon: AlertTriangle, color: 'text-red-600' },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.length);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors focus:outline-none">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 border-none shadow-xl">
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Notifications</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {unreadCount} New
          </span>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((notif) => (
            <DropdownMenuItem key={notif.id} className="p-4 focus:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg bg-white border border-slate-100 shadow-sm ${notif.color}`}>
                  <notif.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-slate-700 leading-snug">{notif.text}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{notif.time}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="p-3 bg-slate-50/50 text-center border-t border-slate-100">
          <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-transparent p-0 h-auto">
            Mark all as read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
