import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, UserCog, Mail } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = { title: 'College Managers' };

export default async function AdminManagersPage() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch managers (college_admin)
  const { data: managers } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'college_admin')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">College Managers</h1>
          <p className="text-slate-500 mt-1">Manage accounts responsible for specific colleges.</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Invite Manager
        </Button>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search managers by name or email..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="p-4 font-medium text-slate-500">Manager Name</th>
                  <th className="p-4 font-medium text-slate-500">Contact</th>
                  <th className="p-4 font-medium text-slate-500">Status</th>
                  <th className="p-4 font-medium text-slate-500">Joined</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {managers && managers.length > 0 ? (
                  managers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <UserCog className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-900 group-hover:text-[#bce600] transition-colors">
                            {user.full_name || 'Pending Invite'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Active
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-500">
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                          Manage Access
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      <UserCog className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p>No managers found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
