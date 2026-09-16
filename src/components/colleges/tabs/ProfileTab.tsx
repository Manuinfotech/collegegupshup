import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Image as ImageIcon } from 'lucide-react';

export function ProfileTab({ college }: { college: any }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-50 bg-white">
          <CardTitle className="text-xl">About {college.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
            {college.description ? (
              <p>{college.description}</p>
            ) : (
              <p>Detailed description is not available for this institution yet.</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Campus Area</p>
              <p className="font-bold text-slate-900 text-lg">{college.campus_area || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Established</p>
              <p className="font-bold text-slate-900 text-lg">{college.established_year || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Ownership</p>
              <p className="font-bold text-slate-900 text-lg truncate" title={college.ownership_type || 'General'}>{college.ownership_type || 'General'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Affiliation</p>
              <p className="font-bold text-slate-900 text-lg truncate" title={college.affiliation || 'N/A'}>{college.affiliation || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Rankings (Highlight) */}
        {college.rankings?.length > 0 && (
          <Card className="border-0 shadow-sm ring-1 ring-slate-100 bg-gradient-to-br from-amber-50/50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-amber-900"><Trophy className="h-5 w-5 text-amber-500" /> Top Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {college.rankings.slice(0, 3).map((r: any) => (
                  <li key={r.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{r.agency} {r.category && `(${r.category})`}</span>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">#{r.rank} in {r.year}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Accreditations */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-100 bg-gradient-to-br from-blue-50/50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-blue-900"><Award className="h-5 w-5 text-blue-500" /> Accreditations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {college.accreditation ? (
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Accreditation</span>
                  <span className="text-sm font-bold text-slate-900">{college.accreditation}</span>
                </li>
              ) : (
                <li className="text-sm text-slate-500">No accreditation data available.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Gallery */}
      {college.galleries?.length > 0 && (
        <Card className="border-0 shadow-sm ring-1 ring-slate-100">
          <CardHeader className="border-b border-slate-50 bg-white">
            <CardTitle className="text-xl flex items-center gap-2"><ImageIcon className="h-5 w-5 text-indigo-500" /> Gallery</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {college.galleries.map((img: any) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-slate-100">
                  <img src={img.image_url} alt={img.caption || 'College gallery'} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" />
                  {img.caption && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-xs font-medium truncate">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
