import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download, Users, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Lead Management' };

export default async function LeadsPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase
    .from('college_users')
    .select('college_id')
    .eq('user_id', user.id)
    .single();

  const collegeId = collegeUser?.college_id;

  let leads: any[] = [];
  if (collegeId) {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('college_id', collegeId)
      .order('created_at', { ascending: false });
    if (data) leads = data;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leads</h1>
          <p className="text-slate-500 mt-1">Manage prospective students and inquiries.</p>
        </div>
        <Button variant="outline" className="text-slate-600 bg-white border-slate-200 hover:bg-slate-50" disabled={!leads.length}>
          <Download className="h-4 w-4 mr-2" />
          Export Leads
        </Button>
      </div>

      {!collegeId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl">
          <strong>Notice:</strong> You are not currently linked to any college. Please contact support to link your account.
        </div>
      )}

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by name, email, or phone..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" disabled={!collegeId} />
            </div>
            <select className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 transition-all" disabled={!collegeId}>
              <option value="">All Sources</option>
              <option value="direct">Direct Apply</option>
              <option value="brochure">Brochure Download</option>
              <option value="contact">Contact Form</option>
            </select>
            <select className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 transition-all" disabled={!collegeId}>
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="p-4 font-medium text-slate-500">Student Info</th>
                  <th className="p-4 font-medium text-slate-500">Contact</th>
                  <th className="p-4 font-medium text-slate-500">Interest</th>
                  <th className="p-4 font-medium text-slate-500">Source</th>
                  <th className="p-4 font-medium text-slate-500">Status</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <span className="font-bold text-indigo-700">
                              {lead.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {lead.name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 space-y-1">
                        {lead.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-slate-400" />
                            {lead.email}
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {lead.phone}
                          </div>
                        )}
                        {lead.city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {lead.city}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-slate-700">{lead.course_interest || 'General'}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                          {lead.source || 'Direct'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`
                          ${lead.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            lead.status === 'contacted' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            lead.status === 'converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            'bg-slate-50 text-slate-700 border-slate-200'}
                        `}>
                          {lead.status?.toUpperCase() || 'NEW'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <Users className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p>No leads recorded yet.</p>
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
