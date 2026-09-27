'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

type ColumnKey = 'name' | 'college' | 'email' | 'phone' | 'city' | 'course_interest' | 'source' | 'status' | 'date';

export function ExportLeadsButton({ leads, filename = 'campus_gupshup_leads.csv', label = 'Export Leads' }: { leads: any[], filename?: string, label?: string }) {
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState<number | 'all'>('all');
  const [timeDuration, setTimeDuration] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const hasCollege = leads.some(l => l.colleges?.name);
  
  const allColumns: { key: ColumnKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    ...(hasCollege ? [{ key: 'college' as ColumnKey, label: 'College' }] : []),
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'course_interest', label: 'Course' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' }
  ];
  
  const [selectedCols, setSelectedCols] = useState<ColumnKey[]>(allColumns.map(c => c.key));

  const toggleCol = (key: ColumnKey) => {
    setSelectedCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleExport = () => {
    let filtered = leads;
    const now = new Date();
    
    if (timeDuration !== 'all') {
      let start: Date;
      let end: Date = now;
      if (timeDuration === 'today') {
        start = startOfDay(now);
      } else if (timeDuration === 'yesterday') {
        start = startOfDay(subDays(now, 1));
        end = endOfDay(subDays(now, 1));
      } else if (timeDuration === 'this_month') {
        start = startOfMonth(now);
      } else if (timeDuration === 'last_month') {
        const lastMonth = subMonths(now, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
      } else if (timeDuration === 'custom' && startDate && endDate) {
        start = startOfDay(new Date(startDate));
        end = endOfDay(new Date(endDate));
      } else {
        start = new Date(0);
      }
      
      filtered = filtered.filter(l => {
        const d = new Date(l.created_at);
        return d >= start && d <= end;
      });
    }

    if (limit !== 'all') {
      filtered = filtered.slice(0, limit);
    }
    
    if (!filtered.length) {
      alert("No leads found for this selection");
      return;
    }

    const headers = allColumns.filter(c => selectedCols.includes(c.key)).map(c => c.label);
    const csvRows = [headers.join(',')];

    for (const lead of filtered) {
      const row = [];
      if (selectedCols.includes('name')) row.push(`"${(lead.name || '').replace(/"/g, '""')}"`);
      if (hasCollege && selectedCols.includes('college')) row.push(`"${(lead.colleges?.name || '').replace(/"/g, '""')}"`);
      if (selectedCols.includes('email')) row.push(`"${(lead.email || '').replace(/"/g, '""')}"`);
      if (selectedCols.includes('phone')) row.push(`"${(lead.phone || '').replace(/"/g, '""')}"`);
      if (selectedCols.includes('city')) row.push(`"${(lead.city || '').replace(/"/g, '""')}"`);
      if (selectedCols.includes('course_interest')) row.push(`"${(lead.course_interest || '').replace(/"/g, '""')}"`);
      if (selectedCols.includes('source')) row.push(`"${(lead.source || '').replace(/"/g, '""')}"`);
      if (selectedCols.includes('status')) row.push(`"${(lead.status || '').replace(/"/g, '""')}"`);
      if (selectedCols.includes('date')) row.push(`"${new Date(lead.created_at).toLocaleString()}"`);
      
      csvRows.push(row.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'campus_gupshup_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        <Button 
          variant="outline" 
          className="text-slate-600 bg-white border-slate-200 hover:bg-slate-50" 
          disabled={!leads.length}
        >
          <Download className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </div>
      <DialogContent className="sm:max-w-md bg-white border-slate-100 z-[9999]">
        <DialogHeader>
          <DialogTitle>Export Leads</DialogTitle>
          <DialogDescription>
            Customize how you want to export your leads data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">Time Duration</Label>
            <select 
              value={timeDuration} 
              onChange={(e) => setTimeDuration(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {timeDuration === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Start Date</Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase">End Date</Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">Number of Leads</Label>
            <select 
              value={limit} 
              onChange={(e) => setLimit(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Available</option>
              <option value="10">10 Leads</option>
              <option value="50">50 Leads</option>
              <option value="100">100 Leads</option>
              <option value="500">500 Leads</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-slate-700">Columns to Export</Label>
              <button 
                type="button"
                onClick={() => setSelectedCols(selectedCols.length === allColumns.length ? [] : allColumns.map(c => c.key))}
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                {selectedCols.length === allColumns.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              {allColumns.map(col => (
                <div key={col.key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`col-${col.key}`} 
                    checked={selectedCols.includes(col.key)} 
                    onCheckedChange={() => toggleCol(col.key)}
                  />
                  <Label htmlFor={`col-${col.key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            className="" 
            onClick={handleExport}
            disabled={selectedCols.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
