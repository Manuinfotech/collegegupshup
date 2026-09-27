import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Laptop, Briefcase, Cpu, Stethoscope, Scale, Palette, 
  TrendingUp, Users, Pill, Monitor, Code, GraduationCap, 
  ArrowRight, Sparkles, CheckCircle2, Clock, Award, 
  BookOpen, Star, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GOALS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Top Courses & Degrees in India 2025 - Online MBA, MBA, B.Tech, MCA & More',
  description: 'Explore in-demand courses, undergraduate degrees, postgraduate programs, and Online MBA courses across India. Compare fees, career scope, and top colleges.',
};

const COURSE_CATEGORIES = [
  {
    category: 'Online & Distance Degrees',
    description: 'Flexible, UGC-entitled programs designed for working professionals and ambitious learners.',
    featured: true,
    courses: [
      {
        name: 'Online MBA',
        slug: 'online-mba',
        degree: 'Postgraduate',
        duration: '2 Years',
        badge: 'Most Popular',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        avgFees: '₹1.2L - ₹3.5L',
        avgPackage: '₹8L - ₹18L',
        icon: Laptop,
        highlights: [
          'UGC-DEB approved & recognized globally',
          'Live weekend masterclasses & flexible recorded lectures',
          'Top specializations: Data Analytics, Finance, Marketing & HR',
          '100% placement support & alumni networking',
        ],
        description: 'Accelerate your career without quitting your job. Get an accredited MBA degree from premier universities with high ROI.',
      },
      {
        name: 'Online MCA',
        slug: 'mca',
        degree: 'Postgraduate',
        duration: '2 Years',
        badge: 'High Demand',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        avgFees: '₹1.0L - ₹2.5L',
        avgPackage: '₹6L - ₹14L',
        icon: Code,
        highlights: [
          'Cloud computing, AI/ML & full-stack curriculum',
          'Industry-standard capstone projects',
          'Flexible self-paced schedule',
        ],
        description: 'Comprehensive computer applications master program preparing you for top tech engineering roles.',
      },
      {
        name: 'Online BBA',
        slug: 'management',
        degree: 'Undergraduate',
        duration: '3 Years',
        badge: 'Trending',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        avgFees: '₹80K - ₹2.0L',
        avgPackage: '₹4.5L - ₹8L',
        icon: TrendingUp,
        highlights: [
          'Foundations of business management & entrepreneurship',
          'Internship opportunities with corporate partners',
          'Affordable fee structures with EMI options',
        ],
        description: 'Ideal undergraduate business degree for starting a career in marketing, HR, or finance.',
      },
    ],
  },
  {
    category: 'Management & Business',
    description: 'Premier business administration and management courses for leadership careers.',
    featured: false,
    courses: [
      {
        name: 'MBA / PGDM',
        slug: 'mba',
        degree: 'Postgraduate',
        duration: '2 Years',
        badge: 'Premier',
        badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        avgFees: '₹4L - ₹25L',
        avgPackage: '₹10L - ₹32L',
        icon: Briefcase,
        highlights: ['CAT/MAT/XAT/CMAT required', 'Case-study methodology', 'Top campus placements'],
        description: 'Transformative full-time business management program for corporate leaders.',
      },
      {
        name: 'Commerce (B.Com / M.Com)',
        slug: 'commerce',
        degree: 'UG / PG',
        duration: '2-3 Years',
        badge: 'Foundation',
        badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        avgFees: '₹50K - ₹3L',
        avgPackage: '₹4L - ₹8L',
        icon: TrendingUp,
        highlights: ['Accounting, Taxation & Finance', 'Pathway to CA/CMA/CS', 'Banking careers'],
        description: 'Core financial and commercial discipline for accounting and financial analysis.',
      },
    ],
  },
  {
    category: 'Engineering & Technology',
    description: 'Technical, computing, and technological programs driving the digital economy.',
    featured: false,
    courses: [
      {
        name: 'Engineering (B.Tech / B.E.)',
        slug: 'engineering',
        degree: 'Undergraduate',
        duration: '4 Years',
        badge: 'Top Choice',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        avgFees: '₹2L - ₹15L',
        avgPackage: '₹6L - ₹22L',
        icon: Cpu,
        highlights: ['JEE Main / Advanced / State CETs', 'CS, AI, Electronics, Mechanical', 'High industry demand'],
        description: 'Rigorous engineering programs with hands-on labs, research, and high-paying jobs.',
      },
      {
        name: 'BCA (Computer Applications)',
        slug: 'bca',
        degree: 'Undergraduate',
        duration: '3 Years',
        badge: 'Tech Career',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
        avgFees: '₹1L - ₹4L',
        avgPackage: '₹3.5L - ₹7.5L',
        icon: Monitor,
        highlights: ['Software development & web technologies', 'No PCM restriction in many colleges', 'Direct IT placement'],
        description: 'Fastest route to entering the IT industry with software engineering skills.',
      },
    ],
  },
  {
    category: 'Healthcare & Science',
    description: 'Medical and pharmaceutical sciences dedicated to clinical care and research.',
    featured: false,
    courses: [
      {
        name: 'Medical (MBBS / BDS)',
        slug: 'medical',
        degree: 'Undergraduate',
        duration: '5.5 Years',
        badge: 'Healthcare',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        avgFees: '₹1L - ₹25L/yr',
        avgPackage: '₹8L - ₹20L',
        icon: Stethoscope,
        highlights: ['NEET UG entrance required', 'Clinical rotations & residency', 'Respected profession'],
        description: 'Premier medical education for healthcare practitioners and clinical specialists.',
      },
      {
        name: 'Pharmacy (B.Pharm / M.Pharm)',
        slug: 'pharmacy',
        degree: 'UG / PG',
        duration: '2-4 Years',
        badge: 'Pharma',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        avgFees: '₹1.5L - ₹6L',
        avgPackage: '₹4L - ₹9L',
        icon: Pill,
        highlights: ['Drug discovery & pharmacology', 'R&D and quality assurance', 'Clinical research roles'],
        description: 'Pharmaceutical formulation, medicine distribution, and biotechnological research.',
      },
    ],
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[#0A0A0B] text-white py-16 md:py-24 border-b border-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center text-xs md:text-sm text-gray-400 mb-6 gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-indigo-400 font-semibold">Courses & Degrees</span>
          </nav>

          <div className="max-w-3xl">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-4 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline text-amber-400" />
              Academic Programs 2025
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white font-heading">
              Explore Courses, Degrees &amp; Online Programs
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
              Compare accredited degrees, high-growth online programs like <strong>Online MBA</strong>, 
              curriculum highlights, fees, and career outcomes across India&apos;s leading institutions.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/colleges?goal=online-mba">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 rounded-full px-6 font-semibold">
                  <Laptop className="w-4 h-4 mr-2" />
                  Explore Online MBA Colleges
                </Button>
              </Link>
              <Link href="/colleges">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-6 font-medium">
                  Browse All Colleges
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pt-12 space-y-16">
        
        {/* Spotlight: Online MBA Section */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-[#0A0A0B] text-white rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden border border-indigo-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 font-bold px-3 py-1 uppercase tracking-wider text-xs">
                  🔥 High Demand Program
                </Badge>
                <span className="text-xs text-slate-300 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> 2 Years Flexible Format
                </span>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Why Pursue an <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-purple-300">Online MBA</span> in 2025?
              </h2>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                An Online MBA provides the exact same syllabus, UGC-DEB accreditation, and career clout as a traditional full-time MBA, but with total flexibility. Ideal for working executives, entrepreneurs, and graduates seeking rapid leadership promotions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  '100% Online with Weekend Live Sessions',
                  'Affordable fees with zero-cost EMI plans',
                  'Dual Specializations (Analytics, Finance, HR)',
                  'Direct campus placements & alumni networks',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs md:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <Link href="/colleges?goal=online-mba">
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 rounded-xl shadow-lg shadow-amber-500/20">
                    Find Online MBA Colleges
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/online-mba-colleges" className="text-sm font-semibold text-indigo-300 hover:text-white flex items-center">
                  View Top Ranked Online MBA Institutes <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
              <h3 className="font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Online MBA Quick Facts
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-semibold text-white">2 Years (4 Semesters)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Eligibility</span>
                  <span className="font-semibold text-white">Graduation with 50%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Approx. Fee Range</span>
                  <span className="font-semibold text-emerald-400">₹1,20,000 - ₹3,50,000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Avg. Salary Hike</span>
                  <span className="font-semibold text-amber-300">50% - 120% Post Completion</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Recognition</span>
                  <span className="font-semibold text-white">UGC-DEB, AICTE, WES</span>
                </div>
              </div>

              <div className="bg-indigo-500/10 rounded-xl p-3 text-xs text-indigo-200 border border-indigo-500/20">
                Tip: Many top institutions offer no-cost EMI starting from ₹4,999/month.
              </div>
            </div>
          </div>
        </section>

        {/* Categories of Courses */}
        {COURSE_CATEGORIES.map((category) => (
          <section key={category.category} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  {category.category}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.courses.map((course) => {
                const IconComp = course.icon;
                return (
                  <Card key={course.name} className="border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center transition-colors duration-300 shadow-sm">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className={`${course.badgeColor} font-semibold text-xs`}>
                          {course.badge}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {course.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{course.degree} • {course.duration}</p>
                      </div>

                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>

                      <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Average Fees:</span>
                          <span className="font-semibold text-slate-800">{course.avgFees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Avg. Package:</span>
                          <span className="font-semibold text-emerald-600">{course.avgPackage}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Highlights:</p>
                        {course.highlights.map((h, i) => (
                          <div key={i} className="flex items-start text-xs text-slate-600 gap-1.5">
                            <span className="text-indigo-500 mt-0.5">•</span>
                            <span className="line-clamp-1">{h}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <div className="p-4 pt-0">
                      <Link href={`/colleges?goal=${course.slug}`}>
                        <Button variant="outline" className="w-full bg-white hover:bg-indigo-600 hover:text-white border-slate-200 group-hover:border-indigo-600 font-semibold transition-all">
                          <span>Explore {course.name} Colleges</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}

        {/* Stream Quick Links */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <h3 className="font-bold text-xl text-slate-900 mb-2">Explore Colleges by Goal</h3>
          <p className="text-sm text-slate-500 mb-6">Directly discover verified colleges offering your preferred degrees.</p>
          <div className="flex flex-wrap gap-2.5">
            {GOALS.map((goal) => (
              <Link key={goal.slug} href={`/colleges?goal=${goal.slug}`}>
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all cursor-pointer">
                  {goal.name} Colleges
                </Badge>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
