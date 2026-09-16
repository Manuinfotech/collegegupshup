import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, BookOpen, Clock, Wallet, GraduationCap, CheckCircle2, XCircle } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Courses Management' };

export default async function CollegeCoursesPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase
    .from('college_users')
    .select('college_id')
    .eq('user_id', user.id)
    .single();

  const collegeId = collegeUser?.college_id;
  let courses: any[] = [];

  if (collegeId) {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('college_id', collegeId)
      .order('created_at', { ascending: false });
    if (data) courses = data;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Courses</h1>
          <p className="text-slate-500 mt-1">Manage all academic programs offered by your institution.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200" disabled={!collegeId}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {!collegeId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center gap-3">
          <BookOpen className="h-5 w-5" />
          <span>You must be linked to a college to manage courses.</span>
        </div>
      )}

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search courses by name..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" disabled={!collegeId} />
            </div>
            <select className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 transition-all" disabled={!collegeId}>
              <option value="">All Degrees</option>
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
              <option value="Diploma">Diploma</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-0 shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-indigo-600" />
                  </div>
                  <Badge variant="outline" className={`
                    ${course.is_active !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'}
                  `}>
                    {course.is_active !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{course.name}</h3>
                <p className="text-sm font-medium text-slate-500 mb-4">{course.degree_type || 'Degree Program'}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="h-4 w-4 mr-3 text-slate-400" />
                    {course.duration || `${course.duration_years} Years`}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Wallet className="h-4 w-4 mr-3 text-slate-400" />
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(course.fees_min || 0)} 
                    {course.fees_max ? ` - ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(course.fees_max)}` : ''}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="h-4 w-4 mr-3 text-slate-400" />
                    {course.intake_capacity ? `${course.intake_capacity} Seats` : 'Intake not specified'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-white border-slate-200 hover:bg-slate-50 hover:text-indigo-600">Edit</Button>
                  <Button variant="outline" className="flex-1 bg-white border-slate-200 hover:bg-slate-50">Manage Specs</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm shadow-slate-200/50">
          <CardContent className="p-12 text-center text-slate-500">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No courses available</h3>
            <p className="mb-6">You haven&apos;t added any courses or programs for your college yet.</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200" disabled={!collegeId}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
