import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Users, UserCircle2 } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Faculty Management' };

export default async function CollegeFacultyPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase
    .from('college_users')
    .select('college_id')
    .eq('user_id', user.id)
    .single();

  const collegeId = collegeUser?.college_id;
  let faculty: any[] = [];

  if (collegeId) {
    const { data } = await supabase
      .from('faculty')
      .select('*')
      .eq('college_id', collegeId)
      .order('created_at', { ascending: false });
    if (data) faculty = data;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Members</h1>
          <p className="text-slate-500 mt-1">Manage profiles for your teaching staff.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200" disabled={!collegeId}>
          <Plus className="h-4 w-4 mr-2" />
          Add Faculty
        </Button>
      </div>

      {!collegeId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center gap-3">
          <Users className="h-5 w-5" />
          <span>You must be linked to a college to manage faculty.</span>
        </div>
      )}

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search faculty by name or department..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" disabled={!collegeId} />
            </div>
          </div>
        </CardContent>
      </Card>

      {faculty.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((f) => (
            <Card key={f.id} className="border-0 shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
                  {f.profile_image_url ? (
                    <img src={f.profile_image_url} alt={f.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle2 className="h-12 w-12 text-slate-400" />
                  )}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{f.name}</h3>
                <p className="text-sm font-medium text-indigo-600 mb-3">{f.designation || 'Faculty'}</p>
                
                <div className="w-full space-y-2 mt-2 pt-4 border-t border-slate-100 text-sm text-slate-600 text-left">
                  <p><strong>Department:</strong> {f.department || 'General'}</p>
                  {f.experience_years && <p><strong>Experience:</strong> {f.experience_years} years</p>}
                  {f.qualification && <p className="truncate"><strong>Degree:</strong> {f.qualification}</p>}
                </div>
                
                <Button variant="outline" className="w-full mt-6 bg-white border-slate-200 hover:bg-slate-50 hover:text-indigo-600">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm shadow-slate-200/50">
          <CardContent className="p-12 text-center text-slate-500">
            <UserCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No faculty members</h3>
            <p className="mb-6">You haven&apos;t added any teaching staff yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
