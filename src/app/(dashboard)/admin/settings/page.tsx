import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Globe, Mail, Bell, Shield, Save } from 'lucide-react';

export const metadata: Metadata = { title: 'Platform Settings' };

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
          <p className="text-slate-500 mt-1">Configure global platform settings and preferences.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
              <Globe className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg">General</CardTitle>
              <CardDescription>Site name, description, and public-facing settings.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input defaultValue="College Gupshup" className="focus-visible:ring-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label>Site URL</Label>
              <Input defaultValue="https://collegegupshup.com" className="focus-visible:ring-indigo-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Input defaultValue="India's leading education discovery and college management platform" className="focus-visible:ring-indigo-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Email Configuration</CardTitle>
              <CardDescription>Configure email sender settings and templates.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Sender Email</Label>
              <Input defaultValue="noreply@collegegupshup.com" className="focus-visible:ring-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input defaultValue="support@collegegupshup.com" className="focus-visible:ring-indigo-500" />
            </div>
          </div>
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
              <CardDescription>Configure system notifications and alerts.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">New College Registration</p>
              <p className="text-sm text-slate-500">Get notified when a new college registers</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Payment Received</p>
              <p className="text-sm text-slate-500">Get notified for successful payments</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Content Review Required</p>
              <p className="text-sm text-slate-500">Notify when content needs review</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
