import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Target } from 'lucide-react';

export function AdmissionTab({ college }: { college: any }) {
  const cutoffs = college.cutoffs || [];
  const admissions = college.admissions || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Admissions Info */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-50 bg-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-indigo-500" /> Admission Process
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {admissions.length > 0 ? (
            <div className="space-y-6">
              {admissions.map((adm: any) => (
                <div key={adm.id} className="prose prose-slate max-w-none text-slate-600">
                  {/* Admission Process / Description */}
                  {adm.process ? (
                    <p className="whitespace-pre-wrap">{adm.process}</p>
                  ) : (
                    <p>Admission details are being updated.</p>
                  )}
                  
                  {/* If there are dates */}
                  {(adm.application_start_date || adm.application_end_date) && (
                    <div className="mt-4 bg-slate-50 p-4 rounded-xl inline-block border border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">Important Dates:</p>
                      <ul className="mt-2 text-sm text-slate-600 space-y-1">
                        {adm.application_start_date && <li>Start Date: {new Date(adm.application_start_date).toLocaleDateString()}</li>}
                        {adm.application_end_date && <li>End Date: {new Date(adm.application_end_date).toLocaleDateString()}</li>}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
             <p className="text-slate-500 italic text-center py-8">Admission process information is currently unavailable.</p>
          )}
        </CardContent>
      </Card>

      {/* Cutoffs */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-50 bg-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" /> Cut-offs & Entrance Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {cutoffs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Exam</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Cut-off Rank / Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cutoffs.map((cutoff: any) => (
                    <tr key={cutoff.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {cutoff.courses?.name || 'All Courses'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-white">{cutoff.exam_name}</Badge>
                        <span className="text-xs text-slate-400 ml-2">({cutoff.year})</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {cutoff.category || 'General'}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-indigo-600">
                        {cutoff.closing_rank ? `#${cutoff.closing_rank}` : (cutoff.cutoff_score || 'N/A')}
                        {cutoff.opening_rank && cutoff.closing_rank && (
                          <span className="block text-xs font-normal text-slate-500 mt-1">
                            Opens at #{cutoff.opening_rank}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Target className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900 mb-1">No cut-off data available</p>
              <p>Previous year cut-offs will be updated soon.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
