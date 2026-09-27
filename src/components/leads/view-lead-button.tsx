'use client';

import { ExternalLink, User, Mail, Phone, MapPin, Building2, Tag, Calendar, MessageSquare } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatDistanceToNow, format } from 'date-fns';
import { Clock, Globe, Fingerprint } from 'lucide-react';

export function ViewLeadButton({ lead }: { lead: any }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium">
        View Details <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
      </button>
      <DialogContent className="sm:max-w-[500px] z-[9999]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-indigo-600" />
            Lead Details
          </DialogTitle>
          <DialogDescription>
            Submitted {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Header info */}
          <div className="flex items-start justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <h3 className="font-semibold text-lg text-slate-900">{lead.name || 'Anonymous User'}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <Mail className="h-3.5 w-3.5" />
                <a href={`mailto:${lead.email}`} className="hover:text-[#bce600] underline-offset-2 hover:underline">{lead.email}</a>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <Phone className="h-3.5 w-3.5" />
                  <a href={`tel:${lead.phone}`} className="hover:text-[#bce600] underline-offset-2 hover:underline">{lead.phone}</a>
                </div>
              )}
            </div>
            {lead.status && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                  lead.status === 'contacted' ? 'bg-amber-100 text-amber-700' : 
                  lead.status === 'converted' ? 'bg-emerald-100 text-emerald-700' : 
                  'bg-slate-100 text-slate-700'}`}>
                {lead.status}
              </span>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-5">
            {lead.colleges?.name && (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> College</div>
                <div className="font-medium text-slate-900">{lead.colleges.name}</div>
              </div>
            )}
            
            {lead.city && (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> City</div>
                <div className="font-medium text-slate-900 capitalize">{lead.city}</div>
              </div>
            )}
            
            {lead.course_interest && (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Interest</div>
                <div className="font-medium text-slate-900">{lead.course_interest}</div>
              </div>
            )}
            
            {lead.source && (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Source</div>
                <div className="font-medium text-slate-900 capitalize">{lead.source.replace(/_/g, ' ')}</div>
              </div>
            )}
          </div>
          
          {/* Metadata Grid */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Exact Time</div>
              <div className="font-medium text-slate-700">{format(new Date(lead.created_at), 'PPpp')}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-slate-500 flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> IP Address</div>
              <div className="font-medium text-slate-700">{lead.ip_address || 'Not recorded'}</div>
            </div>
            
            <div className="space-y-1 sm:col-span-2">
              <div className="text-slate-500 flex items-center gap-1.5"><Fingerprint className="h-3.5 w-3.5" /> Lead Reference ID</div>
              <div className="font-medium text-slate-700 font-mono text-xs">{lead.id}</div>
            </div>
            
            {lead.notes && (
              <div className="space-y-1 sm:col-span-2">
                <div className="text-slate-500 flex items-center gap-1.5">Notes</div>
                <div className="font-medium text-slate-700 whitespace-pre-wrap">{lead.notes}</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <a href={`mailto:${lead.email}`}>
            <Button className="">
              <Mail className="mr-2 h-4 w-4" /> Contact Now
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
