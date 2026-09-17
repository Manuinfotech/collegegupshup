'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, Star, Download, Phone, Mail, Globe,
  ChevronRight, Calendar, ShieldCheck, Heart, Share2,
  Trophy, Users, GraduationCap, Building2, TrendingUp,
  Award, Globe2, CheckCircle2, Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LeadForm } from '@/components/colleges/lead-form';
import { ProfileTab, AcademicsTab, AdmissionTab, CareerTab, ExperienceTab, DecisionTab } from '@/components/colleges/tabs';
import Image from 'next/image';

interface CollegeClientProps {
  college: any;
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'courses', label: 'Courses & Fees' },
  { id: 'admission', label: 'Admissions 2026' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'cutoff', label: 'CutOff' },
  { id: 'placement', label: 'Placements' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'scholarship', label: 'Scholarships' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'hostel', label: 'Hostel' }
];

export function CollegeDetailClient({ college }: CollegeClientProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  // Fallbacks
  const cityName = college.cities?.name || college.city_name || 'Location';
  const stateName = college.states?.name || college.state_name || 'State';
  const bannerImage = college.cover_image_url || '/cg_banner.webp';
  const logoImage = college.logo_url || '/cg_logo.webp';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-indigo-500/30">
      
      {/* Top Action Bar (Breadcrumbs & Share) */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
            <nav className="flex items-center text-[13px] font-medium text-gray-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
              <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center">
                <span className="sr-only">Home</span>
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 mx-1 opacity-50 shrink-0" />
              <Link href="/colleges" className="hover:text-indigo-600 transition-colors">Colleges</Link>
              <ChevronRight className="w-3.5 h-3.5 mx-1 opacity-50 shrink-0" />
              <Link href={`/colleges?state=${stateName.toLowerCase()}`} className="hover:text-indigo-600 transition-colors">{stateName}</Link>
              <ChevronRight className="w-3.5 h-3.5 mx-1 opacity-50 shrink-0" />
              <Link href={`/colleges?city=${cityName.toLowerCase()}`} className="hover:text-indigo-600 transition-colors">{cityName}</Link>
              <ChevronRight className="w-3.5 h-3.5 mx-1 opacity-50 shrink-0" />
              <span className="text-gray-900 font-semibold">{college.name}</span>
            </nav>
            
            <div className="flex items-center gap-4 shrink-0 text-sm font-medium text-gray-600">
              <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Heart className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-6 max-w-[1400px]">
        
        {/* Edge-to-Edge Hero Banner Card */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#1E2532] shadow-sm mb-6">
          
          {/* Background Banner */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={bannerImage} 
              alt={`${college.name} Campus`} 
              className="w-full h-full object-cover opacity-60"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#171B24] via-[#171B24]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#171B24] via-transparent to-transparent opacity-80"></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-6 p-6 lg:p-10 lg:pb-8 justify-between items-start lg:items-end">
            
            {/* Left side: Logo & College Info */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              
              {/* Logo Box */}
              <div className="w-[120px] h-[120px] bg-white rounded-2xl shadow-lg p-2 shrink-0 border border-white/10 flex items-center justify-center overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={logoImage} 
                  alt={`${college.name} Logo`} 
                  className="w-full h-full object-contain" 
                />
              </div>

              {/* Text Info */}
              <div className="space-y-3 pt-2">
                <h1 className="text-3xl md:text-[32px] font-bold text-white tracking-tight leading-tight">
                  {college.name}
                </h1>
                
                {/* Tagline / Subtitle */}
                {college.university_name && (
                  <p className="text-gray-300 text-[15px] max-w-2xl font-medium">
                    {college.name} - Affiliated to {college.university_name}
                  </p>
                )}
                {!college.university_name && college.short_description && (
                  <p className="text-gray-300 text-[15px] max-w-2xl font-medium line-clamp-1">
                    {college.short_description}
                  </p>
                )}

                {/* Info List */}
                <div className="flex flex-wrap items-center gap-5 text-[14px] text-gray-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 opacity-70" />
                    {cityName}, {stateName}
                  </div>
                  
                  {college.established_year && (
                    <div className="flex items-center gap-1.5 border-l border-white/20 pl-5">
                      <Calendar className="w-4 h-4 opacity-70" />
                      Established {college.established_year}
                    </div>
                  )}
                  
                  {college.ownership_type && (
                    <div className="flex items-center gap-1.5 border-l border-white/20 pl-5">
                      <ShieldCheck className="w-4 h-4 opacity-70" />
                      {college.ownership_type} Institute
                    </div>
                  )}
                </div>

                {/* Slogan */}
                <div className="text-white/90 italic font-medium text-[15px] pt-1">
                  &quot;Nurturing Leaders for a Better Tomorrow&quot;
                </div>

                {/* Pills/Badges */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                   <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10 transition-colors">
                     <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AICTE Approved
                   </div>
                   <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10 transition-colors">
                     <Award className="w-3.5 h-3.5 text-amber-400" /> Industry Focused
                   </div>
                   <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10 transition-colors">
                     <Globe2 className="w-3.5 h-3.5 text-blue-400" /> Global Exposure
                   </div>
                   <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10 transition-colors">
                     <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Excellent Placements
                   </div>
                </div>

              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex flex-col gap-4 self-stretch lg:self-auto w-full lg:w-[280px]">
              
              {/* Rating Card */}
              <div className="bg-white rounded-[14px] p-3 flex justify-between items-center shadow-lg border border-gray-100">
                <div className="text-[34px] font-extrabold text-gray-900 leading-none tracking-tighter">4.5</div>
                <div className="flex flex-col items-end">
                  <div className="flex gap-0.5 text-[#F59E0B] mb-0.5">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current opacity-30 text-gray-400" />
                  </div>
                  <span className="text-[11px] font-medium text-gray-500">(58 Reviews)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <Dialog open={leadModalOpen} onOpenChange={setLeadModalOpen}>
                  <DialogTrigger render={
                    <Button className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white h-11 rounded-xl text-[14px] font-semibold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2">
                      <Navigation className="w-4 h-4 -rotate-45" /> Get Contact Details
                    </Button>
                  } />
                  <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none">
                     <LeadForm 
                        collegeId={college.id} 
                        collegeName={college.name} 
                        source="contact_form" 
                        onSuccess={() => setLeadModalOpen(false)}
                      />
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full bg-white hover:bg-gray-50 border-gray-200 text-[#6366F1] hover:text-[#4F46E5] h-11 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" /> Add to Compare
                </Button>
              </div>

            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex overflow-x-auto scrollbar-hide hide-scrollbar mb-6 gap-1 sticky top-16 z-40">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2.5 text-[14px] font-medium rounded-xl transition-all focus:outline-none flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#6366F1] text-white shadow-sm'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'overview' && (
              <>
                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                  <h2 className="text-xl font-bold text-[#1E2532] mb-4">About {college.name}</h2>
                  <div className="text-gray-600 leading-relaxed text-[15px] space-y-4">
                    {college.description ? (
                      <div dangerouslySetInnerHTML={{ __html: college.description }} />
                    ) : (
                      <p>
                        {college.name}, {cityName} founded in {college.established_year || '2009'} as part of the esteemed group, has been transforming business education for the past 15 years and is recognized among the top management colleges in Pune. Our program is AICTE approved and designed to develop future-ready leaders with industry-relevant skills, global exposure, and a strong focus on holistic development.
                      </p>
                    )}
                  </div>

                  {/* Stat Blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-[#F8F9FA] rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-[17px] text-gray-900">15+</div>
                        <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Years of Excellence</div>
                      </div>
                    </div>
                    
                    <div className="bg-[#F8F9FA] rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-[17px] text-gray-900">5000+</div>
                        <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Alumni Network</div>
                      </div>
                    </div>

                    <div className="bg-[#F8F9FA] rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-[17px] text-gray-900">Modern</div>
                        <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Campus in {cityName}</div>
                      </div>
                    </div>

                    <div className="bg-[#F8F9FA] rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-[17px] text-gray-900">Excellent</div>
                        <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Placement Record</div>
                      </div>
                    </div>
                  </div>
                </div>
                <ProfileTab college={college} />
              </>
            )}

            {activeTab === 'courses' && <AcademicsTab college={college} />}
            {activeTab === 'admission' && <AdmissionTab college={college} />}
            {activeTab === 'placement' && <CareerTab college={college} />}
            {activeTab === 'hostel' && <ExperienceTab college={college} />}
            {activeTab === 'reviews' && <DecisionTab college={college} />}
            
            {/* Fallback for un-implemented tabs */}
            {['cutoff', 'ranking', 'gallery', 'scholarship', 'faculty'].includes(activeTab) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                 <Building2 className="w-12 h-12 mb-4 opacity-10" />
                 <h3 className="text-xl font-semibold text-gray-900">Section Update in Progress</h3>
                 <p className="max-w-sm mt-2 text-sm text-gray-500">We are currently gathering detailed information for this section. Please check back soon.</p>
              </div>
            )}

          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Lead Form Widget */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
               <div className="p-6 pb-4">
                 <h3 className="font-bold text-[#1E2532] text-[18px] mb-1">Are You Interested in this College?</h3>
                 <p className="text-gray-500 text-sm">Get free counselling, admission guidance and latest updates.</p>
               </div>
               <div className="p-6 pt-0 space-y-3">
                 <Dialog open={leadModalOpen} onOpenChange={setLeadModalOpen}>
                  <DialogTrigger render={
                    <Button className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-xl text-[14px] h-12 shadow-sm shadow-indigo-500/20">
                      Apply Now <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  } />
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
                  <DialogTrigger render={
                    <Button variant="outline" className="w-full bg-white hover:bg-gray-50 text-[#6366F1] border-indigo-200 font-semibold rounded-xl text-[14px] h-12">
                      <Download className="w-4 h-4 mr-2" /> Download Brochure
                    </Button>
                  } />
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

            {/* Quick Contact Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32">
               <h3 className="font-bold text-[#1E2532] text-[17px] mb-5">Quick Contact</h3>
               
               <div className="space-y-4 mb-6">
                 {college.phone && (
                   <div className="flex gap-3 text-[14px]">
                     <Phone className="w-5 h-5 text-indigo-600 shrink-0" />
                     <a href={`tel:${college.phone}`} className="text-gray-600 hover:text-indigo-600 font-medium">
                       {college.phone}
                     </a>
                   </div>
                 )}
                 {college.email && (
                   <div className="flex gap-3 text-[14px]">
                     <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
                     <a href={`mailto:${college.email}`} className="text-gray-600 hover:text-indigo-600 font-medium break-all">
                       {college.email}
                     </a>
                   </div>
                 )}
                 {college.website && (
                   <div className="flex gap-3 text-[14px]">
                     <Globe className="w-5 h-5 text-indigo-600 shrink-0" />
                     <a href={college.website.startsWith('http') ? college.website : `https://${college.website}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-indigo-600 font-medium break-all">
                       {college.website}
                     </a>
                   </div>
                 )}
                 <div className="flex gap-3 text-[14px]">
                   <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
                   <span className="text-gray-600 font-medium leading-snug">
                     {college.address || `${cityName}, ${stateName}, India`}
                   </span>
                 </div>
               </div>

               {/* Mock Map Image Box */}
               <div className="w-full h-[120px] bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer border border-gray-200">
                  <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=pune&zoom=13&size=400x150&sensor=false&client=gme-browserstack')] opacity-50 grayscale group-hover:grayscale-0 transition-all bg-cover bg-center"></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] group-hover:bg-transparent transition-all">
                     <span className="bg-white/90 text-[#6366F1] font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm">View on Map</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
