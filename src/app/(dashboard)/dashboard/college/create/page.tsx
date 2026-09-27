'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  Building2, ArrowRight, ArrowLeft, MapPin, Globe, Mail, Phone,
  CheckCircle2, Sparkles
} from 'lucide-react';
import { createCollegeWithProfile } from '@/lib/actions/college-admin';
import { State, City } from 'country-state-city';

const indiaStates = State.getStatesOfCountry('IN');

const OWNERSHIP_TYPES = ['government', 'private', 'deemed', 'autonomous'] as const;
const COLLEGE_TYPES = [
  'Engineering', 'Management', 'Medical', 'Law', 'Arts & Science', 
  'Commerce', 'Pharmacy', 'Architecture', 'Education', 'Agriculture',
  'Dental', 'Nursing', 'Design', 'Polytechnic', 'Other'
] as const;
const NAAC_GRADES = ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'Not Accredited'] as const;

const COMMON_FACILITIES = [
  'Library', 'Hostel', 'Sports Complex', 'Cafeteria', 'Wi-Fi', 
  'Computer Lab', 'Auditorium', 'Gymnasium', 'Swimming Pool',
  'Medical Facility', 'Transport', 'Placement Cell', 'ATM',
  'Bank', 'Parking', 'Seminar Hall', 'Research Lab'
];

const STEPS = [
  { num: 1, label: 'Basic Info', description: 'Institution identity details', icon: Building2 },
  { num: 2, label: 'Contact & Location', description: 'Address & reachability', icon: MapPin },
  { num: 3, label: 'Details & Facilities', description: 'Accreditations & campus life', icon: Sparkles },
];

export default function CreateCollegePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedStateCode, setSelectedStateCode] = useState('');
  
  const citiesForState = selectedStateCode ? City.getCitiesOfState('IN', selectedStateCode) : [];

  const totalSteps = 3;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('facilities', selectedFacilities.join(','));

    const result = await createCollegeWithProfile(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push('/dashboard/college/edit');
    router.refresh();
  }

  function toggleFacility(f: string) {
    setSelectedFacilities(prev => 
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button type="button" onClick={() => router.back()} className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">List your College</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Join our platform and showcase your institution to thousands of students.</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl flex items-center shadow-sm">
          <span className="w-2 h-2 rounded-full bg-rose-500 mr-3 animate-pulse" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar - Vertical Stepper */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Progress</h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {STEPS.map((s, index) => {
              const isCompleted = step > s.num;
              const isActive = step === s.num;
              const isUpcoming = step < s.num;
              const Icon = s.icon;

              return (
                <div key={s.num} className="relative flex items-center gap-4">
                  <div className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-sm shrink-0",
                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                    isActive ? "bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-50" :
                    "bg-white border-slate-200 text-slate-400"
                  )}>
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className={cn("text-sm font-bold transition-colors", isActive ? "text-slate-900" : "text-slate-500")}>{s.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content - Form Fields */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          
          <div className="flex-1 p-8">
            {/* Step 1: Basic Info */}
            <div className={cn("space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", step !== 1 && "hidden")}>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
                <p className="text-slate-500 text-sm mt-1 mb-6">The core identity of your institution.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold">Institution Name <span className="text-rose-500">*</span></Label>
                <Input id="name" name="name" placeholder="e.g. Indian Institute of Technology Bombay" required className="h-11 bg-slate-50/50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description" className="text-slate-700 font-semibold">Short Description</Label>
                <Input id="short_description" name="short_description" placeholder="A brief one-line description" maxLength={500} className="h-11 bg-slate-50/50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-semibold">Full Description</Label>
                <Textarea id="description" name="description" placeholder="Detailed description about your college..." className="min-h-[120px] bg-slate-50/50 resize-y" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="established_year" className="text-slate-700 font-semibold">Established Year</Label>
                  <Input id="established_year" name="established_year" type="number" min={1800} max={2030} placeholder="e.g. 1958" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownership_type" className="text-slate-700 font-semibold">Ownership Type</Label>
                  <select id="ownership_type" name="ownership_type" className="flex h-11 w-full items-center rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    <option value="">Select Type</option>
                    {OWNERSHIP_TYPES.map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="college_type" className="text-slate-700 font-semibold">College Type</Label>
                  <select id="college_type" name="college_type" className="flex h-11 w-full items-center rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    <option value="">Select Type</option>
                    {COLLEGE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university" className="text-slate-700 font-semibold">Affiliated University</Label>
                  <Input id="university" name="university" placeholder="e.g. University of Mumbai" className="h-11 bg-slate-50/50" />
                </div>
              </div>
            </div>

            {/* Step 2: Contact & Location */}
            <div className={cn("space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", step !== 2 && "hidden")}>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Contact & Location</h2>
                <p className="text-slate-500 text-sm mt-1 mb-6">How students can reach or find your campus.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 font-semibold"><Mail className="h-4 w-4 text-slate-400" /> Email</Label>
                  <Input id="email" name="email" type="email" placeholder="info@college.edu" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 font-semibold"><Phone className="h-4 w-4 text-slate-400" /> Phone</Label>
                  <Input id="phone" name="phone" placeholder="+91-XX-XXXXXXXX" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2 text-slate-700 font-semibold"><Globe className="h-4 w-4 text-slate-400" /> Website</Label>
                  <Input id="website" name="website" placeholder="https://www.college.edu" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="flex items-center gap-2 text-slate-700 font-semibold"><MapPin className="h-4 w-4 text-slate-400" /> Pincode</Label>
                  <Input id="pincode" name="pincode" placeholder="400001" maxLength={6} className="h-11 bg-slate-50/50" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">State</Label>
                  <select 
                    className="flex h-11 w-full items-center rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    value={selectedStateCode}
                    onChange={(e) => setSelectedStateCode(e.target.value)}
                  >
                    <option value="">Select State</option>
                    {indiaStates.map(state => (
                      <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                    ))}
                  </select>
                  <input type="hidden" name="state_name" value={indiaStates.find(s => s.isoCode === selectedStateCode)?.name || ''} />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">City</Label>
                  <select 
                    name="city_name"
                    className="flex h-11 w-full items-center rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <option value="">Select City</option>
                    {citiesForState.map(city => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="address" className="text-slate-700 font-semibold">Full Campus Address</Label>
                <Textarea id="address" name="address" placeholder="Complete address with landmark..." className="min-h-[100px] bg-slate-50/50" />
              </div>
            </div>

            {/* Step 3: Details & Facilities */}
            <div className={cn("space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", step !== 3 && "hidden")}>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Details & Facilities</h2>
                <p className="text-slate-500 text-sm mt-1 mb-6">Accreditation, approvals, and campus facilities.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accreditation" className="text-slate-700 font-semibold">Accreditation</Label>
                  <Input id="accreditation" name="accreditation" placeholder="e.g. NAAC A+" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="naac_grade" className="text-slate-700 font-semibold">NAAC Grade</Label>
                  <select id="naac_grade" name="naac_grade" className="flex h-11 w-full items-center rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    <option value="">Select Grade</option>
                    {NAAC_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approved_by" className="text-slate-700 font-semibold">Approved By</Label>
                  <Input id="approved_by" name="approved_by" placeholder="e.g. AICTE, UGC" className="h-11 bg-slate-50/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="affiliation" className="text-slate-700 font-semibold">Affiliation</Label>
                  <Input id="affiliation" name="affiliation" placeholder="e.g. University of Pune" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus_area" className="text-slate-700 font-semibold">Campus Area</Label>
                  <Input id="campus_area" name="campus_area" placeholder="e.g. 50 acres" className="h-11 bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_students" className="text-slate-700 font-semibold">Total Students</Label>
                  <Input id="total_students" name="total_students" type="number" placeholder="e.g. 5000" className="h-11 bg-slate-50/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="total_faculty" className="text-slate-700 font-semibold">Total Faculty</Label>
                  <Input id="total_faculty" name="total_faculty" type="number" placeholder="e.g. 250" className="h-11 bg-slate-50/50" />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 col-span-2 pt-8">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" name="boys_hostel" value="true" className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Boys Hostel Available</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" name="girls_hostel" value="true" className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Girls Hostel Available</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" name="nba_accredited" value="true" className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">NBA Accredited</span>
                  </label>
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <Label className="text-slate-700 font-bold text-base">Campus Facilities</Label>
                <div className="flex flex-wrap gap-2.5">
                  {COMMON_FACILITIES.map(f => {
                    const isSelected = selectedFacilities.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFacility(f)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 flex items-center gap-1.5 cursor-pointer",
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:border-indigo-700"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        {isSelected && <CheckCircle2 className="h-4 w-4" />}
                        {f}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-slate-50/80 p-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="font-semibold px-6 border-slate-200 hover:bg-white hover:text-slate-900 bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous Step
              </Button>
            ) : (
              <div /> // Spacer
            )}
            
            {step < 3 ? (
              <Button type="button" onClick={() => setStep(step + 1)} className="px-8 font-semibold ml-auto">
                Next Step <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 font-semibold shadow-lg shadow-indigo-200 ml-auto group">
                {loading ? 'Submitting...' : 'List your College'}
                {!loading && <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
