'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ViewLeadButton } from '@/components/leads/view-lead-button';

export function AdminLeadsTable({ leads }: { leads: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(leads.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = leads.slice(startIndex, endIndex);

  return (
    <Card className="border-0 shadow-sm shadow-slate-200/50 overflow-hidden mt-6">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="p-4 font-medium text-slate-500">Student Info</th>
                <th className="p-4 font-medium text-slate-500">College</th>
                <th className="p-4 font-medium text-slate-500">Contact</th>
                <th className="p-4 font-medium text-slate-500">Interest</th>
                <th className="p-4 font-medium text-slate-500">Source</th>
                <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentLeads && currentLeads.length > 0 ? (
                currentLeads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <span className="font-bold text-indigo-700">
                            {lead.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-[#bce600] transition-colors">
                            {lead.name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-700">
                          {lead.colleges?.name || 'Unknown College'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-slate-600">
                        <span className="flex items-center gap-2">
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-slate-500">
                          {lead.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-700">{lead.course_interest || 'Not specified'}</span>
                        <span className="text-xs text-slate-500">{lead.city || 'Unknown City'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                        {lead.source || 'Direct'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <ViewLeadButton lead={lead} />
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Showing {startIndex + 1} to {Math.min(endIndex, leads.length)} of {leads.length} leads
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2 text-slate-400">...</span>}
                      <Button
                        variant={currentPage === p ? "default" : "outline"}
                        size="sm"
                        className={currentPage === p ? "bg-[#D4FF00] text-black" : ""}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </Button>
                    </React.Fragment>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
