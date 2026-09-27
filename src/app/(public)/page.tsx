import { Suspense } from 'react';
import Link from 'next/link';
import {
  Search, ArrowRight, GraduationCap, Building2, Users, Award,
  Briefcase, Cpu, Stethoscope, Scale, Palette, TrendingUp,
  Pill, Monitor, Code, MapPin, Star, Sparkles, ChevronRight,
  BarChart3, User, Calendar, Laptop
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GOALS } from '@/lib/constants';
import { CollegeCard } from '@/components/colleges/college-card';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { HomepageSearch } from '@/components/layout/homepage-search';
import { HeroSlider } from '@/components/home/hero-slider';
import { BlogSection } from '@/components/home/blog-section';
import { FaqSection } from '@/components/home/faq-section';
import { VerificationPopup } from '@/components/home/verification-popup';

const goalIcons: Record<string, React.ElementType> = {
  Briefcase, Cpu, Stethoscope, Scale, Palette, TrendingUp,
  Users, Pill, Monitor, Code, GraduationCap, Laptop,
};

const goalColors: Record<string, { bg: string; icon: string; border: string; gradient: string }> = {
  mba: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'hover:border-amber-200', gradient: 'from-amber-400 to-orange-500' },
  'online-mba': { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'hover:border-indigo-200', gradient: 'from-indigo-500 to-purple-600' },
  engineering: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'hover:border-blue-200', gradient: 'from-blue-400 to-indigo-500' },
  medical: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'hover:border-emerald-200', gradient: 'from-emerald-400 to-teal-500' },
  law: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'hover:border-purple-200', gradient: 'from-purple-400 to-violet-500' },
  design: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'hover:border-pink-200', gradient: 'from-pink-400 to-rose-500' },
  commerce: { bg: 'bg-cyan-50', icon: 'text-cyan-600', border: 'hover:border-cyan-200', gradient: 'from-cyan-400 to-sky-500' },
  management: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'hover:border-indigo-200', gradient: 'from-indigo-400 to-blue-500' },
  pharmacy: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'hover:border-rose-200', gradient: 'from-rose-400 to-pink-500' },
  bca: { bg: 'bg-sky-50', icon: 'text-sky-600', border: 'hover:border-sky-200', gradient: 'from-sky-400 to-cyan-500' },
  mca: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'hover:border-violet-200', gradient: 'from-violet-400 to-purple-500' },
};

const cities = [
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop', colleges: '2,100+' },
  { name: 'Pune', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop', colleges: '1,800+' },
  { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop', colleges: '1,500+' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800&auto=format&fit=crop', colleges: '1,200+' },
  { name: 'Chennai', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop', colleges: '900+' },
  { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop', colleges: '800+' },
  { name: 'Kolkata', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop', colleges: '750+' },
  { name: 'Ahmedabad', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop', colleges: '600+' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop', colleges: '500+' },
  { name: 'Lucknow', image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop', colleges: '450+' },
];



const topExams = [
  { name: 'JEE Main', date: 'April 2026', participants: '12 Lakh+' },
  { name: 'NEET UG', date: 'May 2026', participants: '20 Lakh+' },
  { name: 'CAT', date: 'Nov 2026', participants: '3 Lakh+' },
  { name: 'GATE', date: 'Feb 2026', participants: '8 Lakh+' },
  { name: 'CUET UG', date: 'May 2026', participants: '15 Lakh+' },
  { name: 'CLAT', date: 'Dec 2025', participants: '1 Lakh+' },
  { name: 'MAT', date: 'Sep 2025', participants: '2 Lakh+' },
  { name: 'XAT', date: 'Jan 2026', participants: '1.5 Lakh+' },
];

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: featuredCollegesData } = await supabase
    .from('colleges')
    .select('*, cities(name), states(name)')
    .eq('is_active', true)
    .eq('status', 'published')
    .eq('is_featured', true)
    .limit(8);
    
  const featuredColleges = featuredCollegesData || [];

  const { data: latestBlogsData } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(8);

  const latestBlogs = latestBlogsData || [];

  return (
    <div>
      {/* Verification popup for new registrations */}
      <Suspense fallback={null}>
        <VerificationPopup />
      </Suspense>
      {/* Hero Section */}
      <HeroSlider>
        <HomepageSearch />
      </HeroSlider>

      {/* Quick Stats Section */}
      <section className="relative -mt-16 z-50 px-4 mb-16">
        <div className="container mx-auto">
          <div className="bg-[#0A0A0B]/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 py-4 px-6 md:py-6 md:px-10 max-w-[1400px] mx-auto relative overflow-hidden">
            {/* Glossy gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-rose-500/10 opacity-50" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/30 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/30 rounded-full blur-[80px]" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10 divide-x divide-white/10">
              {[
                { icon: Building2, label: 'Colleges', value: '10,000+' },
                { icon: GraduationCap, label: 'Courses', value: '50,000+' },
                { icon: Users, label: 'Students', value: '1M+' },
                { icon: Star, label: 'Reviews', value: '500K+' },
              ].map((stat, idx) => (
                <div key={stat.label} className={`group flex flex-row items-center justify-center gap-3 md:gap-4 ${idx % 2 === 0 ? 'border-none md:border-solid' : 'border-none'}`}>
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 text-white/80 shrink-0 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white transition-all shadow-inner border border-white/5">
                    <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-0.5">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="pt-8 pb-20 md:pt-12 md:pb-28 relative overflow-hidden bg-gray-50/50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-white text-indigo-600 border-indigo-100 mb-6 px-4 py-1.5 rounded-full shadow-sm text-sm font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4 mr-2" />
              Career Paths
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Explore by Goal</h2>
            <p className="text-gray-500 mt-4 text-xl max-w-2xl mx-auto">Find the best colleges perfectly aligned with your career aspirations and academic dreams.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 max-w-[1400px] mx-auto">
            {GOALS.map((goal) => {
              const IconComp = goalIcons[goal.icon] || GraduationCap;
              const colors = goalColors[goal.slug] || { bg: 'bg-gray-50', icon: 'text-gray-600', border: 'hover:border-gray-200', gradient: 'from-gray-400 to-gray-600' };
              
              return (
                <Link key={goal.slug} href={`/colleges?goal=${goal.slug}`}>
                  <div className="group relative bg-white rounded-[2rem] border border-gray-100/80 py-6 px-5 md:py-8 md:px-6 text-left transition-all duration-500 cursor-pointer h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden flex flex-col justify-between min-h-[180px]">
                    {/* Glowing gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                    
                    {/* Top color bar */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm relative z-10`}>
                      <IconComp className={`h-7 w-7 ${colors.icon}`} />
                    </div>
                    
                    <div className="relative z-10 mt-auto">
                      <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-1.5 group-hover:text-indigo-600 transition-colors">{goal.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center font-semibold">
                        Explore 
                        <ArrowRight className={`h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${colors.icon} transition-all duration-300`} />
                      </p>
                    </div>
                    
                    {/* Large faded background icon */}
                    <IconComp className={`absolute -bottom-6 -right-6 h-32 w-32 ${colors.icon} opacity-[0.03] group-hover:opacity-[0.08] group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Colleges Section */}
      <section className="py-20 md:py-28 bg-[#0A0A0B] relative overflow-hidden">
        {/* Dark theme background effects */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <Badge className="bg-white/10 text-blue-300 border-white/10 mb-4 px-4 py-1.5 rounded-full backdrop-blur-md">
                <Star className="h-4 w-4 mr-2" />
                Featured Institutions
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Top Colleges in India</h2>
              <p className="text-gray-400 mt-4 text-xl">Discover premium institutions with world-class facilities and exceptional placement records.</p>
            </div>
            <Link href="/colleges">
              <Button variant="outline" className="hidden sm:flex items-center gap-2 border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-full px-6 h-12 font-semibold">
                View All Colleges
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredColleges.map((college) => (
              <div key={college.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                <div className="relative h-full">
                  <CollegeCard college={college} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link href="/colleges">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white hover:text-black rounded-full h-12 font-semibold">
                View All Colleges
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Cities Section */}
      <section className="py-20 md:py-28 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 mb-4 px-4 py-1.5 rounded-full shadow-sm">
              <MapPin className="h-4 w-4 mr-2" />
              Locations
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Top Education Hubs</h2>
            <p className="text-gray-500 mt-4 text-xl max-w-2xl mx-auto">Discover colleges in India's fastest-growing student cities and vibrant tech hubs.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {cities.map((city) => (
              <Link key={city.name} href={`/colleges?city=${city.name.toLowerCase()}`}>
                <div className="group relative h-48 md:h-64 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                    style={{ backgroundImage: `url(${city.image})` }}
                  />
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent transition-opacity duration-300" />
                  
                  <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full transition-transform duration-300">
                    <h3 className="font-bold text-white text-xl md:text-2xl mb-1 tracking-tight">
                      {city.name}
                    </h3>
                    <p className="text-sm text-emerald-300 font-medium">
                      {city.colleges} colleges
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Exams Section (Redesigned as 4x2 grid) */}
      <section className="py-10 md:py-16 relative overflow-hidden bg-white">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-rose-50/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-rose-50 text-rose-600 border-rose-100 mb-4 px-4 py-1.5 rounded-full shadow-sm">
              <Calendar className="h-4 w-4 mr-2" />
              Exams
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Upcoming Exams</h2>
            <p className="text-gray-500 mt-4 text-xl max-w-2xl mx-auto">Mark your calendars for the most important entrance exams of the year.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topExams.map((exam, idx) => {
              // Creating a rotating color scheme for the cards
              const gradients = [
                'from-rose-500/10 to-transparent',
                'from-indigo-500/10 to-transparent',
                'from-emerald-500/10 to-transparent',
                'from-amber-500/10 to-transparent'
              ];
              const glowColors = [
                'bg-rose-400',
                'bg-indigo-400',
                'bg-emerald-400',
                'bg-amber-400'
              ];
              const buttonDefault = [
                'bg-rose-50 text-rose-600 hover:bg-rose-600',
                'bg-indigo-50 text-indigo-600 hover:bg-indigo-600',
                'bg-emerald-50 text-emerald-600 hover:bg-emerald-600',
                'bg-amber-50 text-amber-600 hover:bg-amber-500'
              ];
              const iconColor = [
                'text-rose-600',
                'text-indigo-600',
                'text-emerald-600',
                'text-amber-500'
              ];
              
              const gIdx = idx % 4;

              return (
                <div 
                  key={exam.name} 
                  className="group relative bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
                >
                  {/* Subtle top gradient */}
                  <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${gradients[gIdx]} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Glowing blur orb */}
                  <div className={`absolute -right-10 -top-10 w-40 h-40 ${glowColors[gIdx]} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 group-hover:scale-150 transition-all duration-700`} />
                  
                  <div className="relative z-10 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Award className={`h-6 w-6 ${iconColor[gIdx]}`} />
                      </div>
                      <Badge variant="secondary" className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                        Exam
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{exam.name}</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                        <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-sm font-semibold">{exam.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                        <Users className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-sm font-semibold">{exam.participants}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative mt-auto z-10 pt-2 border-t border-gray-50">
                    <Button variant="outline" className={`w-full ${buttonDefault[gIdx]} border-transparent hover:text-white rounded-xl h-11 font-semibold transition-all duration-300 shadow-sm group/btn`}>
                      <span className="relative z-10">View Details</span>
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300 absolute right-6 z-10" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0A0A0B] border border-white/10 shadow-2xl">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 opacity-[0.15]" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
            <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-b from-indigo-500/20 to-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-t from-violet-500/20 to-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative p-8 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
              <div className="text-left flex-1 max-w-2xl z-10">
                <Badge variant="outline" className="bg-white/5 text-indigo-300 border-indigo-500/30 backdrop-blur-md mb-8 py-1.5 px-4 rounded-full text-xs font-semibold tracking-wide uppercase">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" /> For Institutions
                  </span>
                </Badge>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                  Elevate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">institution's</span> digital presence.
                </h2>
                
                <p className="text-slate-400 mb-10 text-lg md:text-xl leading-relaxed max-w-xl">
                  Join India's fastest-growing education platform. Showcase your campus, manage applications, and connect with millions of prospective students—all from one unified dashboard.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register?type=college">
                    <Button size="lg" className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-500 hover:text-white h-14 px-8 rounded-full font-bold text-base transition-all duration-300 shadow-[0_0_30px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_0_rgba(79,70,229,0.6)] border border-indigo-500">
                      Partner with us
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full font-semibold text-base text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-500 hover:text-white transition-all duration-300 backdrop-blur-sm">
                      View pricing & plans
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Side - Visual / Stats */}
              <div className="flex-1 w-full lg:w-auto relative perspective-1000 z-10 hidden md:block">
                <div className="relative w-full max-w-md mx-auto aspect-square">
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-3xl transform rotate-3 scale-95 shadow-2xl transition-transform duration-700 hover:rotate-6" />
                  <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-3xl transform -rotate-3 scale-95 shadow-2xl transition-transform duration-700 hover:-rotate-6" />
                  
                  {/* Main Card */}
                  <div className="absolute inset-0 rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl shadow-2xl p-8 flex flex-col justify-between transform transition-transform duration-700 hover:-translate-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-inner">
                          <BarChart3 className="h-7 w-7 text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">Growth Dashboard</p>
                          <p className="text-slate-400 text-sm">Live analytics</p>
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-slate-300 font-medium">Student Impressions</span>
                          <span className="text-emerald-400 font-bold">+124%</span>
                        </div>
                        <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[75%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-slate-300 font-medium">Application Rate</span>
                          <span className="text-emerald-400 font-bold">+82%</span>
                        </div>
                        <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-[60%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 mt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-3">
                           {/* Avatar circles */}
                           {[
                             'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                             'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
                             'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                             'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
                           ].map((url, i) => (
                             <div key={i} className="h-10 w-10 rounded-full border-2 border-[#1a1a1c] bg-slate-800 flex items-center justify-center shadow-lg overflow-hidden relative group/avatar">
                               <img src={url} alt="Active Student" className="w-full h-full object-cover transition-transform duration-300 group-hover/avatar:scale-110" />
                             </div>
                           ))}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-extrabold text-white">10k+</p>
                          <p className="text-xs text-slate-400 font-medium">Active Students</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BlogSection blogs={latestBlogs} />
      <FaqSection />
    </div>
  );
}
