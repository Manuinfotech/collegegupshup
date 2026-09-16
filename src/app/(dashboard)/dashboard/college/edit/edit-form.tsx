'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, MapPin, Phone, Mail, Globe, Users,
  Award, GraduationCap, Trophy, Home,
  CheckCircle2, AlertCircle, Save, Plus, Trash2
} from 'lucide-react';
import { updateCollegeSection, upsertAdmission, upsertScholarship, upsertHostelDetail, upsertRanking, deleteRanking, deleteScholarship } from '@/lib/actions/college-admin';
import { uploadLocalFile } from '@/lib/actions/upload';
import { calculateProfileCompletion } from '@/lib/utils/college-completion';
import type { OwnershipType } from '@/types/database';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: MapPin },
  { id: 'approvals', label: 'Approvals', icon: Award },
  { id: 'admissions', label: 'Admissions', icon: GraduationCap },
  { id: 'scholarships', label: 'Scholarships', icon: Trophy },
  { id: 'hostel', label: 'Hostel', icon: Home },
  { id: 'rankings', label: 'Rankings', icon: Trophy },
] as const;

type TabId = (typeof TABS)[number]['id'];

const COMMON_FACILITIES = [
  'Library', 'Hostel', 'Sports Complex', 'Cafeteria', 'Wi-Fi',
  'Computer Lab', 'Auditorium', 'Gymnasium', 'Swimming Pool',
  'Medical Facility', 'Transport', 'Placement Cell', 'ATM',
  'Bank', 'Parking', 'Seminar Hall', 'Research Lab'
];

interface CollegeEditFormProps {
  college: any;
}

export function CollegeEditForm({ college }: CollegeEditFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as typeof TABS[number]['id'] || 'overview';
  
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>(
    TABS.some(t => t.id === initialTab) ? initialTab : 'overview'
  );
  
  // Optional: Update state if query param changes while component is mounted
  useEffect(() => {
    const tab = searchParams.get('tab') as typeof TABS[number]['id'];
    if (tab && TABS.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(college.facilities || []);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  // ======= OVERVIEW TAB =======
  async function saveOverview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      let logoUrl = college.logo_url;
      const logoFile = fd.get('logo_file') as File;
      if (logoFile && logoFile.size > 0) {
        const uploadFd = new FormData();
        uploadFd.append('file', logoFile);
        uploadFd.append('folder', 'logos');
        const res = await uploadLocalFile(uploadFd);
        if (res.success && res.url) logoUrl = res.url;
      }

      let coverUrl = college.cover_image_url;
      const coverFile = fd.get('cover_file') as File;
      if (coverFile && coverFile.size > 0) {
        const uploadFd = new FormData();
        uploadFd.append('file', coverFile);
        uploadFd.append('folder', 'banners');
        const res = await uploadLocalFile(uploadFd);
        if (res.success && res.url) coverUrl = res.url;
      }

      const result = await updateCollegeSection(college.id, 'overview', {
        name: (fd.get('name') as string) || undefined,
        logo_url: logoUrl,
        cover_image_url: coverUrl,
        short_description: (fd.get('short_description') as string) || null,
        description: (fd.get('description') as string) || null,
        established_year: fd.get('established_year') ? Number(fd.get('established_year')) : null,
        ownership_type: (fd.get('ownership_type') as OwnershipType) || null,
        university: (fd.get('university') as string) || null,
        campus_area: (fd.get('campus_area') as string) || null,
        facilities: selectedFacilities,
      });
      showToast(result.success ? 'success' : 'error', result.success ? 'Overview updated!' : result.error || 'Failed');
      if (result.success) {
        router.refresh();
        setActiveTab('contact');
      }
    });
  }

  // ======= CONTACT TAB =======
  async function saveContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateCollegeSection(college.id, 'contact', {
        email: (fd.get('email') as string) || null,
        phone: (fd.get('phone') as string) || null,
        website: (fd.get('website') as string) || null,
        address: (fd.get('address') as string) || null,
        pincode: (fd.get('pincode') as string) || null,
      });
      showToast(result.success ? 'success' : 'error', result.success ? 'Contact details updated!' : result.error || 'Failed');
      if (result.success) {
        router.refresh();
        setActiveTab('approvals');
      }
    });
  }

  // ======= APPROVALS TAB =======
  async function saveApprovals(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateCollegeSection(college.id, 'approvals', {
        accreditation: (fd.get('accreditation') as string) || null,
        affiliation: (fd.get('affiliation') as string) || null,
      });
      showToast(result.success ? 'success' : 'error', result.success ? 'Approvals updated!' : result.error || 'Failed');
      if (result.success) {
        router.refresh();
        setActiveTab('admissions');
      }
    });
  }

  // ======= ADMISSIONS TAB =======
  async function saveAdmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const admissionId = fd.get('admission_id') as string;
      const result = await upsertAdmission(college.id, {
        id: admissionId || undefined,
        process: fd.get('process') as string || undefined,
        eligibility: fd.get('eligibility') as string || undefined,
        application_start_date: fd.get('application_start_date') as string || undefined,
        application_end_date: fd.get('application_end_date') as string || undefined,
        entrance_exams: (fd.get('entrance_exams') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        counseling_process: fd.get('counseling_process') as string || undefined,
        documents_required: (fd.get('documents_required') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        selection_criteria: fd.get('selection_criteria') as string || undefined,
        year: fd.get('year') ? Number(fd.get('year')) : undefined,
      });
      showToast(result.success ? 'success' : 'error', result.success ? 'Admission info saved!' : result.error || 'Failed');
      if (result.success) {
        router.refresh();
        setActiveTab('scholarships');
      }
    });
  }

  // ======= SCHOLARSHIPS TAB =======
  async function saveScholarship(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const scholarshipId = fd.get('scholarship_id') as string;
      const result = await upsertScholarship(college.id, {
        id: scholarshipId || undefined,
        name: fd.get('scholarship_name') as string,
        description: fd.get('scholarship_description') as string || undefined,
        amount: fd.get('scholarship_amount') ? Number(fd.get('scholarship_amount')) : undefined,
        eligibility: fd.get('scholarship_eligibility') as string || undefined,
        type: fd.get('scholarship_type') as string || undefined,
        provider: fd.get('scholarship_provider') as string || undefined,
      });
      showToast(result.success ? 'success' : 'error', result.success ? 'Scholarship saved!' : result.error || 'Failed');
      if (result.success) {
        router.refresh();
        form.reset();
      }
    });
  }

  async function handleDeleteScholarship(id: string) {
    startTransition(async () => {
      const result = await deleteScholarship(id);
      showToast(result.success ? 'success' : 'error', result.success ? 'Scholarship deleted!' : result.error || 'Failed');
      if (result.success) router.refresh();
    });
  }

  // ======= HOSTEL TAB =======
  async function saveHostel(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const hostelId = fd.get('hostel_id') as string;
      const result = await upsertHostelDetail(college.id, {
        id: hostelId || undefined,
        type: fd.get('hostel_type') as string,
        capacity: fd.get('hostel_capacity') ? Number(fd.get('hostel_capacity')) : undefined,
        room_types: (fd.get('room_types') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        fees_per_year: fd.get('hostel_fees') ? Number(fd.get('hostel_fees')) : undefined,
        facilities: (fd.get('hostel_facilities') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        mess_menu: fd.get('mess_menu') as string || undefined,
        rules: fd.get('hostel_rules') as string || undefined,
      });
      showToast(result.success ? 'success' : 'error', result.success ? 'Hostel info saved!' : result.error || 'Failed');
      if (result.success) {
        router.refresh();
        form.reset();
      }
    });
  }

  // ======= RANKINGS TAB =======
  async function saveRanking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const rankingId = fd.get('ranking_id') as string;
      const result = await upsertRanking(college.id, {
        id: rankingId || undefined,
        agency: fd.get('ranking_agency') as string,
        rank: Number(fd.get('ranking_rank')),
        year: Number(fd.get('ranking_year')),
        category: fd.get('ranking_category') as string || undefined,
      });
      showToast(result.success ? 'success' : 'error', result.success ? 'Ranking saved!' : result.error || 'Failed');
      if (result.success) {
        router.refresh();
        form.reset();
      }
    });
  }

  async function handleDeleteRanking(id: string) {
    startTransition(async () => {
      const result = await deleteRanking(id);
      showToast(result.success ? 'success' : 'error', result.success ? 'Ranking deleted!' : result.error || 'Failed');
      if (result.success) router.refresh();
    });
  }

  function toggleFacility(f: string) {
    setSelectedFacilities(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  }

  const existingAdmission = college.admissions?.[0];
  const completionPercentage = calculateProfileCompletion(college);

  async function handlePublishToggle() {
    startTransition(async () => {
      const newStatus = college.status === 'published' ? 'draft' : 'published';
      const result = await updateCollegeSection(college.id, 'status', { status: newStatus });
      showToast(
        result.success ? 'success' : 'error', 
        result.success ? `College ${newStatus === 'published' ? 'published' : 'un-published'} successfully!` : result.error || 'Failed'
      );
      if (result.success) router.refresh();
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      {/* Premium Brand Profile Header */}
      <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white relative">
        <CardContent className="p-8 sm:p-10 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo Section */}
            <div className="h-36 w-36 shrink-0 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center shadow-inner border border-amber-200/50 relative group cursor-pointer overflow-hidden transition-transform hover:scale-105">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
              {college.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={college.logo_url} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center p-4 relative z-20">
                  <span className="text-amber-600 font-black text-4xl leading-none drop-shadow-sm block mb-1">
                    {college.name.charAt(0)}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest mt-1">Logo</span>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="flex-1 space-y-5 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{college.name}</h1>
                  </div>
                  <p className="text-[15px] text-slate-500 mt-2 font-medium max-w-2xl leading-relaxed">
                    {college.short_description || "Crafting educational excellence. Add a short description to tell students about your institution."}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={college.status === 'published' ? 'default' : 'secondary'} className={college.status === 'published' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}>
                    {college.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                  <Button 
                    onClick={handlePublishToggle} 
                    disabled={isPending}
                    variant={college.status === 'published' ? 'outline' : 'default'}
                    className={college.status === 'published' ? 'border-slate-200 text-slate-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
                  >
                    {isPending ? 'Updating...' : college.status === 'published' ? 'Unpublish' : 'Publish College'}
                  </Button>
                </div>
              </div>

              {/* Contact Grid */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium pt-2">
                <div className="flex items-center gap-2 hover:text-slate-800 transition-colors cursor-pointer group">
                  <div className="h-8 w-8 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center border border-slate-100 transition-colors">
                    <Mail className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  {college.email || 'Add Email'}
                </div>
                <div className="flex items-center gap-2 hover:text-slate-800 transition-colors cursor-pointer group">
                  <div className="h-8 w-8 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center border border-slate-100 transition-colors">
                    <Phone className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  {college.phone || 'Add Phone'}
                </div>
                <div className="flex items-center gap-2 hover:text-slate-800 transition-colors cursor-pointer group">
                  <div className="h-8 w-8 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center border border-slate-100 transition-colors">
                    <Globe className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  {college.website || 'Add Website'}
                </div>
              </div>

              <div className="h-px w-full bg-slate-100 my-2" />

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium hover:text-slate-800 transition-colors cursor-pointer group">
                  <div className="h-8 w-8 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center border border-slate-100 transition-colors shrink-0">
                    <MapPin className="h-4 w-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                  </div>
                  <span className="truncate max-w-[300px]">{college.address || 'Add Address'}, {college.city_name || 'City'}, {college.pincode || 'Zip'}</span>
              </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Main Content Area with Left Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-200/40 p-4">
            <div className="px-3 pb-4 pt-2 mb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Profile Editor</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shadow-sm">
                {completionPercentage}% Done
              </span>
            </div>
            <nav className="flex flex-col gap-1.5 mt-4">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer group ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className={`h-[18px] w-[18px] transition-colors ${activeTab === tab.id ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="lg:col-span-3">
          <div key={activeTab + '-' + (college.updated_at || '1')} className="animate-in fade-in slide-in-from-right-4 duration-300">
        {/* === OVERVIEW === */}
        {activeTab === 'overview' && (
          <form onSubmit={saveOverview}>
            <Card className="border-0 shadow-sm shadow-slate-200/50">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg">Overview Information</CardTitle>
                <CardDescription>Core details about your institution.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-semibold">College Logo</Label>
                    <div className="flex items-center gap-4">
                      {college.logo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={college.logo_url} alt="Logo" className="w-12 h-12 rounded-xl object-cover bg-slate-100 shadow-sm border border-slate-200" />
                      )}
                      <Input type="file" name="logo_file" accept="image/*" className="h-11 focus-visible:ring-indigo-500 cursor-pointer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Banner Image</Label>
                    <div className="flex items-center gap-4">
                      {college.cover_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={college.cover_image_url} alt="Banner" className="w-24 h-12 rounded-xl object-cover bg-slate-100 shadow-sm border border-slate-200" />
                      )}
                      <Input type="file" name="cover_file" accept="image/*" className="h-11 focus-visible:ring-indigo-500 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">Institution Name</Label>
                  <Input id="name" name="name" defaultValue={college.name} required className="h-11 focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="short_description" className="font-semibold">Short Description</Label>
                  <Input id="short_description" name="short_description" defaultValue={college.short_description || ''} className="h-11 focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-semibold">Full Description</Label>
                  <Textarea id="description" name="description" defaultValue={college.description || ''} className="min-h-[120px] focus-visible:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="established_year" className="font-semibold">Established Year</Label>
                    <Input id="established_year" name="established_year" type="number" defaultValue={college.established_year || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownership_type" className="font-semibold">Ownership</Label>
                    <select id="ownership_type" name="ownership_type" defaultValue={college.ownership_type || ''} className="flex h-11 w-full items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <option value="">Select</option>
                      <option value="government">Government</option>
                      <option value="private">Private</option>
                      <option value="deemed">Deemed</option>
                      <option value="autonomous">Autonomous</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="college_type" className="font-semibold">College Type</Label>
                    <Input id="college_type" name="college_type" defaultValue={college.college_type || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="university" className="font-semibold">University</Label>
                    <Input id="university" name="university" defaultValue={college.university || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campus_area" className="font-semibold">Campus Area</Label>
                    <Input id="campus_area" name="campus_area" defaultValue={college.campus_area || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_students" className="font-semibold">Total Students</Label>
                    <Input id="total_students" name="total_students" type="number" defaultValue={college.total_students || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_faculty" className="font-semibold">Total Faculty</Label>
                  <Input id="total_faculty" name="total_faculty" type="number" defaultValue={college.total_faculty || ''} className="h-11 focus-visible:ring-indigo-500 max-w-xs" />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold">Facilities</Label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_FACILITIES.map(f => (
                      <button key={f} type="button" onClick={() => toggleFacility(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selectedFacilities.includes(f) ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}>
                        {selectedFacilities.includes(f) && '✓ '}{f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                    <Save className="h-4 w-4 mr-2" /> {isPending ? 'Saving...' : 'Save Overview'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        )}

        {/* === CONTACT === */}
        {activeTab === 'contact' && (
          <form onSubmit={saveContact}>
            <Card className="border-0 shadow-sm shadow-slate-200/50">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg">Contact & Location</CardTitle>
                <CardDescription>How students can reach or find your campus.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold"><Mail className="h-4 w-4 text-slate-400" />Email</Label>
                    <Input name="email" type="email" defaultValue={college.email || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold"><Phone className="h-4 w-4 text-slate-400" />Phone</Label>
                    <Input name="phone" defaultValue={college.phone || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold"><Globe className="h-4 w-4 text-slate-400" />Website</Label>
                    <Input name="website" defaultValue={college.website || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4 text-slate-400" />Pincode</Label>
                    <Input name="pincode" defaultValue={college.pincode || ''} maxLength={6} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Full Address</Label>
                  <Textarea name="address" defaultValue={college.address || ''} className="min-h-[80px] focus-visible:ring-indigo-500" />
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                    <Save className="h-4 w-4 mr-2" /> {isPending ? 'Saving...' : 'Save Contact'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        )}

        {/* === APPROVALS === */}
        {activeTab === 'approvals' && (
          <form onSubmit={saveApprovals}>
            <Card className="border-0 shadow-sm shadow-slate-200/50">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg">Approvals & Accreditation</CardTitle>
                <CardDescription>Official recognition and accreditation details.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-semibold">Accreditation</Label>
                    <Input name="accreditation" defaultValue={college.accreditation || ''} placeholder="e.g. NAAC A+" className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">NAAC Grade</Label>
                    <select name="naac_grade" defaultValue={college.naac_grade || ''} className="flex h-11 w-full items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <option value="">Select Grade</option>
                      {['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'Not Accredited'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Approved By</Label>
                    <Input name="approved_by" defaultValue={college.approved_by || ''} placeholder="e.g. AICTE, UGC" className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Affiliation</Label>
                    <Input name="affiliation" defaultValue={college.affiliation || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">NIRF Ranking</Label>
                    <Input name="nirf_ranking" type="number" defaultValue={college.nirf_ranking || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="nba_accredited" value="true" defaultChecked={college.nba_accredited} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
                      <span className="text-sm font-medium text-slate-700">NBA Accredited</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                    <Save className="h-4 w-4 mr-2" /> {isPending ? 'Saving...' : 'Save Approvals'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        )}

        {/* === ADMISSIONS === */}
        {activeTab === 'admissions' && (
          <form onSubmit={saveAdmission}>
            <Card className="border-0 shadow-sm shadow-slate-200/50">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg">Admission Information</CardTitle>
                <CardDescription>Admission process, dates, and requirements.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {existingAdmission && <input type="hidden" name="admission_id" value={existingAdmission.id} />}
                <div className="space-y-2">
                  <Label className="font-semibold">Admission Process</Label>
                  <Textarea name="process" defaultValue={existingAdmission?.process || ''} placeholder="Step-by-step admission process..." className="min-h-[100px] focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Eligibility Criteria</Label>
                  <Textarea name="eligibility" defaultValue={existingAdmission?.eligibility || ''} placeholder="Minimum eligibility requirements..." className="min-h-[80px] focus-visible:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="font-semibold">Application Start Date</Label>
                    <Input name="application_start_date" type="date" defaultValue={existingAdmission?.application_start_date || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Application End Date</Label>
                    <Input name="application_end_date" type="date" defaultValue={existingAdmission?.application_end_date || ''} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Year</Label>
                    <Input name="year" type="number" defaultValue={existingAdmission?.year || new Date().getFullYear()} className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Entrance Exams (comma separated)</Label>
                  <Input name="entrance_exams" defaultValue={existingAdmission?.entrance_exams?.join(', ') || ''} placeholder="JEE Main, CAT, NEET" className="h-11 focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Documents Required (comma separated)</Label>
                  <Input name="documents_required" defaultValue={existingAdmission?.documents_required?.join(', ') || ''} placeholder="10th Marksheet, 12th Marksheet, Aadhar Card" className="h-11 focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Counseling Process</Label>
                  <Textarea name="counseling_process" defaultValue={existingAdmission?.counseling_process || ''} className="min-h-[80px] focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Selection Criteria</Label>
                  <Textarea name="selection_criteria" defaultValue={existingAdmission?.selection_criteria || ''} className="min-h-[80px] focus-visible:ring-indigo-500" />
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                    <Save className="h-4 w-4 mr-2" /> {isPending ? 'Saving...' : 'Save Admission Info'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        )}

        {/* === SCHOLARSHIPS === */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            {/* Existing scholarships */}
            {college.scholarships?.length > 0 && (
              <Card className="border-0 shadow-sm shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg">Existing Scholarships</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {college.scholarships.map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-900">{s.name}</p>
                          <p className="text-sm text-slate-500">{s.type} · {s.provider || 'College'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {s.amount && <span className="font-semibold text-emerald-600">₹{Number(s.amount).toLocaleString('en-IN')}</span>}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDeleteScholarship(s.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add new scholarship */}
            <form onSubmit={saveScholarship}>
              <Card className="border-0 shadow-sm shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5" /> Add Scholarship</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-semibold">Scholarship Name</Label>
                      <Input name="scholarship_name" required placeholder="e.g. Merit Scholarship" className="h-11 focus-visible:ring-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Type</Label>
                      <select name="scholarship_type" className="flex h-11 w-full items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <option value="merit">Merit</option>
                        <option value="need_based">Need Based</option>
                        <option value="sports">Sports</option>
                        <option value="minority">Minority</option>
                        <option value="government">Government</option>
                        <option value="private">Private</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-semibold">Amount (₹)</Label>
                      <Input name="scholarship_amount" type="number" placeholder="50000" className="h-11 focus-visible:ring-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Provider</Label>
                      <Input name="scholarship_provider" placeholder="e.g. College / Govt of India" className="h-11 focus-visible:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Eligibility</Label>
                    <Textarea name="scholarship_eligibility" placeholder="Who is eligible for this scholarship..." className="min-h-[80px] focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Description</Label>
                    <Textarea name="scholarship_description" placeholder="Details about the scholarship..." className="min-h-[80px] focus-visible:ring-indigo-500" />
                  </div>
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                      <Plus className="h-4 w-4 mr-2" /> {isPending ? 'Adding...' : 'Add Scholarship'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        )}

        {/* === HOSTEL === */}
        {activeTab === 'hostel' && (
          <div className="space-y-6">
            {/* Existing hostel entries */}
            {college.hostel_details?.length > 0 && (
              <Card className="border-0 shadow-sm shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg">Existing Hostel Details</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {college.hostel_details.map((h: any) => (
                      <div key={h.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900 capitalize">{h.type?.replace('_', ' ')} Hostel</p>
                            <p className="text-sm text-slate-500">Capacity: {h.capacity || 'N/A'} · Fee: ₹{Number(h.fees_per_year || 0).toLocaleString('en-IN')}/year</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <form onSubmit={saveHostel}>
              <Card className="border-0 shadow-sm shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5" /> Add Hostel</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="font-semibold">Hostel Type</Label>
                      <select name="hostel_type" required className="flex h-11 w-full items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <option value="boys">Boys</option>
                        <option value="girls">Girls</option>
                        <option value="co_ed">Co-Ed</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Capacity</Label>
                      <Input name="hostel_capacity" type="number" placeholder="500" className="h-11 focus-visible:ring-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Fees per Year (₹)</Label>
                      <Input name="hostel_fees" type="number" placeholder="80000" className="h-11 focus-visible:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Room Types (comma separated)</Label>
                    <Input name="room_types" placeholder="Single, Double, Triple" className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Facilities (comma separated)</Label>
                    <Input name="hostel_facilities" placeholder="Wi-Fi, AC, Mess, Laundry, Gym" className="h-11 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Mess Menu</Label>
                    <Textarea name="mess_menu" placeholder="Describe the mess menu..." className="min-h-[80px] focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Hostel Rules</Label>
                    <Textarea name="hostel_rules" placeholder="Key hostel rules..." className="min-h-[80px] focus-visible:ring-indigo-500" />
                  </div>
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                      <Plus className="h-4 w-4 mr-2" /> {isPending ? 'Adding...' : 'Add Hostel'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        )}

        {/* === RANKINGS === */}
        {activeTab === 'rankings' && (
          <div className="space-y-6">
            {college.rankings?.length > 0 && (
              <Card className="border-0 shadow-sm shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg">Existing Rankings</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {college.rankings.map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-900">{r.agency}</p>
                          <p className="text-sm text-slate-500">{r.category || 'Overall'} · {r.year}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-indigo-600">#{r.rank}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDeleteRanking(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <form onSubmit={saveRanking}>
              <Card className="border-0 shadow-sm shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5" /> Add Ranking</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-semibold">Ranking Agency</Label>
                      <Input name="ranking_agency" required placeholder="e.g. NIRF, Times, QS" className="h-11 focus-visible:ring-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Category</Label>
                      <Input name="ranking_category" placeholder="e.g. Engineering, Overall" className="h-11 focus-visible:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-semibold">Rank</Label>
                      <Input name="ranking_rank" type="number" required placeholder="1" className="h-11 focus-visible:ring-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Year</Label>
                      <Input name="ranking_year" type="number" required defaultValue={new Date().getFullYear()} className="h-11 focus-visible:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                      <Plus className="h-4 w-4 mr-2" /> {isPending ? 'Adding...' : 'Add Ranking'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
