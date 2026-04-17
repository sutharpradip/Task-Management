"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        avatarUrl: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          avatar_url: formData.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!profile && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
          We're still setting up your profile. Some features may be limited until then.
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
          <p className="text-sm text-slate-500">Update your personal details and how others see you on the platform.</p>
        </div>

        <Card className="md:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Your public profile information.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-white shadow-md ring-1 ring-slate-100">
                  <AvatarImage src={formData.avatarUrl} />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                    {formData.fullName?.charAt(0) || user?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input 
                    id="avatarUrl" 
                    placeholder="https://example.com/photo.jpg" 
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                    className="w-full md:w-80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="fullName" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="email" 
                      value={user?.email} 
                      disabled 
                      className="pl-9 bg-slate-50"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Email cannot be changed.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Your Role</Label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700 capitalize">{profile?.role}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-50 px-6 py-4 bg-slate-50/30">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 ml-auto">
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
