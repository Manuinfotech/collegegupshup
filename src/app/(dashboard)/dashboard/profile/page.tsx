import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Building2, Save, MapPin, Globe, Mail, Phone, Camera, CheckCircle2, Plus } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'College Profile' };

export default async function CollegeProfilePage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase
    .from('college_users')
    .select('college_id')
    .eq('user_id', user.id)
    .single();

  const collegeId = collegeUser?.college_id;
  let profile: any = null;

  if (collegeId) {
    const { data } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', collegeId)
      .single();
    profile = data;
  }

  if (!profile) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">College Profile</h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-8 rounded-2xl flex flex-col items-center text-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900">No College Linked</h3>
            <p className="text-sm mt-2 text-slate-600 max-w-md">
              You haven&apos;t added your college yet. Create your college profile to start managing courses, fees, placements, and more.
            </p>
          </div>
          <a
            href="/dashboard/college/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 active:scale-[0.98] mt-2"
          >
            <Plus className="h-5 w-5" />
            Add Your College
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">College Profile</h1>
          <p className="text-slate-500 mt-1">Manage your institution&apos;s public details and branding.</p>
        </div>
        <div className="flex items-center gap-3">
          {profile.is_verified && (
            <span className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Verified Profile
            </span>
          )}
          <Link href="/dashboard/college/edit" className={buttonVariants({ variant: 'default', className: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm shadow-indigo-200" })}>
            Edit Full Profile
          </Link>
        </div>
      </div>

      <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        </div>
        <CardContent className="p-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-8">
            <div className="h-24 w-24 rounded-2xl bg-white p-2 shadow-lg shadow-slate-200 flex items-center justify-center shrink-0 border border-slate-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center group-hover:bg-slate-100 transition-colors">
                <Camera className="h-8 w-8 text-slate-300 mb-1" />
                <span className="text-[10px] font-medium text-slate-400">Add Logo</span>
              </div>
            </div>
            <div className="pb-2">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{profile.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                {profile.city_name && profile.state_name && (
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {profile.city_name}, {profile.state_name}</span>
                )}
                {profile.ownership_type && (
                  <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {profile.ownership_type}</span>
                )}
                {profile.established_year && (
                  <span className="flex items-center gap-1.5">Est. {profile.established_year}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">About Institution</h3>
                <p className="text-slate-600 leading-relaxed">
                  {profile.description || profile.short_description || "No description provided yet. Add a description to help students understand what makes your institution unique."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm font-medium text-slate-500 mb-1">Campus Area</p>
                  <p className="font-semibold text-slate-900">{profile.campus_area || 'Not specified'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm font-medium text-slate-500 mb-1">Accreditation</p>
                  <p className="font-semibold text-slate-900">{profile.accreditation || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Contact Details</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-600">
                    <Mail className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="break-all">{profile.email || 'No email added'}</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <Phone className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{profile.phone || 'No phone added'}</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <Globe className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="break-all">{profile.website || 'No website added'}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-bold text-indigo-900 mb-2">Complete Your Profile</h4>
                  <p className="text-sm text-indigo-700/80 mb-4">
                    A fully completed profile gets up to 3x more views and student inquiries.
                  </p>
                  <a href="/dashboard/college/edit" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                    Edit All Details &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
