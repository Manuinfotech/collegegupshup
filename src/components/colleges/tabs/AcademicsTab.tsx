import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar } from 'lucide-react';

export function AcademicsTab({ college }: { college: any }) {
  const totalCourses = college.courses?.length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Courses Section */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-50 bg-white flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" /> Programs & Courses
          </CardTitle>
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-semibold">{totalCourses} Courses</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {college.courses?.length > 0 ? (
              college.courses.map((course: any) => (
                <div key={course.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{course.name}</h3>
                      {course.department && (
                        <p className="text-sm text-slate-500 font-medium mt-1">{course.department}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {course.level && (
                          <Badge variant="outline" className="text-slate-600 font-medium">{course.level}</Badge>
                        )}
                        {course.duration && (
                          <span className="flex items-center text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                            <Calendar className="h-4 w-4 mr-1.5" /> {course.duration}
                          </span>
                        )}
                      </div>
                      {/* Course specific eligibility if we had it in course, otherwise general */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500">
                <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900 mb-1">No courses data available</p>
                <p>Course details will be updated soon.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Faculty Section */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-50 bg-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" /> Faculty
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {college.faculty?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {college.faculty.map((member: any) => (
                <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{member.name}</h4>
                    <p className="text-sm text-slate-500">{member.designation} {member.department ? `• ${member.department}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic text-center py-8">Faculty details are not available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
