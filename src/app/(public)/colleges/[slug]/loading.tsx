import { Building2, Loader2 } from 'lucide-react';

export default function CollegeLoadingState() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center animate-in fade-in duration-500 delay-150">
        <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 relative overflow-hidden">
          <Building2 className="w-10 h-10 text-indigo-200" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading College Details</h2>
        <p className="text-slate-500 mb-6 font-medium">Fetching courses, fees, and campus information...</p>
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    </div>
  );
}
