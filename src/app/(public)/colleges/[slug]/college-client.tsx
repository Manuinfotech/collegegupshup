'use client';

import { useState } from 'react';
import { 
  MapPin, Star, Download, Building2, Phone, Mail, 
  ChevronRight, CheckCircle2, Navigation, Award, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LeadForm } from '@/components/colleges/lead-form';
import { ProfileTab, AcademicsTab, AdmissionTab, CareerTab, ExperienceTab, DecisionTab } from '@/components/colleges/tabs';

interface CollegeClientProps {
  college: any;
}

const TABS = [
  { id: 'info', label: 'Info' },
  { id: 'courses', label: 'Courses & Fees' },
  { id: 'admission', label: 'Admission 2026' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'cutoff', label: 'CutOff' },
  { id: 'placement', label: 'Placement' },
  { id: 'ranking', label: 'Ranking' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'scholarship', label: 'Scholarship' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'hostel', label: 'Hostel' }
];

export function CollegeDetailClient({ college }: CollegeClientProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Dark Hero Section (Inspired by reference) */}
      <section className="bg-[#2D333F] text-slate-100 pt-10 pb-0 relative overflow-hidden">
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between pb-8">
            
            {/* Left side: Logo + Details */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Logo Box */}
              <div className="w-28 h-28 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden shrink-0 border-4 border-[#2D333F] mt-2">
                {college.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={college.logo_url} alt={`${college.name} Logo`} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="h-12 w-12 text-slate-300" />
                )}
              </div>
              
              {/* Info */}
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  {college.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-300">
                  <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {college.cities?.name || college.city_name || 'Location'}, {college.states?.name || college.state_name || 'State'}
                  </div>
                  {college.approvals && college.approvals.length > 0 && (
                    <div className="flex items-center gap-1.5 border-l border-slate-600 pl-4 hover:text-white transition-colors cursor-pointer">
                      <Award className="h-4 w-4 text-slate-400" />
                      {college.approvals.join(', ')} Approved
                    </div>
                  )}
                  {college.established_year && (
                    <div className="flex items-center gap-1.5 border-l border-slate-600 pl-4 hover:text-white transition-colors cursor-pointer">
                      <BookOpen className="h-4 w-4 text-slate-400" />
                      Estd {college.established_year}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Actions & Rating */}
            <div className="flex flex-col items-end gap-5 self-stretch sm:self-auto w-full sm:w-auto mt-4 lg:mt-0">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="text-4xl font-extrabold text-white">4.5</div>
                <div className="flex flex-col">
                  <div className="flex text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current opacity-30 text-white" />
                  </div>
                  <span className="text-[11px] text-slate-300 underline underline-offset-2 hover:text-white cursor-pointer">(58 Reviews)</span>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Dialog open={leadModalOpen} onOpenChange={setLeadModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-transparent border border-white text-white hover:bg-white hover:text-[#2D333F] font-semibold flex-1 sm:flex-none shadow-none rounded-full px-6 transition-all">
                      Get Contact Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none">
                     <LeadForm 
                        collegeId={college.id} 
                        collegeName={college.name} 
                        source="contact_form" 
                        onSuccess={() => setLeadModalOpen(false)}
                      />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

          </div>

          {/* Sticky Tab Navigation attached to hero bottom */}
          <div className="flex overflow-x-auto scrollbar-hide hide-scrollbar -mb-px mt-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-5 text-[15px] font-medium transition-colors focus:outline-none border-b-[3px] ${
                  activeTab === tab.id
                    ? 'border-[#2563EB] text-white bg-slate-800/30'
                    : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Sticky Tab Navigation (for scrolling) */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm hidden md:block" style={{ transform: 'translateY(-1px)' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex overflow-x-auto scrollbar-hide hide-scrollbar -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-3.5 px-5 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                  activeTab === tab.id
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Tab Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[500px]">
              {activeTab === 'info' && <ProfileTab college={college} />}
              {activeTab === 'courses' && <AcademicsTab college={college} />}
              {activeTab === 'admission' && <AdmissionTab college={college} />}
              {activeTab === 'placement' && <CareerTab college={college} />}
              {activeTab === 'hostel' && <ExperienceTab college={college} />}
              {activeTab === 'reviews' && <DecisionTab college={college} />}
              
              {/* Fallback for un-implemented tabs */}
              {['cutoff', 'ranking', 'gallery', 'scholarship', 'faculty'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center text-center h-64 text-slate-400">
                   <Building2 className="w-12 h-12 mb-4 opacity-20" />
                   <h3 className="text-lg font-semibold text-slate-700">Content Coming Soon</h3>
                   <p className="max-w-sm mt-2 text-sm">We are currently gathering detailed information for this section.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (Lead Form & Quick Links) */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-6 pb-2">
                 <h3 className="font-bold text-slate-900 text-lg mb-1">Are You Interested in this College?</h3>
               </div>
               <div className="p-6 pt-3 space-y-3">
                 <Dialog open={leadModalOpen} onOpenChange={setLeadModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-[#E85D26] hover:bg-[#d6521f] text-white font-medium rounded-lg text-[15px] h-12 shadow-sm">
                      Apply Now <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none">
                     <LeadForm 
                        collegeId={college.id} 
                        collegeName={college.name} 
                        source="apply_now" 
                        onSuccess={() => setLeadModalOpen(false)}
                      />
                  </DialogContent>
                </Dialog>

                 <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white border-0 font-medium rounded-lg text-[15px] h-12 shadow-sm">
                      Download Brochure <Download className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none">
                     <LeadForm 
                        collegeId={college.id} 
                        collegeName={college.name} 
                        source="download_brochure" 
                     />
                  </DialogContent>
                </Dialog>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden sticky top-20">
               <div className="p-6">
                 <h3 className="font-bold text-slate-900 text-lg">Suggested Communities</h3>
                 <div className="mt-4 flex flex-col items-center justify-center py-6 text-slate-400">
                    <p className="text-sm">Join the community to interact with peers.</p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
