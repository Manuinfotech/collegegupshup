import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Lock, User, Save } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Settings' };

export default async function CollegeSettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account and notification preferences.</p>
        </div>
        <Button className="shadow-sm">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Account Details</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={profile?.full_name || ''} className="focus-visible:ring-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={profile?.email || ''} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue={profile?.phone || ''} className="focus-visible:ring-indigo-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-50 ring-1 ring-rose-100 flex items-center justify-center">
              <Lock className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" placeholder="••••••••" className="focus-visible:ring-indigo-500" />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input type="password" placeholder="••••••••" className="focus-visible:ring-indigo-500" />
          </div>
          <Button variant="outline" className="text-rose-600 hover:bg-rose-50 border-rose-200">
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 ring-1 ring-amber-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Choose what notifications you receive.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">New Lead Alerts</p>
              <p className="text-sm text-slate-500">Get notified when a student enquires</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 rounded text-indigo-600" />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Review Notifications</p>
              <p className="text-sm text-slate-500">Get notified when a student leaves a review</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 rounded text-indigo-600" />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Subscription Alerts</p>
              <p className="text-sm text-slate-500">Billing and subscription renewal reminders</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 rounded text-indigo-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
