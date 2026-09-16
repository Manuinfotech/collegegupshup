import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Shield, User, Clock } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = { title: 'Audit Logs' };

export default async function AdminAuditLogsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*, users(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
        <p className="text-slate-500 mt-1">Track all actions and changes across the platform.</p>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by action, entity, or user..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" />
            </div>
            <select className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {logs && logs.length > 0 ? logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-5 hover:bg-slate-50/50 transition-colors group">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{log.action}</span>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs">
                      {log.entity_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {/* @ts-ignore */}
                      {log.users?.full_name || log.users?.email || 'System'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                    {log.ip_address && (
                      <span className="text-slate-400">IP: {log.ip_address}</span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-slate-500">
                <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-900 mb-1">No audit logs yet</p>
                <p className="text-sm">Actions and changes will be tracked here automatically.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
