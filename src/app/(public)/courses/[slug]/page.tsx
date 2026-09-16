import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CollegeCard } from '@/components/colleges/college-card';
import { BookOpen, Clock, DollarSign, GraduationCap, Building2, CheckCircle2, TrendingUp, Users } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const courseName = slug.replace(/-/g, ' ').toUpperCase();

  return {
    title: `${courseName} Course 2026 - Fees, Syllabus, Top Colleges, Scope`,
    description: `Get complete details about ${courseName} course. Explore syllabus, average fees, career scope, top recruiters, and the best colleges offering ${courseName}.`,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const courseName = slug.replace(/-/g, ' ').toUpperCase();

  // Mock course details based on slug
  const courseDetails = {
    duration: slug === 'mbbs' ? '5.5 Years' : slug.includes('m') ? '2 Years' : '3-4 Years',
    eligibility: slug === 'mba' || slug.includes('m') ? 'Graduation with 50%' : '10+2 with 50%',
    avgFees: '₹2 Lakhs - ₹15 Lakhs',
    avgSalary: '₹4 Lakhs - ₹20 Lakhs',
    level: slug.includes('m') || slug === 'mba' ? 'Postgraduate' : 'Undergraduate',
    mode: 'Full-time / Online',
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#0A0A0A] text-white py-16 md:py-24">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/40 to-transparent blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-purple-900/40 to-transparent blur-3xl opacity-50" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-slate-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-200">{courseName}</span>
          </nav>

          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4" />
              <span>{courseDetails.level} Degree Program</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              {courseName} Course Details, Colleges, Fees & Scope
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              Everything you need to know about pursuing {courseName} in India. Compare top colleges, explore career opportunities, and get complete admission guidance.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href={`/colleges?goal=${slug}`}>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all">
                  <Building2 className="mr-2 h-5 w-5" />
                  View Top Colleges
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-700 hover:text-white hover:bg-slate-800 bg-white/5 backdrop-blur-sm rounded-xl h-12 px-8">
                Download Syllabus
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            
            {/* Quick Facts */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                Course Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Duration</p>
                    <p className="font-semibold text-slate-900">{courseDetails.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Eligibility</p>
                    <p className="font-semibold text-slate-900">{courseDetails.eligibility}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Avg. Fees</p>
                    <p className="font-semibold text-slate-900">{courseDetails.avgFees}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Avg. Salary</p>
                    <p className="font-semibold text-slate-900">{courseDetails.avgSalary}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Mode</p>
                    <p className="font-semibold text-slate-900">{courseDetails.mode}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Overview */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What is {courseName}?</h2>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p>
                  {courseName} is a highly sought-after degree program designed to equip students with comprehensive knowledge and practical skills required in the modern industry landscape. The curriculum spans various specialized subjects, ensuring graduates are well-prepared for dynamic career roles.
                </p>
                <p>
                  The program typically incorporates a mix of theoretical lectures, hands-on projects, industry internships, and case studies, offering a holistic learning experience. As industries evolve rapidly, {courseName} programs continuously update their syllabus to remain relevant to current market demands.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Why choose {courseName}?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> High demand across various sectors</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Excellent career progression and salary prospects</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Opportunities for global exposure</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Strong foundation for advanced studies or entrepreneurship</li>
                </ul>
              </div>
            </section>
            
            {/* Top Colleges List Wrapper */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Top Colleges for {courseName}</h2>
                <Link href={`/colleges?goal=${slug}`} className="text-indigo-600 font-medium text-sm hover:text-indigo-700 hover:underline">
                  View All Colleges →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Render a few mock colleges for the course page */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <CollegeCard
                    key={i}
                    college={{
                      id: `${i}`,
                      name: `Premium ${courseName} Institute ${i + 1}`,
                      slug: `${slug}-institute-${i + 1}`,
                      logo_url: null,
                      cover_image_url: null,
                      short_description: `Leading institution for ${courseName} studies with excellent placements.`,
                      city_name: ['Delhi', 'Mumbai', 'Bangalore', 'Pune'][i],
                      state_name: 'India',
                      ownership_type: i % 2 === 0 ? 'private' : 'government',
                      established_year: 1980 + i * 5,
                      is_featured: i === 0,
                      is_verified: true,
                      average_rating: 4.2 + i * 0.1,
                      review_count: 120 + i * 45,
                      fees_range: '5-12 L',
                      highest_package: 2500000 + i * 500000,
                      average_package: 800000 + i * 100000,
                    }}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-600/20 sticky top-24 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <h3 className="text-xl font-bold mb-2">Need Admission Help?</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                Our expert counselors are ready to help you find the perfect {courseName} college tailored to your profile and budget.
              </p>
              
              <form className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <Button className="w-full h-11 rounded-xl bg-white text-indigo-600 hover:bg-slate-50 font-bold mt-2 shadow-lg">
                  Request Callback
                </Button>
              </form>
              
              <p className="text-xs text-indigo-200 text-center mt-4 opacity-80">
                100% Free Counseling. No hidden charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
