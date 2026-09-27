'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteCollege } from '@/lib/actions/college-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Search, Edit2, Trash2, Eye, Plus, ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, CheckCircle2, XCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface CollegeListTableProps {
  initialColleges: any[];
}

export function CollegeListTable({ initialColleges }: CollegeListTableProps) {
  const router = useRouter();
  const [colleges, setColleges] = useState(initialColleges);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Search and Filter
  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || college.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort
  const sortedColleges = [...filteredColleges].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedColleges.length / itemsPerPage);
  const paginatedColleges = sortedColleges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'name' | 'created_at') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this college? This action cannot be undone.')) return;
    
    setIsDeleting(id);
    const result = await deleteCollege(id);
    if (result.success) {
      setColleges(prev => prev.filter(c => c.id !== id));
      router.refresh();
    } else {
      alert(result.error || 'Failed to delete college');
    }
    setIsDeleting(null);
  };

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search colleges..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 bg-white focus-visible:ring-indigo-500 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select 
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <Button 
              onClick={() => router.push('/dashboard/college/create')}
              className="h-11 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add College
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">
                    College Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('created_at')}>
                  <div className="flex items-center gap-2">
                    Added On
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedColleges.length > 0 ? (
                paginatedColleges.map((college) => (
                  <tr key={college.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 font-bold border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform">
                          {college.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-[#bce600] transition-colors">{college.name}</p>
                          <p className="text-xs text-slate-500">{college.college_type || 'Institution'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600">{[college.city_name, college.state_name].filter(Boolean).join(', ') || 'Not specified'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`capitalize ${
                        college.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        college.status === 'draft' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {college.status || 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {format(new Date(college.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <Button 
                          onClick={() => router.push(`/dashboard/college/edit?id=${college.id}&tab=overview`)}
                          variant="ghost" 
                          size="icon" 
                          title="View Details"
                          className="h-8 w-8 text-slate-500 hover:text-[#bce600] hover:bg-indigo-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => router.push(`/dashboard/college/edit?id=${college.id}&tab=overview`)}
                          variant="ghost" 
                          size="icon" 
                          title="Edit"
                          className="h-8 w-8 text-slate-500 hover:text-[#bce600] hover:bg-indigo-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Delete"
                          className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDelete(college.id)}
                          disabled={isDeleting === college.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => window.open(`/colleges/${college.slug}`, '_blank')}
                          variant="ghost" 
                          size="icon" 
                          title="View on Website"
                          className="h-8 w-8 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 ml-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">No colleges found</p>
                    <p>Get started by adding your first college.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      {totalPages > 1 && (
        <div className="border-t border-slate-100 bg-slate-50 p-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * itemsPerPage, filteredColleges.length)}</span> of <span className="font-medium text-slate-900">{filteredColleges.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-[#D4FF00] text-black shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
