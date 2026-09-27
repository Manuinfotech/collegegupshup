import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download, Users, Mail, Phone, MapPin, ExternalLink, Building2 } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import { LeadSource, LeadStatus } from '@/types/database';
import { redirect } from 'next/navigation';
import { requireSuperAdmin } from '@/lib/actions/admin-colleges';
import { ExportLeadsButton } from '@/components/leads/export-leads-button';
import { LeadsFilter } from '@/components/leads/leads-filter';
import { ViewLeadButton } from '@/components/leads/view-lead-button';
import { AdminLeadsTable } from './admin-leads-table';

export const metadata: Metadata = { title: 'Global Lead Management | Superadmin' };

export default async function SuperadminLeadsPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  await requireSuperAdmin();
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('leads')
    .select(`
      *,
      colleges (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (searchParams.q) {
    query = query.or(`name.ilike.%${searchParams.q}%,email.ilike.%${searchParams.q}%,phone.ilike.%${searchParams.q}%`);
  }
  if (searchParams.college) {
    query = query.eq('college_id', searchParams.college);
  }
  if (searchParams.source) {
    query = query.eq('source', searchParams.source as LeadSource);
  }
  if (searchParams.status) {
    query = query.eq('status', searchParams.status as LeadStatus);
  }

  const { data: leadsData } = await query;
  
  // Fetch colleges for the dropdown
  const { data: collegesData } = await supabase.from('colleges').select('id, name').order('name');

  const leads = leadsData || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Leads (Superadmin)</h1>
          <p className="text-slate-500 mt-1">Manage and monitor all student inquiries across all colleges.</p>
        </div>
        <ExportLeadsButton leads={leads} label="Export All Leads" filename="superadmin_all_leads.csv" />
      </div>

      <LeadsFilter colleges={collegesData || []} showCollegeFilter={true} />

      <AdminLeadsTable leads={leads} />
    </div>
  );
}
