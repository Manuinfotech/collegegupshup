'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Upload, Download, Search, Building2, UserPlus, X, CheckCircle2, AlertTriangle,
  FileSpreadsheet, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, Eye, Pencil, Ban, Users, Trash2, Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import {
  bulkUploadColleges,
  assignCollegesToUser,
  searchCollegeUsers,
  getCollegeAssignments,
  unassignCollegeFromUser,
  toggleCollegeStatus,
  toggleCollegeFeatured,
  deleteCollege,
  deleteColleges,
  type CsvCollegeRow,
} from '@/lib/actions/admin-colleges';

// =============================================
// CSV PARSER (client-side)
// =============================================

function parseCsv(text: string): CsvCollegeRow[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCsvLine(lines[0]);

  // Parse rows
  const rows: CsvCollegeRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = (values[idx] || '').trim();
    });
    rows.push(row as CsvCollegeRow);
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// =============================================
// TYPES
// =============================================

interface College {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
  is_active: boolean;
  is_featured: boolean;
  ownership_type: string | null;
  cities: { name: string } | null;
}

interface CollegeUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

// =============================================
// MAIN COMPONENT
// =============================================

export function AdminCollegesClient({ initialColleges, userRole }: { initialColleges: College[], userRole?: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<'name' | 'created_at'>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  
  // ---- Selection State ----
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);

  // ---- Bulk Upload State ----
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadParsed, setUploadParsed] = useState<CsvCollegeRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ inserted: number; errors: { row: number; message: string }[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ---- Assign Dialog State ----
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignCollegeId, setAssignCollegeId] = useState<string | null>(null);
  const [assignCollegeName, setAssignCollegeName] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchedUsers, setSearchedUsers] = useState<CollegeUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<{ id: string; user_id: string; role: string; users: { id: string; email: string; full_name: string } | null }[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);

  // Alert Dialog State
  const [alertConfig, setAlertConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // =============================================
  // FILTERING / SORTING / PAGINATION
  // =============================================

  const filtered = initialColleges.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'name') {
      return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortDir === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: 'name' | 'created_at') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setCurrentPage(1);
  };

  // =============================================
  // BULK UPLOAD HANDLERS
  // =============================================

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    setUploadResult(null);

    const text = await file.text();
    const rows = parseCsv(text);
    setUploadParsed(rows);
  };

  const handleBulkUpload = async () => {
    if (uploadParsed.length === 0) return;
    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await bulkUploadColleges(uploadParsed);
      setUploadResult({ inserted: result.inserted, errors: result.errors });

      if (result.inserted > 0) {
        toast.success(`${result.inserted} college(s) uploaded successfully`);
        router.refresh();
      }
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} row(s) had errors`);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadDialog = () => {
    setUploadFile(null);
    setUploadParsed([]);
    setUploadResult(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  // =============================================
  // ASSIGN COLLEGE HANDLERS
  // =============================================

  const openAssignDialog = async (collegeId: string, collegeName: string) => {
    setAssignCollegeId(collegeId);
    setAssignCollegeName(collegeName);
    setAssignOpen(true);
    setUserSearchQuery('');
    setSearchedUsers([]);
    setSelectedUserId('');
    setUserIdInput('');

    // Load existing assignments
    setIsLoadingAssignments(true);
    try {
      const assignments = await getCollegeAssignments(collegeId);
      setAssignedUsers(assignments as typeof assignedUsers);
    } catch {
      setAssignedUsers([]);
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!userSearchQuery.trim()) return;
    setIsSearchingUsers(true);
    try {
      const users = await searchCollegeUsers(userSearchQuery);
      setSearchedUsers(users);
    } catch {
      setSearchedUsers([]);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  const handleAssignUser = async () => {
    const targetUserId = userIdInput.trim() || selectedUserId;
    if (!targetUserId || !assignCollegeId) return;

    setIsAssigning(true);
    try {
      const result = await assignCollegesToUser(targetUserId, [assignCollegeId], 'admin');
      if (result.success) {
        if (result.assigned && result.assigned > 0) {
          toast.success('College assigned successfully');
        } else {
          toast.info('College was already assigned to this user');
        }
        // Refresh assignments list
        const assignments = await getCollegeAssignments(assignCollegeId);
        setAssignedUsers(assignments as typeof assignedUsers);
        setUserIdInput('');
        setSelectedUserId('');
        router.refresh();
      } else {
        toast.error(result.error || 'Assignment failed');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Assignment failed');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignUser = async (userId: string) => {
    if (!assignCollegeId) return;

    setAlertConfig({
      open: true,
      title: 'Remove User',
      description: 'Are you sure you want to remove this user from the college? They will lose access to manage it.',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          const result = await unassignCollegeFromUser(userId, assignCollegeId);
          if (result.success) {
            toast.success('User removed');
            const assignments = await getCollegeAssignments(assignCollegeId);
            setAssignedUsers(assignments as typeof assignedUsers);
            router.refresh();
          } else {
            toast.error(result.error || 'Failed to remove');
          }
        } catch {
          toast.error('Failed to remove user');
        }
      }
    });
  };

  const handleToggleStatus = async (collegeId: string, currentIsActive: boolean) => {
    const action = currentIsActive ? 'disable' : 'enable';
    
    setAlertConfig({
      open: true,
      title: `${currentIsActive ? 'Disable' : 'Enable'} College`,
      description: currentIsActive 
        ? 'Are you sure you want to disable this college? It will be hidden from the public website.'
        : 'Are you sure you want to enable this college? It will become visible on the public website.',
      variant: currentIsActive ? 'destructive' : 'default',
      onConfirm: async () => {
        try {
          const result = await toggleCollegeStatus(collegeId, !currentIsActive);
          if (result.success) {
            toast.success(`College ${action}d successfully`);
            router.refresh();
          } else {
            toast.error(result.error || `Failed to ${action} college`);
          }
        } catch {
          toast.error(`Failed to ${action} college`);
        }
      }
    });
  };

  const handleToggleFeatured = async (collegeId: string, currentIsFeatured: boolean) => {
    const action = currentIsFeatured ? 'removed from top colleges' : 'marked as top college';
    
    setAlertConfig({
      open: true,
      title: `${currentIsFeatured ? 'Remove from' : 'Add to'} Top Colleges`,
      description: currentIsFeatured 
        ? 'Are you sure you want to remove this college from the Top Colleges section on the homepage?'
        : 'Are you sure you want to mark this as a Top College? It will be featured on the homepage.',
      variant: currentIsFeatured ? 'destructive' : 'default',
      onConfirm: async () => {
        try {
          const result = await toggleCollegeFeatured(collegeId, !currentIsFeatured);
          if (result.success) {
            toast.success(`College ${action}`);
            router.refresh();
          } else {
            toast.error(result.error || `Failed to modify college`);
          }
        } catch {
          toast.error(`Failed to modify college`);
        }
      }
    });
  };

  const handleDeleteCollege = (collegeId: string) => {
    setAlertConfig({
      open: true,
      title: 'Delete College?',
      description: 'This is a permanent action and cannot be undone. It will remove all associated data including courses, fees, and placements.',
      variant: 'destructive',
      onConfirm: async () => {
        const loadingToast = toast.loading('Deleting college...');
        try {
          const res = await deleteCollege(collegeId);
          if (res.success) {
            toast.success('College deleted successfully', { id: loadingToast });
            router.refresh();
          } else {
            toast.error(res.error || 'Failed to delete college', { id: loadingToast });
          }
        } catch (error) {
          toast.error('Network error', { id: loadingToast });
        }
        setAlertConfig(prev => ({ ...prev, open: false }));
      }
    });
  };

  // =============================================
  // BULK DELETE
  // =============================================
  
  const handleBulkDelete = () => {
    if (selectedColleges.length === 0) return;
    setAlertConfig({
      open: true,
      title: `Delete ${selectedColleges.length} Colleges?`,
      description: `This is a permanent action and cannot be undone. It will remove all associated data for the selected colleges.`,
      variant: 'destructive',
      onConfirm: async () => {
        const loadingToast = toast.loading(`Deleting ${selectedColleges.length} colleges...`);
        try {
          const res = await deleteColleges(selectedColleges);
          if (res.success) {
            toast.success('Colleges deleted successfully', { id: loadingToast });
            setSelectedColleges([]);
            router.refresh();
          } else {
            toast.error(res.error || 'Failed to delete colleges', { id: loadingToast });
          }
        } catch (error) {
          toast.error('Network error', { id: loadingToast });
        }
        setAlertConfig(prev => ({ ...prev, open: false }));
      }
    });
  };

  // =============================================
  // STATUS BADGE HELPER
  // =============================================

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending_review': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'approved': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Colleges</h1>
          <p className="text-slate-500 mt-1">Manage all registered colleges on the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Download Template */}
          <a href="/api/admin/csv-template" download="college-upload-template.csv">
            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4 mr-2" />
              CSV Template
            </Button>
          </a>

          {/* Bulk Upload Dialog */}
          <Dialog open={uploadOpen} onOpenChange={(open) => { setUploadOpen(open); if (!open) resetUploadDialog(); }}>
            <DialogTrigger render={
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
            } />
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Bulk Upload Colleges</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with college data. Download the template first to see the required format.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Instructions */}
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800 space-y-1.5">
                  <p className="font-semibold flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" /> CSV Format Guide</p>
                  <ul className="list-disc ml-4 space-y-0.5 text-blue-700">
                    <li><strong>name</strong> is required</li>
                    <li><strong>city_name</strong> & <strong>state_name</strong> must match existing entries</li>
                    <li><strong>ownership_type</strong>: government, private, deemed, autonomous</li>
                    <li><strong>facilities / courses</strong>: pipe-separated (e.g. WiFi|Library or MBA|PGDM|MCA)</li>
                    <li><strong>logo_image / cover_image</strong>: just filename (e.g. college-logo.webp)</li>
                    <li>Booleans: true/false or yes/no or 1/0</li>
                  </ul>
                </div>

                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Select CSV File</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>

                {/* Preview */}
                {uploadParsed.length > 0 && !uploadResult && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-900">
                      <CheckCircle2 className="h-4 w-4 inline mr-1.5 text-emerald-500" />
                      {uploadParsed.length} row(s) parsed from <span className="text-indigo-600">{uploadFile?.name}</span>
                    </p>
                    <div className="mt-2 max-h-32 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-slate-500">
                            <th className="text-left py-1 pr-3">#</th>
                            <th className="text-left py-1 pr-3">Name</th>
                            <th className="text-left py-1 pr-3">City</th>
                            <th className="text-left py-1">State</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadParsed.slice(0, 5).map((row, i) => (
                            <tr key={i} className="text-slate-700">
                              <td className="py-0.5 pr-3">{i + 1}</td>
                              <td className="py-0.5 pr-3 font-medium">{row.name}</td>
                              <td className="py-0.5 pr-3">{row.city_name || '-'}</td>
                              <td className="py-0.5">{row.state_name || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {uploadParsed.length > 5 && (
                        <p className="text-xs text-slate-400 mt-1">...and {uploadParsed.length - 5} more</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Upload Result */}
                {uploadResult && (
                  <div className="space-y-3">
                    {uploadResult.inserted > 0 && (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-sm text-emerald-800">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        <span><strong>{uploadResult.inserted}</strong> college(s) uploaded successfully!</span>
                      </div>
                    )}
                    {uploadResult.errors.length > 0 && (
                      <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                          <strong>{uploadResult.errors.length} error(s)</strong>
                        </div>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {uploadResult.errors.map((err, i) => (
                            <p key={i} className="text-xs">Row {err.row}: {err.message}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                {!uploadResult ? (
                  <Button
                    onClick={handleBulkUpload}
                    disabled={uploadParsed.length === 0 || isUploading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isUploading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="h-4 w-4 mr-2" /> Upload {uploadParsed.length} College(s)</>
                    )}
                  </Button>
                ) : (
                  <Button onClick={() => { setUploadOpen(false); resetUploadDialog(); }} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Done
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ---- Filters ---- */}
      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search colleges..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9 border-slate-200 focus-visible:ring-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="pending_review">Pending Review</option>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            {selectedColleges.length > 0 && userRole === 'super_admin' && (
              <Button 
                variant="destructive" 
                onClick={handleBulkDelete}
                className="whitespace-nowrap"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedColleges.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ---- Table ---- */}
      <Card className="border-0 shadow-sm shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {userRole === 'super_admin' && (
                    <th className="p-4 w-12">
                      <Checkbox 
                        checked={paginated.length > 0 && selectedColleges.length === paginated.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedColleges(paginated.map(c => c.id));
                          } else {
                            setSelectedColleges([]);
                          }
                        }}
                        aria-label="Select all"
                      />
                    </th>
                  )}
                  <th className="p-4 font-medium text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1.5">College <ArrowUpDown className="h-3.5 w-3.5" /></div>
                  </th>
                  <th className="p-4 font-medium text-slate-500">City</th>
                  <th className="p-4 font-medium text-slate-500">Status</th>
                  <th className="p-4 font-medium text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center gap-1.5">Added <ArrowUpDown className="h-3.5 w-3.5" /></div>
                  </th>
                  <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.length > 0 ? (
                  paginated.map((college) => (
                    <tr key={college.id} className="hover:bg-slate-50/50 transition-colors group">
                      {userRole === 'super_admin' && (
                        <td className="p-4">
                          <Checkbox 
                            checked={selectedColleges.includes(college.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedColleges(prev => [...prev, college.id]);
                              } else {
                                setSelectedColleges(prev => prev.filter(id => id !== college.id));
                              }
                            }}
                            aria-label={`Select ${college.name}`}
                          />
                        </td>
                      )}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors block">
                              {college.name}
                            </span>
                            {college.ownership_type && (
                              <span className="text-xs text-slate-400 capitalize">{college.ownership_type}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {/* @ts-ignore */}
                        {college.cities?.name || '—'}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={statusBadgeClass(college.status)}>
                          {college.status?.replace('_', ' ') || 'draft'}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-500">
                        {formatDistanceToNow(new Date(college.created_at), { addSuffix: true })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                            title="Assign to User"
                            onClick={() => openAssignDialog(college.id, college.name)}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-indigo-600" 
                            title="View on Website"
                            onClick={() => window.open(`/colleges/${college.slug}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-blue-600" 
                            title="Edit"
                            onClick={() => router.push(`/admin/colleges/edit?id=${college.id}&tab=overview`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 ${college.is_active ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                            title={college.is_active ? "Disable" : "Enable"}
                            onClick={() => handleToggleStatus(college.id, college.is_active)}
                          >
                            {college.is_active ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 ${college.is_featured ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
                            title={college.is_featured ? "Remove from Top Colleges" : "Mark as Top College"}
                            onClick={() => handleToggleFeatured(college.id, college.is_featured)}
                          >
                            <Star className={`h-4 w-4 ${college.is_featured ? 'fill-amber-500' : ''}`} />
                          </Button>
                          {userRole === 'super_admin' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 ml-1"
                              title="Delete College"
                              onClick={() => handleDeleteCollege(college.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={userRole === 'super_admin' ? 6 : 5} className="p-8 text-center text-slate-500">
                      <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p>No colleges found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 bg-slate-50/80 p-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium text-slate-900">{Math.min(currentPage * pageSize, sorted.length)}</span> of{' '}
                <span className="font-medium text-slate-900">{sorted.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <span className="text-sm text-slate-600 px-2">{currentPage} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---- Assign College to User Dialog ---- */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign College to User</DialogTitle>
            <DialogDescription>
              Assign <strong>{assignCollegeName}</strong> to a college user by their User ID or search by email/name.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Method 1: Direct User ID */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Assign by User ID</label>
              <p className="text-xs text-slate-500 mb-2">Paste the UUID of the college user to assign directly.</p>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. 89f78d24-c448-4d05-a077-18aff8e5e12b"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  className="flex-1 font-mono text-xs"
                />
                <Button
                  onClick={handleAssignUser}
                  disabled={!userIdInput.trim() || isAssigning}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                >
                  {isAssigning ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assign'}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Method 2: Search User */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Search User by Email / Name</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by email or name..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearchUsers}
                  disabled={isSearchingUsers}
                  variant="outline"
                  className="shrink-0"
                >
                  {isSearchingUsers ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {/* Search Results */}
              {searchedUsers.length > 0 && (
                <div className="mt-2 rounded-lg border border-slate-200 divide-y divide-slate-100 max-h-40 overflow-y-auto">
                  {searchedUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setUserIdInput(user.id);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm hover:bg-indigo-50 transition-colors flex items-center justify-between ${
                        selectedUserId === user.id ? 'bg-indigo-50 border-l-2 border-indigo-500' : ''
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-900">{user.full_name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">{user.role}</Badge>
                        <span className="text-[10px] text-slate-400 font-mono">{user.id.slice(0, 8)}...</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currently Assigned Users */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-2">
                <Users className="h-4 w-4" /> Currently Assigned Users
              </label>
              {isLoadingAssignments ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                </div>
              ) : assignedUsers.length === 0 ? (
                <p className="text-sm text-slate-400 py-2">No users assigned to this college yet.</p>
              ) : (
                <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
                  {assignedUsers.map((assignment) => (
                    <div key={assignment.id} className="px-3 py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {/* @ts-ignore */}
                          {assignment.users?.full_name || 'Unknown'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {/* @ts-ignore */}
                          {assignment.users?.email || assignment.user_id}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">{assignment.role}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleUnassignUser(assignment.user_id)}
                          title="Remove"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={alertConfig.open} onOpenChange={(open) => setAlertConfig(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertConfig.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={alertConfig.onConfirm}
              className={alertConfig.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
